# Phase 9 — External review

The external reviewer is a second, independent reviewer of your choice (another model, another agent harness, or a review tool), run read-only with a clean context. Setup and reviewer contract: `setup/external-reviewer.md`.

## Step identifier

`phase-9-external-review`: clean-context review of the real diff, before commit. A discipline, not a skill. The final pre-commit gate.

## Sequence

- **Runs after:** Phase 8 (the diff arrives stripped of explanatory comments).
- **Hands to:** Phase 10 once a round returns Clean.

## What this step does

Write the review prompt per `code-review-prompt-rules.md` and save it as a file in the item folder. The external reviewer reviews it in a fresh session that sees only the prompt file and the code. The findings land on disk as the findings file. Claude reads that file and invokes `superpowers:receiving-code-review` to triage. Rounds r1, r2, ... continue until Clean.

The external reviewer is the final layer because its context is clean: it does not share the implementer's mental model, so it catches what Phase 8 misses.

## Run modes

| Mode | Who starts the external reviewer | When |
|---|---|---|
| `agent-run` (default) | Claude, from this session, through the reviewer tool's command-line or plugin entry point, in a **fresh** session started from the review target worktree, **read-only** | Default. Saves the human a copy-paste round trip per round. |
| `human` (fallback) | The human, in a fresh session of the reviewer tool in their editor or app | The probe fails, or the human asks for it. Log the reason in §7. |

### `agent-run`, per round

1. **Probe** once per session, and again after any update of the reviewer tool, from the review target worktree: a trivial request such as "Reply with the single word: ok. Do not use any tools."
   - `ok` → continue.
   - A version or model-support error → stop and tell the human what to update; a reviewer tool process left running from before an update keeps the old version until restarted.
   - Any other failure → stop, show the error, offer `human` mode.
2. **Prompt file** `phase-9-ext-prompt-r{N}.md`, with the `agent-run` header from the skeleton in `code-review-prompt-rules.md`. Point at spec and plan files by absolute path, after confirming in the probe that the external reviewer can read them from the worktree.
3. **Run** from the exact review target worktree; save stdout and stderr verbatim as `phase-9-ext-findings-r{N}.md`. Run it in the background and wait for the completion notice; a review can outlast a foreground timeout.
4. **Read** the findings file, check Gate 2, triage.

Never pass a write or auto-apply flag. Never put a model or reasoning-effort setting in the prompt or on the command line; the reviewer tool's own configuration owns them. Never use a "review the git diff" shortcut that sends only the diff without the spec, criteria and plan. Never resume an earlier session: every round is fresh.

### `human`, per round

Claude creates a minimal editor workspace containing **only** two roots: the item folder (artifact root) and the exact repository or worktree under review. Never a same-repo sibling on another branch. The human opens it, starts a **fresh** session of the reviewer tool (no implementation thread, no attached selection), and gives it the prompt. The external reviewer writes the findings file inside the artifact root. A file merely reachable by absolute path, or a copied routing file, does not prove the external reviewer can see it.

## Human-in-the-loop gates

In multi-session mode the lane stop table (`../../docs/pattern/tags-and-titles.md#lane-stop-table`) replaces the human stops in Gates 1, 1.5 and 4 (prompt pre-authorized, up to three rounds, a scoped re-round after a Phase 10 fix counts toward the three); see `../../docs/pattern/rules.md`. Gates 0, 2 and 3 always apply.

- **Gate 0, before drafting:** open `code-review-prompt-rules.md`, fill the prompt from its skeleton, tick its pre-send self-check. Never freehand the prompt from memory: a freehanded prompt once shipped without the spec path and without the "do not run the test suite" line, both already mandatory.
- **Gate 1, after drafting:** stop. Save the prompt file and give the human its path (the prompt goes in a file, never in chat). State branch, commit, mode and the exact review target. The human reads it and gives the go for the round; in `agent-run` one go covers probe and run. Claude never starts the external reviewer by any route other than the documented one, and never before this gate.
- **Gate 1.5, `human` mode only:** the human opens the workspace; Claude confirms its two resolved roots. If both roots are not visible, do not start the review and do not fall back to a broad workspace.
- **Gate 2, after the run (mechanism first):** the round's findings must exist **on disk** as `phase-9-ext-findings-r{N}.md` before triage. A chat paste or a §7 summary does not pass. **Origin proof:** the file opens with a header naming the prompt file answered, the branch and commit reviewed, and the round number. `agent-run`: the file is the verbatim captured output; Claude never edits it, and triage goes to §7 and a separate receiving-review file. `human`: wait for the human to confirm the run, then read the file; if findings arrive by paste, Claude's **first** action is writing them verbatim to the findings file. No next round and no commit without the file.
- **Gate 3, Clean is perishable:** any change to production code, tests or reviewed user-facing text after a Clean verdict invalidates it. A Phase 10 fix, a small polish, a wording tweak: each means the final diff was never reviewed. Run a round scoped to the delta before Phase 11. No exception for size.
- **Gate 4, after fixes:** stop. Confirm with the human before preparing round N+1.

## Notes

- **The prompt opens with the reviewer's review-skill trigger, if it has one, and requires the external reviewer to say whether it loaded** (prompt rule 40). A review that silently ran without its review discipline looks compliant and is worse than no review; it must fail closed.
- **Mandatory prompt content:** repository path, branch and base, commit (or "uncommitted working tree"), spec path, item and child-task ids, "do not run the test suite" plus the locally verified test counts, and the grading scale Block / Major / Minor / Nit / Clean with the mapping from the external reviewer's own scale.
- **Comments in the diff are claims to verify, not context** (rule 42). Ask for a verdict per checked claim. A commit message once asserted a code-generation behaviour, extrapolated from a different type and never verified; the review came back Clean and the claim was tested only after the push. It happened to be true; a false one would have passed the same way.
- **The diff arrives stripped by design.** Tell the external reviewer that constraints not visible in the code (design sign-off, out-of-scope surfaces, rejected alternatives) live in the prompt file, and to ask rather than assume. A question that re-derives a stripped comment is that comment's receipt, not a defect.
- **Conditional Block-focus checks:** "expose what exists" for a feature that should surface existing data; "breaking change" for a public surface in a released major.
- **Area-convention diffs:** inject the applicable check ids inline with one line each on what they ask, and require grading by id (rule 41). A reviewer given only a path applies general taste, not the house standard.
- **Read-gate:** read `recurring-lessons.md` (`false-positives`, `code-review-findings`) before triage, and inject known false positives into the prompt.
- **Reviewer-neutral wording:** the external reviewer's findings stay local. Commit messages, PR bodies and tracker comments say "reviewed", "verified".
- **Known limit of `agent-run`:** a read-only sandbox may be unable to spawn child processes, and a reviewer configured to "write the report file" cannot in read-only mode. Keep "do not run the test suite" and the local counts in the prompt, and ask for the report in the reply.

### Cross-repo items (library PR + consumer PR): library first, monotonic rounds

1. Review and fix the library PR to Clean first (r1..rN).
2. Only then review the consumer PR, continuing the same counter (consumer starts at r(N+1)). A round number then maps to exactly one repository; a later library change continues the counter.

Why: the consumer depends on the library's API and published package, so it cannot be final before the library is. Reviewing it against a finalised library avoids "library changed in review → consumer rework". Phase 5 still builds both, so an API-fit gap is not discovered late; only the review is serialised.

## Output

- `phase-9-ext-prompt-r{N}.md` and `phase-9-ext-findings-r{N}.md`. Cross-repo items add the repository: `phase-9-ext-library-findings-r2.md`, `phase-9-ext-consumer-findings-r4.md`. A second reviewer gets its own tag instead of `ext`.
- `implementation-notes.html` §7, per round, **one line per finding**: `[severity] <finding> -> <accept | reject | discuss> - <reason>`. Present the accept / reject / discuss call to the human before fixing. Reject-with-reason lines seed `false-positives` at Phase 12. Close with the round verdict. If an accepted finding changes the design, revise the body too.

## Checklist

- [ ] Read `code-review-prompt-rules.md`; fill the skeleton; tick the self-check.
- [ ] Mode chosen: `agent-run` unless the probe failed or the human asked for `human`.
- [ ] Prompt has the mandatory content, the claims-to-verify line, conditional checks, convention ids, and no model or effort setting.
- [ ] Prompt saved; path, branch, commit and target given to the human; go received (Gate 1).
- [ ] `agent-run`: probe, then a fresh read-only run from the target worktree, output saved verbatim, in the background.
- [ ] `human`: two-root workspace created and both roots confirmed; fresh session of the reviewer tool.
- [ ] Findings file on disk with a valid origin header (Gate 2).
- [ ] `superpowers:receiving-code-review` invoked; findings triaged one per line in §7; the human approves the calls.
- [ ] Fixes applied; tests re-run.
- [ ] Findings → next round (after Gate 4). Clean → Phase 10.
