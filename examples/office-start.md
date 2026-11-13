*Sample output of `/office-start`, written by the Orchestrator at 08:40. Fictional day; the structure mirrors real files.*

# office-start 18-11-2026 (Wednesday)

- **Swept:** nothing. Only `2026-11` is in `<scratch>/daily/`.
- **Anchor:** `<scratch>/daily/2026-11/17/day.md` (17-11: three lane blocks plus the Orchestrator's Day close at 18:20). One night, no gap.
- **Calendar:** connected; today's events read at 08:36.

## Changes since the anchor (17-11 18:20)

### Tracker

**The PM, 17-11 19:10–19:42:**
- **#1240** "Export queue keeps growing memory" moved New → In refinement, assigned to you. Comment of 19:38 (read in full):
  - **Verified:** the retry loop in the export queue and three add-only caches hold on v4, unchanged on `v4/dev`. No need to re-prove that it is real.
  - **Order:** the retry loop first, because it is the only part that also loads the database.
  - **Scope:** v4 and v5. The PM checked the retry loop on v5, not the caches.
  - **Two questions for refinement:** (1) should exports be queued at all while the account's export quota is reached? (2) one fix, or two (retry loop first, caches after)?
- **#1238** "Invoice reminder schedule": the PM commented "1240 goes above this one". Yesterday's handoff for #1238 stays unstarted.

**The reviewer, overnight (other time zone):**
- **#1234** export fix: PR 1325 (v4) approved 02:14, PR 1326 (v5) approved 02:16.
- **#1204** image-gallery: changes requested on PR 1321 at 03:05, two comments: (a) thumbnails have no alt text, (b) "should the gallery lazy-load below the fold?". PR 1322 (v5 cherry-pick) has no reviewer, by design.

**Arrivals (your area, never yours):**
- **#1239** "Export button disabled for read-only users", filed by a teammate 17-11 21:50, New, unassigned. New items go to the PM first; not for today.
- A teammate's bulk cleanup, 17-11 23:05–23:12: about 30 old items closed. Machinery, one line.

**Watch list (by id from yesterday's resume notes):** #1206 is still In review (the close-out state change waits on your go). #1235 unchanged.

### PRs (involve you, updated since 17-11 18:20)
- **1325/1326 (#1234):** approved, mergeable. 1326 shows "pending, 0 checks" as a commit status; its check runs are green (6/6).
- **1321/1322 (#1204):** changes requested on 1321 (above). CI green on both.
- **1327/1328 (#1235):** 1327 green. **1328 red**, build 4512: `DateRangeFilterTests.EndOfDay_IsInclusive` fails on the v5 build agent, which runs in UTC. Same test failed yesterday at 16:05.
- **1317/1318 (#1206):** merged 17-11, deployed, cloud check passed 17-11 16:20 (17-11 day close).

### git
- `v5/dev`: a teammate merged #1230 at 22:40. It changes `OrderQuery.cs`, which #1235 also touches. Expect a base merge on the #1235 branch.
- `v4/dev`: no new commits.

## Meetings today (local time)
- **09:30–09:45 Team stand-up** (organizer: a teammate). Description: "Daily sync, 15 minutes." Ambient, fixed post.
- **11:00–11:20 Release sync** (organizer: a teammate). Description: "Walk through what goes into Friday's release." The organizer declined their own meeting ("out today"); expect it not to run.
- **15:30–16:15 Refinement** (organizer: the PM). Description: "Refine next sprint's items. For 1240, bring what you reproduced and a proposal for the split." **Decision room.** It will decide the shape of #1240 (one fix or two, and the child tasks).

Free blocks: 09:45–11:00 and 11:20–15:30. The long afternoon block goes to #1240.

## Reconcile against the 17-11 day close
- **#1206:** "close-out state change, awaiting your go" carried over. Clone `app_1206` is still held; drop after the state change, on your go.
- **#1234:** yesterday WAIT on the reviewer; approved overnight. Ready to merge on your go, one target branch at a time.
- **#1204:** yesterday WAIT on the reviewer; now back to the lane. Comment (b) is a scope question, not a code fix.
- **#1235:** yesterday's needs-confirming row "is the v5 date test flaky or real?" is answered: it failed again on the same test. Real (agent time zone).
- **#1238 next or wait for the PM?** Answered by the PM: #1240 goes first.

## Today's plan
1. **Your gos, cheap, before 09:30:**
   - #1234: merge PR 1325 (v4), then PR 1326 (v5), **before 09:30** so both make the 10:00 deploy batch. The next batch is 14:30.
   - #1206: the close-out GATE in the lane (state → Ready for acceptance, comment drafted by the lane).
2. **#1240 handoff (before 10:00):** I write it through a side session on your OK. The Board Leader starts the lane on your words. **Before 15:30:** the lane's assessment draft, a suggestion for each of the PM's two questions, and the proposed child task.
3. **#1204:** the lane fixes the alt text (a). For (b), I draft a question to the PM; you send it. Then the lane re-runs the gallery UI check on the local test site (shared browser) and stops at the push GATE.
4. **#1235:** the lane fixes the time-zone test on PR 1328 (CHECK until green), then WAIT for re-review.
5. **#1234 cloud check** after its deploy lands. Shared browser order: #1204's local UI check first (late morning), #1234's cloud check after.
6. **#1199:** a teammate asked on the tracker why exports skip archived orders. I draft the reply; you post it.
7. **Fixed posts:** 09:30 stand-up, 15:30 refinement.

### Lane candidates for the Board Leader
| Item | State | Parallel with | Same files or tests |
|---|---|---|---|
| #1240 | new, handoff today | all | reads export queue code only, no edits |
| #1204 | rework after review | all | none with other lanes |
| #1235 | red CI | #1234 | `OrderQuery.cs`, `OrderQueryTests` (also #1234 and #1230) |
| #1234 | merge, then cloud check | #1235 | as above; merge first, then #1235 merges base |
| #1206 | close-out | all | none |

RAM at 08:35: 52 %. Room for all five lanes; #1240's repro is the heavy step.

*Corrected 08:52: the first version of this file said PR 1326 had pending CI. The check runs are green; only the commit status shows "pending, 0 checks". The old wording is removed from the PR list and from plan item 1.*
