# Phase 8 — Internal review (before external review)

## Step identifier

`phase-8-internal-review`: same-session review of the diff before it goes to the external reviewer.

## Sequence

- **Runs after:** Phase 7 for items with user-facing text; directly after Phase 5 otherwise (including logic bugs).
- **Hands to:** Phase 9.

## What this step does

Catches what the implementer can catch: pattern mismatches, missed verification, over-engineering, comment junk, convention breaks. Phase 9 stays the final gate because its context is clean; Phase 8 is "have I done due diligence first?". Different blind spots, combined coverage.

## Skill

`superpowers:requesting-code-review`. Alternatives or additions from the `pr-review-toolkit` plugin: `code-reviewer`, `silent-failure-hunter`, `pr-test-analyzer`, `type-design-analyzer`, `comment-analyzer`, `code-simplifier`. Let the skill fetch the diff; do not paste it into the conversation.

## The passes

1. **Correctness and verification:** the skill runs tests and build, and reviews the diff.
2. **Simplicity lens (mandatory, separate from correctness).** Run `code-simplifier` on the diff and ask: any unused abstraction? Could this be half the size? Is any generic, reflection, factory or hook more than the feature needs? Correctness gates do not flag over-engineering; this one does. A miss here is expensive rework; feed it back so Phase 2 catches the next one.
3. **Area-convention checks (where the area has an external convention source).** Run that source's graded checks **against the diff**, one verdict per applicable check id, not a re-read of the docs. A "compare against the framework's own equivalent code" check most often changes a verdict, and most often reverses a suspected finding, so cite the file you compared against either way. Record the source version. Evidence for placing it here: an item ran three external review rounds without these checks; a sweep afterwards found four findings, all of the kind this pass catches and a start-of-session read does not.
4. **Comment hygiene. Open `comment-hygiene.md` and apply it; do not run it from memory.** First the complement-versus-restate test on every added or kept comment (keep a non-obvious why; cut a restatement of names, types or guards; strip names and ticket numbers). Then the reversal test: if the decision a comment defends were reversed, would anything break? If not, it is self-justification and belongs in the commit message. Seven comments once passed the first test and still failed the second.
5. **Comment-to-code ratio, as a receipt.** Record added comment lines over added code lines, **production and tests separately**. No threshold; its only job is to make a skipped pass visible. A diff once reached an open PR at 24 % comments with nothing recording that the pass never ran. A combined figure can hide the case that matters: one branch measured 34 % combined and 67 % in production code alone. Make the command cover the item's languages, or it returns 0 by construction:

   ```
   git diff {base} -- "src/**/*.cs" "tests/**/*.cs" "**/*.ts" | grep -cE '^\+\s*(//|/\*|\*)'
   ```

   `{base}...HEAD` compares commits only, so uncommitted trims do not show; `git diff {base}` includes the working tree. Adjust globs and comment markers to your languages.
6. **Strip before external review (the last Phase 8 step).** Strip comments that explain logic from the diff, so the external reviewer reads bare code. A comment that explains logic is an unverified claim, and a reviewer who reads it tends to accept it instead of checking. Full rule in `comment-hygiene.md` "The strip-before-review gate". In short: the reviewer's re-derived question is the receipt to re-add one line; reviewer silence is not proof (apply the reversal test); rationale that is not a code fact goes into the Phase 9 prompt file and the notes, never the source; comments return smaller, with receipts, at Phase 10/11 before commit. Record what was stripped and the ratio before and after. This is a step inside Phase 8; do not renumber the flow.

### These passes are perishable

Any commit after the convention pass or the comment pass is ungraded until it is graded, **including the commit that fixes a finding the pass raised**. Required: a delta pass over `{last-graded-commit}..HEAD`, one verdict per applicable check id plus the per-commit comment/code split (production and tests), in `phase-8b-delta-{commit}.md` with the commit range, source version and date in the header. No exception for size: an ungraded one-file, +12/−4 delta was once the remediation of the sweep's own finding, and nobody had checked it. A delta that grades only frontend conventions leaves a backend-only commit's comments ungraded while looking complete.

## Output

`phase-8-internal-review-r{N}.md`: findings, verification commands and results, the comment ratio, what the hygiene pass cut or kept, what the strip removed (ratio before and after).

`implementation-notes.html` §7: findings count and actions. If an accepted finding changes the design, revise the body section in place too.

## Checklist

- [ ] `superpowers:requesting-code-review` invoked; tests and build ran.
- [ ] `code-simplifier` run as its own simplicity pass.
- [ ] Comment-to-code ratio recorded, production and tests separately.
- [ ] Comment hygiene: `comment-hygiene.md` opened; complement-versus-restate, then the reversal test.
- [ ] Area-convention checks graded per id against the diff, with the source version (where applicable).
- [ ] Any later commit → delta pass file, conventions and comment split both.
- [ ] Findings triaged; fixes applied; tests re-run.
- [ ] Output saved; §7 updated.
- [ ] **Last step:** explanatory comments stripped; what and ratio recorded.
- [ ] Hand off to Phase 9.
