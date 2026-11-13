*Sample output of `/lgtm`: the day file `<scratch>/daily/2026-11/18/day.md` with three of the day's lane blocks (the 17:40 block of 1234 export fix and the Board Leader's handover block are left out), as it reads at 18:10 after the Orchestrator's day close marked one row resolved. Fictional day; the structure mirrors real files.*

# Day 18-11-2026
Covers working day 18-11, written 18-11

## Session close — 11:45 (18-11) — #1206 price-rounding, closed out
- **Session:** "DONE · 1206 price-rounding · P12 · PR 1317/1318" · session local_5e07… · cwd <workspace> · model <model>
- **Lane:** closed
- **Resources:** none. Clone `app_1206` dropped 11:30 on the human's go (keep-list check first: nothing on it); RELEASE line written in the shared status file.
### Status
- **Done:**
  - #1206 → state In review → Ready for acceptance, with the drafted close-out comment, on the human's go at 10:55. Re-checked in the tracker at 11:42: Ready for acceptance, assigned to the PM.
  - #1206 → feature branches `v4/bugfix/1206-price-rounding` and `v5/bugfix/1206-price-rounding` deleted on the remote, on the human's go at 11:35. Worktrees removed.
  - #1206 → one lesson moved into the shared notes on the human's go at 11:38: "invoice totals round half to even; line items round half away from zero. Test both on the same order."
  - Evidence from the 17-11 cloud check (v4 and v5, invoice PDF totals) is attached to the tracker comment.
- **In progress:** none
- **Blocked / waiting:** none
- **Hours today (actual):** not tracked
- **Next:** for Board Leader: archive this lane · the PM accepts #1206 (not this lane's step)
- Note: session state recorded (/lgtm).

## Session close — 13:45 (18-11) — #1204 image-gallery, review round 1 fixed, push stop
- **Session:** "GATE · 1204 image-gallery · P10 · PR 1321/1322" · session local_b41d… · cwd <workspace> · model <model>
- **Lane:** open
- **Resources:** clone `app_1204` (since 17-11 14:00), kept until the reviewer's re-review in case the UI check needs a retake. Shared browser claimed 11:55, released 13:30. Local test site port released 13:30.
### Status
- **Done:**
  - #1204 → review comment (a): alt text on every gallery thumbnail, taken from the image's caption, empty `alt=""` for decorative frames. Two unit tests added, suite green locally.
  - #1204 → Phase 10 retake on the local test site, rows 1–4: thumbnails, full-size view, keyboard navigation, screen-reader names. All four pass; evidence in `<scratch>/items/1204-image-gallery/phase-10/`.
  - #1204 → committed locally on both branches (v4, then the same change cherry-picked to v5). Not pushed.
- **In progress:** none
- **Blocked / waiting:** #1204 → push GATE since 13:42 (below)
- **Hours today (actual):** not tracked
- **Next:**
  - awaiting the human's go: push both branches to PRs 1321/1322 (commit message and push command in the GATE message to Board Leader).
  - after the push: the reviewer's re-review on 1321. The lane does not write the review-request comment.
  - for Orchestrator: the PM's answer on review comment (b), lazy-loading (question sent by the human at 10:40). (resolved, see close 18:05)
  - awaiting the human's go: drop clone `app_1204` after the re-review.
- Note: session state recorded (/lgtm).

## Session close — 16:50 (18-11) — #1240 memory leak, refinement assessment
- **Session:** "1240 memory leak · P2" · session local_2c9e… · cwd <workspace> · model <model>
- **Lane:** open
- **Resources:** clone `app_1240` (since 10:30), kept for tomorrow's v5 check. Local test site port claimed 10:20, released 14:25.
### Status
- **Done:**
  - #1240 → reproduced on v4: with the export quota reached, the retry queue grew to 20,000 entries in 25 minutes and never drained; process memory went from 310 MB to 1.9 GB. Each retry also re-reads the account's quota row.
  - #1240 → the three caches grow and never shrink under the same load (heap dump, 14:10). The render cache is the largest.
  - #1240 → `refinement-assessment.md` written 15:05: fix sketch and risk per part, suggestions for both questions, acceptance criteria as constraints.
  - #1240 → refinement 15:30 (as relayed by the human): the PM chose **two fixes** (retry loop first, caches after) and **no queueing while the quota is reached**. Item placed in next sprint by the PM.
  - #1240 → child task "Investigation: reproduce and refine" created at 16:24, after the human's OK at 16:22.
- **In progress:** #1240 → v5 code read of the three caches; the customer lookup cache is the same as v4, the other two not read yet.
- **Blocked / waiting:** none
- **Hours today (actual):** not tracked
- **Next:**
  - #1240: finish the v5 code read, then split the proposed child tasks per fix in the assessment.
  - awaiting the human's go: the refinement comment for #1240 (draft at the end of the assessment, not humanized). The human posts it.
  - awaiting the human's go: drop clone `app_1240` after the v5 check (keep-list check first).
- Note: session state recorded (/lgtm).
