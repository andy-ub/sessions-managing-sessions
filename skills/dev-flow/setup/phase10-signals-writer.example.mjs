// Example only: the shape of a Phase 10 Track B test script that writes its own signals.
// Copy it into the item folder and adapt the rows to the Phase 2 plan; do not run it as is.
//
// Every measurement goes to <OUT>/signals.jsonl as one JSON line:
//   { ts, row, signal, value, source }
// `signal` is the name in the plan's "Measured signal" column; `source` is the exact
// command, query or API call that produced `value`. Nothing is typed in by hand.
//
// Usage (after adapting):
//   SITE_BASE=<test-site-url> DB_COUNT_CMD="<your DB CLI that prints one number>" \
//   node <your copy>.mjs <out-dir>
import { createRequire } from 'node:module';
import { appendFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Resolve Playwright from a folder that has it installed (PLAYWRIGHT_FROM = path to its package.json).
const require = createRequire(process.env.PLAYWRIGHT_FROM ?? import.meta.url);
const { chromium } = require('playwright');

const [OUT_DIR] = process.argv.slice(2);
const OUT = OUT_DIR.replace(/[\\/]?$/, '/');
const BASE = process.env.SITE_BASE;            // the local test site, e.g. https://localhost:<port>
const ORDER_COOKIE = process.env.ORDER_COOKIE ?? 'orderId'; // the cookie the row is about
if (!BASE) throw new Error('Set SITE_BASE to the local test site URL');
mkdirSync(OUT, { recursive: true });
const SIGNALS = OUT + 'signals.jsonl';

const sig = (row, signal, value, source) =>
  appendFileSync(SIGNALS, JSON.stringify({ ts: new Date().toISOString(), row, signal, value, source }) + '\n');

// Short, stable hash: lets the reviewer compare values without seeing them.
const hash8 = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return (h >>> 0).toString(16); };

// A DB count, with the exact command as its source. DB_COUNT_CMD is your database CLI
// (for example a psql / sqlcmd / sqlite3 call) that runs the query passed as its last
// argument and prints a single number.
const count = (row, name, sql) => {
  const [cmd, ...args] = (process.env.DB_COUNT_CMD ?? '').split(' ').filter(Boolean);
  if (!cmd) throw new Error('Set DB_COUNT_CMD');
  const v = Number(execFileSync(cmd, [...args, sql]).toString().trim());
  sig(row, name, v, `${cmd} ${args.join(' ')} "${sql}"`);
  return v;
};

// Set-Cookie watcher for one row: call the returned function when the row is done.
function watchSetCookie(page, row, cookie) {
  const hits = [];
  page.on('response', async r => {
    const h = await r.headerValue('set-cookie').catch(() => null);
    if (h && h.includes(cookie)) hits.push(r.url());
  });
  return () => sig(row, 'setCookieResponses', hits, `page.on('response') header set-cookie contains ${cookie}`);
}

// A cookie as presence + hash, never raw.
async function cookieSignal(ctx, row, when, cookie) {
  const v = (await ctx.cookies()).find(c => c.name === cookie)?.value ?? null;
  sig(row, `cookie.${when}`, v === null ? null : { present: true, sha8: hash8(v) }, `context.cookies() name=${cookie}`);
  return v;
}

// The fixture's visible marker, measured: computed style of the main element.
async function markerSignal(target, row, selector) {
  const style = await target.locator(selector).first().evaluate(e => {
    const s = getComputedStyle(e);
    return `${s.borderTopColor} ${s.borderTopStyle} ${s.borderTopWidth}`;
  });
  sig(row, `${selector}.border`, style, `getComputedStyle(${selector}).borderTop{Color,Style,Width}`);
}

async function shot(page, row, file) {
  await page.screenshot({ path: OUT + file, fullPage: true });
  sig(row, 'screenshot', file, 'page.screenshot()'); // dropped by the prep script
}

// An injected check prints values exactly as the signals hold them (the hash), and says it is injected.
// Call it before a shot, e.g. await injectedCheck(page, ['cookie before: ' + hash8(before)]).
async function injectedCheck(page, lines) {
  await page.evaluate(ls => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:8px;left:8px;z-index:2147483647;background:#fff8c5;color:#000;border:3px solid #000;padding:10px 14px;font:16px/1.5 monospace;white-space:pre';
    d.textContent = ['INJECTED CHECK (test script, not product UI)', ...ls].join('\n');
    document.body.appendChild(d);
  }, lines);
}

// Headed on purpose: some features (bot filters, client-side scripts) ignore headless browsers.
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();

// Decoy for the blind review: a screen that proves no plan row. No signal line.
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.screenshot({ path: OUT + 'decoy-home.png' });

// One plan row, end to end. Adapt per row of the Phase 2 plan.
{
  const row = '1';
  count(row, 'orderRows.before', 'SELECT COUNT(*) FROM orders');
  await ctx.clearCookies({ name: ORDER_COOKIE });         // a fresh user with no open order
  const before = await cookieSignal(ctx, row, 'before', ORDER_COOKIE);
  const done = watchSetCookie(page, row, ORDER_COOKIE);
  await page.goto(`${BASE}/orders/new`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);                        // let near-real-time writes land
  await markerSignal(page, row, 'h1');
  done();
  const after = await cookieSignal(ctx, row, 'after', ORDER_COOKIE);
  await injectedCheck(page, [`cookie before: ${before ? hash8(before) : 'none'}`, `cookie after: ${after ? hash8(after) : 'none'}`]);
  await shot(page, row, 'row1-after.png');
  count(row, 'orderRows.after', 'SELECT COUNT(*) FROM orders');
}

await browser.close();
