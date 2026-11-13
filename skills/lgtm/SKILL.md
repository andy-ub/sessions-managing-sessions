---
name: lgtm
description: A lane session records its current state in the day file and reports it to its parent session, so the parent knows where the lane stands and the lane can resume later. Invoke as /lgtm; safe to run several times a day. Records state only and approves nothing. Not for the orchestrator (it closes the day) and not for handing work to another session (use /handoff).
argument-hint: "(optional) note to emphasize in the block"
disable-model-invocation: true
---

# /lgtm

Example output: [examples/lgtm.md](../../examples/lgtm.md).

**/lgtm approves nothing.** The human typing it means "record where this session stands", not "go". It is never consent for a pending confirm-first action (tracker state or field edit, push, PR, merge, delete, outward comment, resource release). Those stay pending: list them under **Next** as `awaiting the human's go: …` and wait for the human's own words for each. In files and messages write "session state recorded (/lgtm)", never "approved". See [rule 1](../../docs/pattern/rules.md).

Scope among the wrap-ups:
- `/lgtm` = this **lane session**, now. The same session resumes later.
- `/handoff` = a document for **another** session to continue the work ([handoff](../handoff/SKILL.md)).
- End-of-day close = the **day**, run by the orchestrator only. It reads the `/lgtm` blocks.

Rules R1–R5 (clock, append-only, Session line, block format, retraction) live in [day-file-rules.md](day-file-rules.md). Read it first; this file only says when each applies.

## Steps

### 1. Clock and working day (R1)
Read the date with a command. Pick the working day and the folder `<scratch>/daily/{YYYY-MM}/{DD}/`.

### 2. Resources this session still holds
Read the shared status file `<shared>/orchestrator-sync.md` (newest line last; format in [status files](../../docs/pattern/status-files.md)). List each `CLAIM` this session made with no matching `RELEASE` (a port, a database clone, the shared browser). **Report them; do not release them.** A release is a separate action the human asks for. Never kill a process you cannot trace to this session.

### 3. Earlier blocks of this session
Read today's `day.md` if it exists. Find this session's earlier blocks by the session id in their `Session:` line (R3).
- **Nothing new since the last one** (same Status, no new outcome, no resolved row) → write nothing. Go to step 5 and report `no change since {HH:mm}`.
- Otherwise continue. Note which earlier rows (this session's or another's) this block settles.

### 4. Append the block (R2, R3, R4)
- Append one `## Session close — {HH:mm} ({DD-MM}) — {label}` block: the Session, Lane (`open` | `closed`) and Resources lines, then Status with the five exact labels (R4). Add detail sections only if they add something; keep them short.
- **In progress** = this session's own work. Requests for the parent go under Next as `for {parent title}: …`.
- Build the block from this session's own facts: commits, PRs, tracker changes, verifications, decisions, open questions. Re-check anything load-bearing at write time (tracker state, PR state, CI) or label it unverified.
- Pending confirm-first items go under **Next** as `awaiting the human's go: …`.
- Unreleased resources from step 2 go on the **Resources** line (`none` if there are none).
- Mark rows this block settles `(resolved, see close {HH:mm})` in place (R2).
- After any correction while writing, run R5.
- Include the optional argument as a note in the block when given.

### 5. Report to the parent
Skip this step if this session is itself the orchestrator.

Send one message whose first line starts with **`STATUS (/lgtm, not a go):`**, then the file path, the block heading, its Lane and Resources lines and its Status lines (or `no change since {HH:mm}`). Address it in this order:
1. The parent's role title (from the handoff that started this lane, or the newest `who` line for the lane in the status file).
2. If that fails, the parent's session id from the same source.
3. If both fail, write the message to `<scratch>/daily/{YYYY-MM}/{DD}/inbox/{HHmm}-{lane}.md` and tell the human "parent unreachable, message in inbox".

Do not wait for a reply.

### 6. Tell the human
At most three lines: what was recorded (or "no change"), where, and whether the parent got it. Mention anything still held from step 2 and anything awaiting the human's go.

## Never
- Write to the tracker, push, open or merge PRs, delete branches or worktrees, post comments, or release resources. /lgtm records; acting is separate.
- Overwrite or reorganize `day.md` (R2).
- Report another session's work from hearsay. Its own block covers it.
