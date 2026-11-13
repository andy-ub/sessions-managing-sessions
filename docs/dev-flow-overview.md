# What one lane runs

Every lane follows the same 13-phase flow: the [dev-flow skill](../skills/dev-flow/SKILL.md). This page is the overview, and it says what each phase is built on. Four sources:

- **own**: written for this flow.
- **superpowers**: skills from [obra/superpowers](https://github.com/obra/superpowers).
- **Matt Pocock**: skills from [mattpocock/skills](https://github.com/mattpocock/skills).
- **ECC**: skills from [everything-claude-code](https://github.com/affaan-m/everything-claude-code).

The superpowers, Matt Pocock and ECC skills are not included in this repo. Install them from their own repositories, or swap in your own.

| # | Phase | What happens | Built on |
|---|---|---|---|
| 0 | [Spec read and kickoff](../skills/dev-flow/phase-0-spec-kickoff.md) | Read the full tracker item, every comment included | superpowers `brainstorming` (optional) |
| 1 | [Branch and tracker setup](../skills/dev-flow/phase-1-branch-tracker-setup.md) | A branch per supported version, a dev child task | own |
| 2 | [Plan](../skills/dev-flow/phase-2-audit.md) | Audit the change and write the plan, with the expected verification results. **Stop:** no code until you agree | superpowers `writing-plans` |
| 3 | [Development log](../skills/dev-flow/phase-3-notes-setup.md) | A running log for the item: every decision with its trade-offs, every concern, every open point. Updated with each commit, so nothing is decided silently | own |
| 4 | [Open questions](../skills/dev-flow/phase-4-resolve-oq.md) | The questions come out of a grilling session on the plan (Phase 3.5). Questions for the PM or lead are shown to you first | Matt Pocock `grill-me` |
| 5 | [Strict TDD](../skills/dev-flow/phase-5-tdd.md) | Red, green, refactor | superpowers `test-driven-development` |
| 6 | [User-facing text](../skills/dev-flow/phase-6-user-facing-text.md) | Optional. Write the text users or an AI assistant read (UI copy, error messages, tool descriptions) | own |
| 7 | [Domain review panel](../skills/dev-flow/phase-7-domain-panel.md) | Optional. A team of subagents, each playing a different kind of reader, reviews that text | own |
| 8 | [Internal review](../skills/dev-flow/phase-8-internal-review.md) | A review pass before the external one | superpowers `requesting-code-review` |
| 9 | [External review](../skills/dev-flow/phase-9-external-review.md) | Read-only code review by a second reviewer, before any commit. **Stop** | ECC code-review skill |
| 10 | [Verification](../skills/dev-flow/phase-10-ui-verification.md) | Prove the change works, in the way that fits the change (below). **Stop** | own |
| 11 | [Commit and push](../skills/dev-flow/phase-11-commit-push.md) | A PR per version, linked to the item; a code-review task. **Stop** before push | superpowers `verification-before-completion` |
| 12 | [Hand-off](../skills/dev-flow/phase-12-handoff.md) | After merge, the cloud check, then the close-out state change. **Stop** | superpowers `finishing-a-development-branch` |

Also used whenever they apply: superpowers `receiving-code-review` for any review feedback ([adhoc](../skills/dev-flow/adhoc-receiving-code-review.md)), and `systematic-debugging` when a bug turns up ([adhoc](../skills/dev-flow/adhoc-systematic-debugging.md)).

In a lane, the **Stop** points are replaced by the [lane stop table](pattern/tags-and-titles.md#lane-stop-table).

## Phase 10: how a change is verified

Superpowers has no verification step that runs the product, so this phase is own work. Which check runs depends on what changed. The expected results are written down in the Phase 2 plan, before any code exists. A result that differs is a finding; the expected value is never edited to fit.

| What changed | How it is checked |
|---|---|
| Something you can see: a page, a redirect, what a user is served | Screenshots **before and after** the change, with only the one thing under test changed. Every shot shows its URL. A second agent then reviews the shots blind: neutral file names, plus one decoy shot that proves nothing. A gate check can refuse the Phase 10 gate until that review is on disk. |
| What an AI assistant answers (a tool it can call) | A fixed set of test prompts, run against two different LLM providers. The answers are saved word for word, with a screenshot of each. |
| Performance (a slow query, an index) | Measured before and after on a cloned database with the same data. Baseline and candidate runs alternate, because the machine itself drifts. Every other query that reads the same table is checked too, so a fix in one place does not slow down another. |
| Back end or API only, nothing to see on screen | The requests and responses are the evidence, written to a signals file by the test script, never typed in by hand. *Planned:* the same blind review for this kind of evidence. |
| Every item, after merge | The same check again on the cloud test environment (Phase 12), creating test data there when a check needs it. Only this run's evidence is attached to the tracker item. No cloud test environment: skip this row. |

Details: [phase-10-ui-verification.md](../skills/dev-flow/phase-10-ui-verification.md).
