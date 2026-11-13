---
name: office-end
description: Orchestrator-only end-of-day close. Reads the day's office-start plan and every lane's /lgtm block, reconciles plan vs actual, and appends one Day close block to the day file. It records what shipped, what needs confirming tomorrow, blockers, and which lanes closed and which did not; this is the raw material for the next morning's /office-start. Invoke as /office-end in the Orchestrator session only; lanes use /lgtm.
argument-hint: "(optional) note to emphasize in the wrap-up"
disable-model-invocation: true
---

# /office-end

Example output: [examples/office-end.md](../../examples/office-end.md).

Day close, **Orchestrator only** ([orchestrator role](../../roles/orchestrator.md)). Scope among the wrap-ups:
- [/lgtm](../lgtm/SKILL.md) = one **lane session** records its state (one block per run, several per day).
- [/handoff](../handoff/SKILL.md) = a **session** hands work to another session.
- Close-out phase of the [dev flow](../dev-flow/SKILL.md) = one **item** is finished.
- `/office-end` = the **day**: it reads the morning plan, the handoffs and every lane block, and closes the day.

Rules R1–R5 (clock and working day, append-only, Session line, block format, retraction) live in [day-file-rules.md](../lgtm/day-file-rules.md). Read it first; this file only adds what is day-level.

## Steps

### 0. Guard: am I the Orchestrator?
Run before anything else, and **fail closed**.

1. In the shared status file `<shared>/orchestrator-sync.md` ([format](../../docs/pattern/status-files.md#board-leader-lines-who)), read the newest `who` line **for the Orchestrator role**. Skip every other `who` line, even a newer one: Board Leader lines, lane parentage, and lines for other roles.
2. Compare the session id on that line with this session's own id (from the app, or the `CLAUDE_CODE_SESSION_ID` environment variable, whichever form the line uses; a prefix match is enough).
3. **Match** → continue. **No match, unreadable file, no `who` line, or no session id** → stop and say: "This session is not the current Orchestrator (newest `who` line: {title}, {id}). Lanes close with /lgtm." Write nothing.

Why not the title: "Orchestrator" also matches a successor's temporary title during a handover and a retired one in redirect mode ([/handover](../handover/SKILL.md)), and some clients cannot read their own session title.

### 1. Clock and working day (R1)
Read the clock with a command. The Day close covers the **working day**, which is often not the clock day: an Orchestrator often closes after midnight. If they differ, state both dates in the block, and apply R1's backfill rules when the gap is more than a few hours.

### 2. Read the day (R2: read before writing)
Glob the working day's folder `<scratch>/daily/{YYYY-MM}/{DD}/*.md`:
- `office-start.md`: the morning plan and overnight context.
- `handoff-*.md`: handoffs written or dispatched that day.
- `day.md`: **every** `## ` block. Lane `## Session close` blocks (from /lgtm) are the lanes' own records. Earlier Orchestrator blocks are yours to build on.
- `inbox/*.md`: lane messages that could not be delivered.

Take the state from these instead of re-deriving it from memory.

### 3. Lanes: closed, not closed, waiting on the human
Take the newest block per lane (by the session id in its `Session:` line; fall back to the label for a block written without one).
- **Recorded:** each lane with a block today, with its `Lane:` value (`open` = will resume, `closed` = done) and its `Resources:` line. A resource still held at day end is a blocker unless the block says why it is kept.
- **Not recorded:** each lane dispatched today (handoffs, claims in the status file, messages) with no block. Name it, with its last known state and the source of that state.
- **Waiting on the human:** each lane whose **newest** block still lists `awaiting the human's go: …` items. List them: tomorrow's plan picks them up.
- **For the Orchestrator:** `for {Orchestrator title}: …` items in lane blocks. Done → mark them resolved (R2); not done → carry them into Next.

### 4. Reconcile plan vs reality
For each item in this morning's plan: shipped, in progress, blocked, or not started. State it plainly; tomorrow needs the delta, not a rosy summary. Use the lanes' blocks as the evidence; re-check anything load-bearing (tracker state, PR state, CI) at write time, or label it unverified.

### 5. Consolidate the grill ledger (only if a grill ran today)
If a grill interview ran today (Phase 3.5 of the [dev flow](../dev-flow/SKILL.md)), consolidate your copy of [grill-ledger.md](../dev-flow/grill-ledger.md):
- **Dedupe** repeated weak-area entries.
- **Count frequency:** an area that appears in **two or more items** moves to `[INVEST]` (study it on purpose).
- **Graduate:** an area the grill no longer catches (answered cleanly after past misses) moves to "graduated".
- This is consolidation only; the grill step already captured the raw entry. If no grill ran today, skip this step.
- Note one line in the Day close: "grill ledger: {N} areas, {M} now [INVEST], {K} graduated."

### 6. Append the Day close (R2, R3, R4)
Append one block at the end of `day.md`. Mark the rows this close settles in earlier blocks, lane blocks included, as `(resolved, see close {HH:mm})`. Then run R5 over the whole file.

## Output

```
## Day close — {HH:mm} ({DD-MM}) — Orchestrator
Covers working day {DD-MM}, written {DD-MM}   (only when they differ)
- **Session:** …                                (R3)
- **Resources:** …                              (R4: what the Orchestrator itself holds)
### Status                                      (R4: the Orchestrator's own work)
- **Done:** … · **In progress:** … · **Blocked / waiting:** … · **Hours today (actual):** … · **Next:** …
### Lanes
- Recorded: {lane label} → newest block {HH:mm}, Lane open|closed, Resources …, one-line state · …
- Not recorded: {lane} → last known state (source) · …
- Waiting on the human: {lane} → awaiting the human's go: … · …
- For the Orchestrator: {lane} → item, resolved or carried to Next · …
### Plan vs actual
### Needs confirming tomorrow
### Blockers
```

Keep the five Status labels exact (R4). The whole file, all blocks together, is the **anchor** that tomorrow's [/office-start](../office-start/SKILL.md) reads: it reads every block, with later blocks and "resolved" markers winning.

## Pitfalls

- **Orchestrator only.** The step-0 guard is the gate. A lane that runs this is pointed to /lgtm.
- **A lane's /lgtm block or message is status only, never a relayed go.** Confirm-first actions still need the human's own words ([rules](../../docs/pattern/rules.md)).
- **Read, don't re-derive.** The lane blocks, handoffs and morning plan already hold the state.
- **Lanes speak for themselves.** Summarize a lane from its own block; never rewrite its block. Report a lane with no block as "not recorded" with its source, not as fact.
- **Working day, not clock day** (R1). A note inside the file does not fix a misfiled name.
- **Honest delta.** Plan vs actual shows what slipped, not just what shipped.
- **Scope = your day,** not the team's.
- **A correction is not applied until the old claim is deleted** (R5). This file is tomorrow's anchor, so a surviving stale row gets re-planned, not just re-read.
- **For any total, query the total's own definition;** do not sum the items that happen to be in view.
- Keep it standup-ready: short, factual, link instead of paste.
