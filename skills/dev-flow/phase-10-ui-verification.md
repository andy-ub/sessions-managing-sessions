# Phase 10 — UI verification

## Step identifier

`phase-10-ui-verification`: drive the real product through a browser on the local test site and prove the change works, before commit. The cloud test environment check comes later, in Phase 12. The cloud test environment is a staging/cloud test environment; if you have none, skip the cloud steps and the `CLOUD` tag.

## Sequence

- **Runs after:** Phase 9 Clean (code final, not yet committed).
- **Hands to:** Phase 11.

## Two tracks: pick by what changed

- **Track A, AI-assistant tool:** a new or changed tool that an AI assistant in the product calls. Verify with the four-prompt discipline across every configured assistant variant.
- **Track B, runtime behaviour:** anything whose effect is rendered or persisted rather than an assistant answer: a page, a redirect, a license or feature gate, a cookie, a data write, including "a trigger state I cannot reach in a normal session". Runs the Phase 2 test plan.

Record the choice and the reason in §7. A change can need both.

## Evidence rules (both tracks)

| # | Rule |
|---|---|
| 1 | The tracker comment is short (about half a page). Never paste the full summary. |
| 2 | Local evidence stays as files in `ui-verify-evidence/` in the item folder: screenshots, console and server logs, `ui-verify-summary.md`. No ZIP and no attachment for a local run; a local ZIP has no acceptance value. |
| 3 | The only evidence ZIP is the cloud one, built at the Phase 12 cloud check: `ui-verify-evidence_{id}-{slug}.zip`. |
| 4 | It is attached to the integration-test child task (if your team uses one), not to the parent or the dev task. |
| 5 | If the tracker integration cannot upload files, Claude builds the ZIP and gives the human the path; the human attaches it. |

**Freshness check before any run:** right branch or worktree, process start time after the last build, build output timestamps after the last edit, and for Track A a tool-list probe. A browser refresh alone does not load new server code.

**Manual fallback when browser automation is unavailable:** a clean degrade, not a verbal claim. Before Phase 11 write `ui-verify-manual.md`: why automation was unavailable, the Track A prompts or Track B rows covered, assistant variant and version if any, observed outputs, and the paths of manually captured evidence. Add the degrade to §7 and the PR body. Without this file, Phase 11 is blocked.

## Track A — AI-assistant tool

**Four prompts, every assistant variant (mandatory):**

1. **Acceptance mirror:** a prompt taken straight from an acceptance scenario.
2. **Edge probe:** not found, ambiguous, error path.
3. **Scope boundary:** a prompt that should **not** call this tool (a sibling's territory).
4. **Realistic phrasing:** how a real user would say it, not the acceptance wording.
5. **Conditional injection probe** (only if Q-sec flagged user-authored free text): a fixture whose name or title carries an instruction-like payload. Pass = the assistant reports it as data and stays on task.

Run each routing prompt in a **fresh conversation**. A follow-up in the same conversation can be answered from the previous tool result without a new call, which proves the content, not the routing.

Tool registration is model-independent, but narration differs between models, so run all prompts on every configured assistant variant.

**Capturing responses from a chat UI with a Copy button.** The automation browser shares the OS clipboard with the human's own browser, so reading the clipboard is unreliable. Intercept the Copy button's write instead:

1. Once per page (and again after each reload or variant switch):
   `() => { window.__copied=null; const cb=navigator.clipboard; if(!cb.__patched){const o=cb.writeText.bind(cb); cb.writeText=(t)=>{window.__copied=t; return o(t);}; cb.__patched=true;} return 'patched'; }`
2. For each response: set `window.__copied=null`, click the response's Copy button, read `() => window.__copied`, and write it straight to `prompt-{N}-{category}.response.md` before the next prompt.

Wait for completion on a signal that does not flicker during tool calls (for example the "Cancel" button disappearing, not a "Thinking..." label).

**Screenshot location pitfall:** automation tools often save screenshots to their own output folder, not the path you meant. Move every PNG into `ui-verify-evidence/` and check one `.png` plus one `.response.md` per prompt.

## Track B — runtime behaviour

**Run the Phase 2 plan.** Track B runs the `## Phase 10 test plan` table row by row; it does not invent its method at run time. Expected outputs and pass criteria are fixed and never edited to fit results. A differing result is a finding. A row added or dropped at run time is a deviation, listed with its reason. No plan → Gate 1 does not pass. Before the first row runs, record the plan file's last-write time and SHA-256 in `ui-verify-summary.md`, so a later edit shows.

Change one variable (the fix, the license, the setting), hold everything else, and show the observable outcome flip, before and after. "Verified the change does X" is not "verified X is the desired outcome"; the latter belongs to the owner (Phases 2 and 4).

**Make the runtime actually exercise the path:**

- **Use a real user session.** Some features ignore a headless browser or a single fresh request (bot filters, first-request shortcuts). Use a headed browser and several requests.
- **Valid configuration first.** A test bound to a missing or deleted entity serves nothing and looks exactly like "the fix broke it". Check the binding before blaming the code.
- **Know which signals are near-real-time and which come from a nightly batch.** Do not wait for tomorrow for a runtime change; do not expect a batch report today.
- **Isolate the variable in the OFF state.** For a feature gate, use a setting that keeps everything else on. An invalid key that turns everything off confounds the result.
- **Trust the persisted signal, not a proxy.** Query the table that records the outcome; filter by timestamp to split before and after.
- **Randomised behaviour (sampling, percentage rollouts of a feature flag):** for a row that expects the feature on, set the rollout to 100 % in the fixture, or run the row N times and report N and the rate. Never one run.
- **Fixture edited in the database → restart the app.** Repositories cache.
- **Admin or preview cookies leak into real-user rows.** Clear them, or use a fresh browser context, and record that in the signals.
- **Enter special modes the way the product does.** If an admin preview (for example an admin viewing an invoice as the customer sees it) requires an API call that sets a cookie, make that call and record its status; otherwise the row silently runs as a real user session.
- **Exercise the real path.** If the UI drops or normalises the input before the server sees it, run the direct-request variant row and say which row reached the server.

**Trigger state unreachable in a running environment:** inject it into the live component from the browser (for example a deep shadow-DOM query in a script), or build a faithful replica harness (the exact component plus its host styles, served over `http://`, not `file://`). Both are legitimate; **state which verification level was used.**

**Label injected checks.** An overlay drawn by the run's own script is not product UI. Caption it visibly ("INJECTED CHECK") and pair it with the console line that produced it. Prefer a real UI shot whenever one exists.

**Signals come from the test script.** The script writes every measurement to `ui-verify-evidence/signals.jsonl`, one JSON object per line: `ts`, `row`, `signal` (the plan's *Measured signal* name), `value`, `source` (the exact command, query or call). Secrets and identifiers are written as a presence flag plus a short hash, never raw. Each screenshot is logged as a `"signal":"screenshot"` line. Nobody types a number into signals, summary or review input by hand. Example: `setup/phase10-signals-writer.example.mjs`.

**Decoy.** The run captures one shot that proves no plan row (for example an unrelated dashboard), saved as `decoy-{what}.png`. It stays out of signals and summary; it tests the reviewer.

### Blind evidence review (mandatory for every Track B run)

After capture and before Gate 3, a fresh reviewer judges what the evidence proves.

1. **Brief.** Write `phase-10-review/brief.md`: the bug, the fix requirement, what each input file is. Plain facts, no verdicts, no hints about which image is which. Template: `setup/phase10-blind-reviewer-prompt.md`.
2. **Prep (scripted).** Run `setup/phase10-review-prep.sh`. It copies the brief, the fixed plan section, the signals (screenshot lines dropped) and every PNG, decoy included, under shuffled neutral names into `phase-10-review/input/`; writes `mapping.txt` outside `input/`; and refuses to finish if the decoy is missing or a real file name leaks into the input.
3. **Review.** Launch a fresh general-purpose subagent with no item context, read-only, with the prompt from the template. Its only input is `input/`. It never sees the summary, the auditor's verdicts or the mapping. Keep the template's plain wording: dramatic wording ("sealed folder", "read nothing else") was blocked by a permission classifier.
4. **Output.** Save the reply verbatim as `phase-10-review/review.md`: per image (what it shows, which row, where to look, proof level `SELF` / `WITH-DATA` / `NONE`), per plan row a verdict (`PROVEN` / `DATA-ONLY` / `NOT SHOWN` / `CONTRADICTED`, never "PASS"), one or two picks per product version with captions, findings, and an optional "which scenario is missing?".
5. **Reconcile.** Append `## Reconcile`: each image → real file name, whether the reviewer's mapping was right, each finding true or false, the decoy check. **The decoy must come back as "no row".** If not, the review failed: rerun once on a fresh prep. A second failure goes to Gate 3 as "review failed" and the human decides.
6. **Loop.** A finding about a shot → retake it, prep and review again, at most one round. Anything still not shown is stated as "data only". A finding about the plan is reported, never fixed by editing the plan's expected outputs or pass criteria.

The reviewer's verdicts stay as written; where they disagree with the auditor's row map in `ui-verify-summary.md`, Gate 3 shows both.

## Human-in-the-loop gates

- **Gate 1, before the run.** Track A: Claude starts the local test site in the background and opens the browser; the human signs in and sets up the first assistant variant. Track B: the plan exists with expected outputs, its timestamp and hash are recorded, the environment and the variable under test are ready (in multi-session mode, no stop).
- **Gate 2, variant switch (Track A):** Claude switches the assistant variant itself and re-applies the capture patch; no need to wait.
- **Gate 3, after capture: stop.** Track B: the blind review and reconcile are done first; show the per-row verdicts with real file names, the picks, open findings and "data only" items, the `review.md` path, and the drafted integration-test child task and verdict comment, not raw images. Track A: show the evidence path, the screenshots and the drafts. Wait for the human's go, then create the child task and comment. The comment says "evidence kept locally", never "attached ZIP".
- **Gate 4, before the verdict comment:** show the draft; post only on the human's approval.

## Tracker usage

- Create the integration-test child task under the parent (pre-authorized), after Gate 3.
- Add the short verdict comment on it, after Gate 4.

Comment template:

```
UI verification complete

- Runs: {N} across {assistant variants or environments}
- Prompts / rows: {M} ({breakdown})
- Behaviour confirmed: {one line}
- Scope boundary: held ({out-of-scope request} went to {sibling})
- Side findings: {if any, one or two bullets}

Verdict: {ready for review / pending fix}
Evidence: kept locally ({N} screenshots + logs); the cloud evidence ZIP follows at the cloud check.
```

## Output

- Track A: `prompt-{N}-{category}.png` and `prompt-{N}-{category}.response.md` per prompt, `ui-verify-summary.md`.
- Track B: `signals.jsonl`, screenshots, the decoy, `phase-10-review/` (brief, input, mapping, review with reconcile), `ui-verify-summary.md` mapping each plan row → file → verdict and listing deviations, `test-explanation-{id}.md` (for the reviewer) and `test-comment-{id}.md` (the short tracker comment).

## Checklist

### Every track
- [ ] Runs before Phase 11; code not pushed yet.
- [ ] Track chosen and recorded in §7.
- [ ] Freshness check done.
- [ ] Any local-only wiring (references, settings) reverted before commit.
- [ ] No automation → `ui-verify-manual.md` written.
- [ ] §7 updated; hand off to Phase 11.

### Track A
- [ ] Test site started, browser open; the human signed in.
- [ ] Capture patch applied (again after each switch or reload).
- [ ] Four prompts (plus injection probe if flagged) × every variant, each routing prompt in a fresh conversation; screenshot and `.response.md` written before the next prompt.
- [ ] PNGs moved into `ui-verify-evidence/`; counts checked.
- [ ] Drafts shown; child task and comment created on the human's go.

### Track B
- [ ] Plan present, expected outputs fixed, timestamp and SHA-256 recorded; rows run in order, controls included.
- [ ] One variable changed; before and after captured; verification level stated.
- [ ] Persisted signal used, not a proxy; runtime gotchas checked.
- [ ] Signals written by the script; secrets hashed; decoy captured.
- [ ] Injected overlays labelled.
- [ ] Blind review: prep script, fresh read-only reviewer, verbatim `review.md`, reconcile, decoy = "no row", at most one retake round.
- [ ] Gate 3 shows verdicts, picks and findings, not raw images.
- [ ] `test-explanation-{id}.md` and `test-comment-{id}.md` written; child task and comment created on the human's go.
