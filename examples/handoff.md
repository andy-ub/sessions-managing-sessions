*Sample output of `/handoff`, written by a side session of the Orchestrator at 09:20 and saved as `<scratch>/daily/2026-11/18/handoff-1240-memory-leak.md`. Fictional day; the structure mirrors real files.*

# Handoff: #1240 export queue keeps growing memory, refinement assessment

Written 18-11-2026 09:20 by the Orchestrator for the Board Leader. This is a handoff, not a go: you start the lane in the Board Leader session.

## Suggested skills
- `dev-flow`, Phases 0–2 only (spec read, tracker setup, audit). No TDD, no PR.
- `systematic-debugging` for the repro.
- A worktree skill: work in a fresh worktree of `v4/dev`, read-only.

## Parent
**Board Leader** (role title). Fallback session id: `local_d15b…`.

## First actions
1. Read the clock with a command (`date "+%d-%m-%Y %H:%M"`).
2. Announce yourself to the Board Leader: session title, session id, working directory, and that you take over this handoff. Do not wait for a reply.
3. Set your title to `1240 memory leak`.

## Why now
- Yesterday you asked the PM whether to pick up #1238 next. The PM answered on 17-11 that #1240 goes above it.
- #1240 is **In refinement** and assigned to you: you reproduce it and prepare it for the refinement meeting. It is not in a sprint yet.
- **Deadline:** refinement today 15:30. The PM asked for "what you reproduced and a proposal for the split".
- Customer pressure is real. The latest comment on the public issue (17-11 22:10) says a customer's export server restarts every few days. You and the PM should see it; the lane does not answer it.

## Sources (read all of them first)
- The public issue: the body (memory snapshot, the retry loop, the three caches, repro steps) and all four comments.
- Tracker #1240: the description and **the PM's comment of 17-11 19:38**. It carries:
  - **Verified:** the retry loop and the three add-only caches hold on v4. Do not spend time on "is this real".
  - **Order:** the retry loop in `ExportQueue.RetryFailedAsync` first; it also loads the database.
  - **Scope:** v4 and v5. The PM checked only the retry loop on v5.
  - **Done looks like:** memory stays flat under the customer's repro; the queue empties after the export quota is reached; dropped exports are logged.
  - **Two questions:** (1) queue exports at all while the quota is reached? (2) one fix or two?
- Yesterday's day close: `<scratch>/daily/2026-11/17/day.md`, Day close block.

## Scope of this lane: assess and prepare, no fix
1. **Reproduce locally on v4, timeboxed to 14:30.** Use a database clone of the local test site, one account with a small export quota, and many PDF exports from a load script. Measure with `dotnet-counters` and a heap dump: the three caches grow and never shrink.
2. **Then the quota path:** force "quota reached" and show the retry queue never drains.
3. If the full repro costs too much, reproduce the retry loop (the database part) at minimum, and say what was not reproduced.
4. **Check v5** for the three caches by reading the code. No repro unless the code differs.
5. **A fix sketch with its risk, for each part:** (a) the retry loop: cap, expiry, or no queueing while the quota is reached; (b) the customer lookup cache; (c) the invoice-by-order map; (d) the render cache. For each, say whether it changes public API.
6. **Answer the PM's two questions with a suggestion each** ("my suggestion: X, because …").
7. **Propose acceptance criteria as constraints, not mechanisms**, and child tasks per version (v4 fix, v5 port, verify, review). If the answer to question 2 is "two fixes", split the tasks per fix.
8. **Output:** `<scratch>/items/1240-memory-leak/refinement-assessment.md`, and a draft refinement comment for #1240. You review the draft and post it.

## Not in scope
- No code fix, no PR.
- No reply on the public issue: public replies are the PM's.
- No tracker state change.

## Tracker
- Propose one child task under #1240, "Investigation: reproduce and refine". It is a create-shape write, but **show it to you first**: the item is not in a sprint yet, and the PM places it.
- Fix tasks stay a proposal in the assessment until refinement.

## Resources and rules
- Claim the local test site port, the database clone and any exclusive database step in `<shared>/orchestrator-sync.md`. Release the port when the repro is done. Keep the clone until the v5 check is done; drop it only on your go.
- English on disk. No names or tracker numbers in code.
- A go is typed by you, in the Board Leader session or in the lane. An OK from the Orchestrator is an opinion.
