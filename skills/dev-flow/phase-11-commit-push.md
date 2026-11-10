# Phase 11 — Commit + push

## Step identifier

`phase-11-commit-push`: verify, commit, push, open the PR, leave the tracker trail, request review.

## Sequence

- **Runs after:** Phase 10. Never open a PR for a change nobody has seen working. **If Phase 10 found and fixed a defect, or any code, test or reviewed text changed after the last Clean Phase 9 verdict, that Clean is void: run a Phase 9 round scoped to the delta first.**
- **Hands to:** Phase 12.

## Skill

**`superpowers:verification-before-completion`**, mandatory: run the commands, read the output, then claim. Evidence before assertions.

## Human-in-the-loop gates

In multi-session mode the lane stop table (`../../docs/pattern/tags-and-titles.md#lane-stop-table`) replaces these gates (typically: commit locally, one push stop where the human pushes, one stop at CI green); see also `../../docs/pattern/rules.md`.

- **Gate 1, commit message:** after verification, show the drafted commit message. Commit only on the human's approval.
- **Gate 2, push:** stop before pushing. Run the push pre-check below as part of this gate; its answer decides who pushes.
- **Gate 3, PR:** after the push and the human's go, open the PR as **Open, not Draft**, through your code-host integration, and report its number and URL. Exception: a consumer PR whose CI is expected red until a library dependency is published opens as Draft and stays Draft until green. Read CI before the tracker "PR created" comment. **CI green → tell the human and stop.** The human reviews the PR diff personally. Only on the human's go in chat does the agent (a) request the reviewer on the PR and (b) create the code-review child task (Gate 4). Never automatic on CI green.
- **Gate 4, code-review child task:** pre-authorized as a create, but assigning a reviewer is visible to others; it waits for the same go as the reviewer request.
- **No gate: parent → "in review".** The human writes the review-request comment on each PR; the agent never writes it. When the code host shows, on every PR of the item open at hand-off, the requested reviewer **and** the human's comment asking for review (posted after the reviewer request; the PR description does not count), move the parent from your "approved / committed" state to your "in review" state without asking, and report it in one line. A byte-identical port PR to another version branch with no reviewer of its own is fine: the main PR alone counts. Check right after the go's items are done, on every wake while waiting, and when the human or coordinator says the comment is posted. No polling loop, no timer, no question: without the comment the item simply waits. Parent in any other state: no flip, confirm-first.

## Who pushes

Decide at Gate 2. Two common setups:

- **The human pushes.** Give a copy-paste one-liner with the absolute worktree path, so it runs from any terminal:

  ```
  git -C <absolute-worktree-path> push origin <branch-name>
  ```

  The human checks the account they push as. Then you verify (step 4 below).
- **The agent pushes**, through whatever your setup allows. If that is a content-upload API on the code host (one that replaces whole files rather than sending a git diff), these rules apply:
  1. **Pre-check size** of every file in the push list. Large files are where uploads fail or get mangled; find out before, not mid-push.
  2. **Small enough → upload, split by file**, never within a file.
  3. **Too large → hand the human the one-liner above.** Do not hand-copy tens of KB through a tool call to avoid asking.
  4. **Never chunk a single file, and never use the remote branch as an assembly buffer.** With `git push` a partial transfer fails and nothing lands. With a content API, "I'll do it in parts" commits a series of incomplete states to a shared branch. One run once left 30 junk commits, some holding placeholder content, after chunking a generated file.
  5. **Verify every push, per file.** Record local blob SHAs before (`git rev-parse HEAD:<path>`), `git fetch`, compare. Then `git diff --name-only <base> <branch>` must list exactly the intended files: a whole-file upload can silently revert someone else's landed work. Two distinct failure modes have been seen: a call that silently omitted one file, and an upload that inserted a blank line in transport.
  6. **A deviation from the push mechanism is the human's call.** If the rule's reason looks inapplicable, say so and let the human choose.

## Tracker usage

- "PR created" comment on the dev child task (or the item), with the **full PR URL**, after CI is green (pre-authorized). Exception: a consumer PR with expected-red CI gets the comment immediately; its review request waits until it is green.
- Link the PR to the item where the tracker supports it; where it cannot link your code host's PRs, the comment with the URL is the link.
- Create the code-review child task assigned to the reviewer, on the human's go. Set parent and area explicitly, then **verify by query** that it landed under the parent and on the team board.
- Read CI status after the push.

## Notes

- **No `Co-Authored-By` lines** for the AI in commit messages, unless your team wants them. No reviewer tool names. No person names in code comments.
- The PR targets `<default-branch>`.
- PR title: match the repository's history (for example `feat(scope): summary (#1240)`).
- PR body: the item id, dependency notes (for example "depends on library PR <URL> and the next pre-release package"), expected CI state.
- Wrap a PR body in a code block only when the human will paste it somewhere.

### Cross-repo items have two PRs: run the trail per PR

- **Library PR:** self-contained, CI goes green on its own; its full trail (comment, reviewer, code-review child task) is due as soon as it is ready and green. It unblocks the consumer, so its review is the priority.
- **Consumer PR:** CI red until the library package is published; "PR created" comment immediately, review request after it turns green.
- **One code-review child task per item** is fine: create it for the library PR, list both PRs with their states, and add a comment when the consumer becomes ready.
- **That description is a pointer, not a copy of the PR:** link, state, one-line gate. Design rationale lives in the PR; a copy drifts the moment the PR moves.
- Deferring every review request until "after the dependency" silently skips the library PR's review: it sits ready with no signal for the reviewer.
- **The consumer unblocks only when a package is actually published.** A library merge may not publish a consumable pre-release by itself. Find out who cuts it, ask once with the merged PRs listed (one fresh pre-release covers every PR merged before the build), then pin the **exact** published version string (check the feed index; shorthand like "preview 2" is incomplete) and let CI go green.

## Output

- Commit on the branch; branch pushed.
- PR open (or Draft for an expected-red consumer).
- "PR created" comment with the URL; code-review child task assigned.
- §7: "Committed {SHA}, pushed. PR {URL} open against `<default-branch>`. Code-review task #{id} created."

## Checklist

- [ ] `superpowers:verification-before-completion` invoked; full suite green; build clean with no new warnings.
- [ ] Staged files are only the intended changes (no local-only references, settings or generated churn).
- [ ] Commit message drafted (no AI co-author line, no reviewer tool name); approved (Gate 1); committed.
- [ ] Push pre-check; who pushes decided (Gate 2); pushed; verified per file and by file list.
- [ ] PR opened as Open (expected-red consumer: Draft) after the human's go; number and URL reported.
- [ ] CI read; green → "PR created" comment, tell the human, stop.
- [ ] On the human's go: reviewer requested and code-review child task created; parent link verified by query.
- [ ] Reviewer requested and the human's review-request comment visible on every PR → parent to "in review", reported in one line.
- [ ] §7 updated; hand off to Phase 12.
