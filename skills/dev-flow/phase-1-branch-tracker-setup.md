# Phase 1 — Branch + tracker setup

## Step identifier

`phase-1-branch-tracker-setup`: create the branch (or worktree) and the tracker trail for the item.

## Sequence

- **Runs after:** Phase 0 checkpoint confirmed.
- **Hands to:** Phase 2.

## What this step does

Creates the item's git and tracker infrastructure: the feature branch in each repository involved, and, if your team uses them, the dev child task under the parent item, whose id names the branch (see "ID convention" in `SKILL.md`). A standalone bug or task has no dev child task: the branch uses the item's own id.

## Skill

`superpowers:using-git-worktrees` when the repository's main working tree is busy with another item, or whenever the human wants isolation.

## Tracker usage

- Feature story with dev child tasks: create the dev child task under the parent (pre-authorized, create-shaped). Set title, assignee, iteration and area fields explicitly, then **verify the parent link and area by query**, not by the create response.
- Standalone item: no create. Record its own id in the intake note.
- Do **not** create the code-review or integration-test child tasks yet (Phases 10 and 11).

## Notes

- Branch base is `<default-branch>` unless the human says otherwise. Release branches are for releases.
- **Worktrees do not inherit untracked, local-only files.** Copy what the runtime needs (for example a local settings file), local-only, never staged.

### Cross-repo dependency (library + consumer)

When the item needs a change in a library repository that a consumer repository uses through a package:

- **Sequence:** library PR merged → package published (often a manual pre-release step someone must run) → consumer bumps the version.
- **While the package is not published:** swap the consumer's package reference for a project reference to the library, **local-only and uncommitted**. Revert to the package reference plus version bump before the Phase 11 commit, or the commit carries a local path.
- **Check the library tree is on this item's branch before referencing it.** Feature branches are often divergent siblings; referencing a tree on the wrong branch compiles against the wrong surface, and a passing build is then a false green. Grep for the new symbol in the referenced tree.
- **If the library tree is busy with another item, add a worktree; never switch its branch.** Switching collides with the other item's uncommitted work. Remove the worktree at Phase 12.
- **The consumer's reference line is shared between concurrent items: re-point it, never commit it.**
- Record the dependency in the kickoff (Dependencies) and in `implementation-notes.html`.
- The consumer PR's CI will be red until the package lands. That is expected; log it in §7 and in the PR body.

## Output

- Branch per repository, named per your convention.
- Dev child task id (if any), recorded in the notes once Phase 3 creates them.

## Checklist

- [ ] Confirm parent item id and iteration.
- [ ] Create the dev child task (if your team uses them) and verify parent link and area by query.
- [ ] Create the branch off `<default-branch>`; a cross-repo dependency is wired by a local reference, not by basing the consumer branch on a library branch.
- [ ] Cross-repo: local-only reference swap; worktree if the library tree is busy.
- [ ] New worktree: copy the local-only runtime files, never staged.
- [ ] Build locally, and confirm the referenced tree exposes the new symbol you need, before Phase 2.
