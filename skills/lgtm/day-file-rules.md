# Day file rules (R1–R5)

Not a skill. Every skill that writes blocks into the day file (`/lgtm` for a lane, the end-of-day close for the orchestrator) follows these rules. Each rule lives here once; change it here.

Readers of the day file: the next morning's planning session (it ingests every block, later blocks and "resolved" markers winning) and anyone preparing a standup.

## R1. Read the clock, then pick the working day

**Read the real current date from the system before anything else**, in a pinned 24-hour format:
- PowerShell: `Get-Date -Format "dd-MM-yyyy HH:mm"`
- Bash: `date "+%d-%m-%Y %H:%M"`

A bare `Get-Date` prints in the machine's locale and can come out 12-hour (`5:46:12 PM`). Times in blocks are local time, 24-hour; dates are DD-MM-YYYY. Do **not** take "now" from the conversation. A session resumed from an earlier day, or one carrying a long context, will believe it is still that day. Observed: a session asked on a Monday to close the previous Friday believed it *was* Friday, and wrote "today" and "this morning" throughout.

Then decide which working day the block covers. It is **not always today**: a session that starts in the evening and runs past midnight belongs to the day it started. Take the date of the morning plan being reconciled against, or of the first commit in the span. For **folder choice**, if that disagrees with the clock, the clock loses.

**State both dates:** "Covers working day {DD-MM}, written {DD-MM}". The file's day header carries it (R2). Repeat it in a block only when that block's dates differ from the header, for example a close written after midnight.

**If they differ by more than a few hours, this is a backfill, and it needs three extra things:**
1. **Every state claim gets an explicit "as of {the day covered}".** The reader is in the later present: `still 0 reviews` reads as *now* unless dated.
2. **Anything load-bearing is re-verified at write time, or labelled unverified.** Days have passed.
3. **Say the gap at the top of the block**, including any weekend.

Why it matters: the filename is a working day, not a timestamp. A close filed under the wrong day leaves one day with no close and points the next morning's plan at the wrong baseline. A note inside the file does not fix a misfiled name, because the planner picks the file by folder date.

## R2. Append, never overwrite

Path: `<scratch>/daily/{YYYY-MM}/{DD}/day.md`, the working day from R1.

- **Absent** → create it with the day header `# Day {DD-MM-YYYY}` plus the line "Covers working day {DD-MM}, written {DD-MM}" (R1), then the block.
- **Present** → append a new block at the end. Do **not** rewrite, merge or reorganize earlier blocks: they are another session's record, written with context this session does not have. Append (`>>` or an edit at the end), never a whole-file write.
- **The one permitted edit to an earlier block:** when this block settles a row an earlier block left open (a question answered, a blocker cleared, a figure corrected), mark that row resolved **in place** with a pointer, `(resolved, see close {HH:mm})`, so the next morning does not re-plan it. This applies to another session's block too.
- **Read the earlier blocks before writing**, so you neither repeat what another block recorded nor miss a row this block resolves.

## R3. The Session line

Every block starts with a `Session:` line:

`- **Session:** "<title>" · session <id> · cwd <path> · model <model>`

Take the values from the app or the environment (for example the `CLAUDE_CODE_SESSION_ID` environment variable). If a value is unavailable, write `unknown`. Never fill it from memory. The Session line is how `/lgtm` finds this session's earlier blocks, and how the next day traces and reaches the session.

## R4. Block format (a contract)

```
## Session close — {HH:mm} ({DD-MM}) — {one-line label}
- **Session:** …
- **Lane:** open | closed
- **Resources:** none | {claim held: port / database clone / shared browser, since HH:mm}
### Status
- **Done:** #ID → outcome (PR link, state change) · …
- **In progress:** #ID → resume point · …
- **Blocked / waiting:** #ID → on whom / what · …
- **Hours today (actual):** #ID 1.5 h, #ID 0.5 h (total 2 h)
- **Next:** #ID … · …
```

- The label names the context: the item worked on, or "flow maintenance". `({DD-MM})` is the **working day** (R1), the same as the folder; `{HH:mm}` stays the clock time. A close written at 01:10 for the 16-10 working day reads `01:10 (16-10)`.
- **Lane:** `open` = this session expects to resume; `closed` = nothing left for it. The orchestrator reads this instead of guessing from Next.
- **Resources:** every claim this session holds with no `RELEASE` line in the status file, or `none`.
- **In progress holds the session's own work only.** Requests for the parent go under Next as `for {parent title}: …`.
- **The five Status labels are exact.** Cross-lane summaries grep them; renaming one drops the lane out. One `#ID` per entry; `none` when a label is empty; `not tracked` when hours are unknown. Work with no tracker item uses a bracketed slug, for example `[flow:day-rhythm]`.
- **Confirm-first items** waiting on the human go under **Next** as `awaiting the human's go: …`. A block records state; it never approves anything.
- Detail sections may follow Status. Keep them to what this session owned; link, don't paste.

## R5. A correction is not applied until the old claim is gone

Whenever a figure or claim is corrected, search the file for the old number and the old phrasing and remove or mark every survivor. A correction added while the original survives elsewhere is worse than none: the reader meets both, and the stale one usually comes first.

Check, in the order a reader meets them:
- **Headings and block labels.** A heading is read before the prose that corrects it.
- **Next / "needs confirming" rows and blocker lines.** The next morning plans from these.
- **Done rows**, where a number quoted at the standup lives.
- **Arithmetic that used the old figure.** A row saying "X went from A to B" makes every other mention of A stale, so search for A too.
- **Numeric coincidences.** When two different quantities have the same value, say so.

The pattern behind this rule: every stale claim that survived sat where it is read or copied before the analysis (an action line, a headline, a heading).
