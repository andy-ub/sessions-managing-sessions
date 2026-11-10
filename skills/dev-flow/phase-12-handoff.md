# Phase 12 — Hand-off + close

## Step identifier

`phase-12-handoff`: codify what the item taught, verify on the cloud test environment after merge and deploy, then make the closing state changes, each confirmed on its own.

## Sequence

- **Runs after:** Phase 11 (PR open, trail in place). Parts of it wait for review, merge and deploy.
- **Hands to:** end of the flow; the item is ready for the PM's acceptance and the reviewer's PR review.

## Compound step: codify learnings (run before the state changes)

This is the write side of the lessons loop (Phases 2 and 9 are the read side). For each candidate lesson (TDD surprises, review accept/reject reasons, debugging root causes, domain facts found):

1. **Route it** per `memory-routing.md`:
   - recurring repo or review pattern, repeated false positive, test gap → `recurring-lessons.md`, right section;
   - convention of a code area → that area's `CLAUDE.md`;
   - a preference of the human or a project decision → project memory;
   - detail true only for this item → stays in `implementation-notes.html`.
2. **Human-approved promotion.** Show the proposed lessons and target stores first. Write to `recurring-lessons.md` or an area `CLAUDE.md` only after approval; never auto-append. An area `CLAUDE.md` is a committed team document: neutral wording, its own commit.
3. **Graduate and remove.** A ledger entry that has earned permanent enforcement moves into a hook, a test, an area `CLAUDE.md` or this skill, and its line is deleted. The ledger is a small staging queue.
4. **Log** what was codified and where, in §7.

Skip only for genuinely trivial items, and say so in §7.

## Cloud-verify gate (every story and bug), before "ready for acceptance"

Order: **merged → deployed to the cloud test environment → verified there → only then Gate 2.** Merge alone never triggers the flip and never proposes it. **Merged is not deployed**, and a local Phase 10 pass is a false green for cloud behaviour: local runs from source, the cloud runs what the deploy shipped.

1. **Merge** following your team's rules. If a scheduled batch job runs on the cloud environment and a deploy mid-run breaks it, keep merges out of that window. One merge per target branch at a time when merges trigger deploys.
2. **Wait for the deploy.** Know which pipeline deploys `<default-branch>` to `<cloud-env-url>` and roughly how long it takes. Read the result of the build for that branch; before any retry, check for an in-flight build on the same branch (a conflict error on the deploy step usually means a parallel merge raced). Read pipeline definitions from the target branch, never from an old feature branch with an old stage layout.
3. **Know the dangerous look-alike.** If a release pipeline that publishes the product (to a public package feed or store) sits next to the deploy pipelines, never run it by mistake when re-running a deploy. Running or changing any pipeline is confirm-first anyway.
4. **If the change ships through a package** (a consumer of a library or plugin), the chain is longer: package build → manual pre-release step if your process has one → bump the pinned version in the deployed app (the bump PR's CI restore is a cheap check that the package really is on the feed) → deploy. A sparse feed is not evidence that builds do not run; check the build history.
5. **Verify on the cloud environment.** Re-run the **primary rows** of the Phase 10 plan (Track B), or the tool prompts (Track A: tool called, real data returned, not a placeholder). The human signs in; Claude never signs in to a shared environment itself (lockout risk). Read-only. For a request-level bug, the request is the primary signal, not "the UI looks unchanged". Apply the freshness check here too: a green pipeline does not prove the new code registered. Verify on the environment the PM accepts on, not on a look-alike internal demo environment.
6. **Package the cloud evidence** (screenshots, request and log captures, a short summary) as `ui-verify-evidence_{id}-{slug}.zip` and give the human the path to attach. This is the only evidence ZIP in the flow.
7. **Then** Gate 2. A change touching two repositories runs both chains; Gate 2 waits for the last.

### Who runs the cloud check: the owning lane

The session that owns the item runs its own cloud check, in its own Phase 12: one lane, one item, one folder. When one lane batched cloud checks for several items, its gate stopped showing which comment and which images belonged to which item.

- **A batch is an exception with a stated reason**, written in the batch lane's handoff and repeated at its gate: several items wait for the same deploy, or the cloud session expired and the human wants to sign in once. Convenience is not a reason.
- **A batch lane hands results back.** For each item it writes the cloud evidence, the ZIP and that item's `tracker-pack.md` into the item's own folder, then hands them to the owning lane. It does not make the item's tracker changes itself unless the coordinator reassigns the item.
- **Sleep while waiting (multi-session mode).** A lane waiting on review, merge or deploy may be archived; the coordinator wakes it with one message ("merged / deployed, run the cloud check"). See `../../docs/pattern/status-files.md` and `../../docs/pattern/tags-and-titles.md` (`WAIT`, `CLOUD`).

## Tracker pack at the "ready for acceptance" gate

Before Gate 2, write `tracker-pack.md` in the item folder: one row per work item the gate touches (the parent and every child task). The gate message gives its path and repeats the table. Nothing in it is posted before the human's go; each state change is still approved on its own. The human attaches the files.

```markdown
# Tracker pack: #<id> <short name>

Gate: ready for acceptance. Cloud check: <environment>, <DD-MM-YYYY>, <verdict>.
Batch: none | <batch lane title>, reason: <reason>

Nothing here is posted before the human's go. Each state change is confirmed on its own. The human attaches the files.

| Work item | Type | Action | Comment draft | Attach (exact paths) | Confirms |
|---|---|---|---|---|---|
| #1234 | Story | → ready for acceptance; assign the PM | <path, or —> | — | human |
| #1241 | Task (integration test) | comment: cloud verdict | <path> | <path>/ui-verify-evidence_1234-export-report.zip | human |
| #1240 | Task (dev) | → Done | — | — | human |
| #1242 | Task (code review) | none (reviewer's) | — | — | — |
```

One row per work item, "none" included. Paths are full paths to files that exist; never "the screenshots".

## Human-in-the-loop gates (confirm-first)

Every state change in this phase is confirm-first. The only pre-authorized state change (parent → "in review") belongs to Phase 11.

- **Gate 1, dev child task → Done:** describe it ("#1240: Active → Done. Visible to the team. Triggers nothing.") and wait for an explicit "ok".
- **Gate 2, parent → "ready for acceptance":** only after the cloud-verify gate, with `tracker-pack.md` written and its table in the message. Describe it ("#1234: In Progress → Ready for Acceptance, assigned to the PM.") and wait for an explicit "ok".
- **Gate 3, branch deletion (if the human wants it):** describe local and remote impact; wait for "ok" before any destructive git operation.

Never batch two state changes into one go. The human may approve one and defer the other.

## Skill

`superpowers:finishing-a-development-branch`, for the cleanup options. Merge, PR and branch deletion stay the human's decisions.

## Notes

- Do not flip the parent while a dependency is open (unpublished package, unmerged library PR). The item stays in its state until the dependency clears, CI is green and the cloud check passed.
- Local-only reference swaps from Phase 1 are reverted, and the package version is bumped, before anything ships.
- Worktrees created for the item are removed after the merge (`git worktree remove`), on the human's go.

## Output

- Dev child task Done; parent "ready for acceptance" (when the gate passed); code-review and integration-test tasks left with their owners.
- `tracker-pack.md`, the cloud ZIP.
- §7 final entry: hand-off time and state summary. Optional `phase-12-handoff-{date}.md`.

## Checklist

- [ ] Compound step: lessons routed, shown to the human, written on approval, graduated entries removed, logged in §7.
- [ ] Phase 10 evidence complete locally (files, no ZIP).
- [ ] Cloud-verify gate: merged → deployed → primary rows (or tool prompts) re-run on the cloud environment, the human signed in → evidence ZIP built and handed over.
- [ ] Cloud check run by the owning lane; a batch only with a stated reason, results handed back.
- [ ] `tracker-pack.md` written; gate message gives the path and repeats the table.
- [ ] PR reviewed; CI green; dependencies cleared; local-only swaps reverted.
- [ ] `superpowers:finishing-a-development-branch` invoked for cleanup options.
- [ ] Gate 1 confirmed → dev child task Done.
- [ ] Gate 2 confirmed → parent "ready for acceptance".
- [ ] §7 final entry.
