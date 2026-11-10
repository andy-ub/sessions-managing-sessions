# Code-review prompt rules (Phase 9 reference)

Rules for writing the external review prompt. Rule numbers are stable ids, not a count; gaps are rules that were merged or dropped.

## Pre-send self-check (every round; do not freehand)

The rules only work if applied. A prompt once drafted from memory shipped without the spec path and without the "do not run the test suite" line, both already mandatory. Start from the skeleton at the bottom and tick all of:

- [ ] Repository path, branch, base, commit or "uncommitted working tree" (rules 8-10)
- [ ] **Full spec path** (rule 11)
- [ ] Item and child-task ids (rule 12); dependency note or an explicit "none" (rule 13)
- [ ] **"Do not run the test suite"** (rule 14) and the local test counts (rule 15)
- [ ] Opening line triggers the reviewer's review skill, if it has one, **and** asks it to state whether it loaded, else stop (rule 40)
- [ ] Grading scale with the mapping from the reviewer's own scale (rule 16)
- [ ] No model or reasoning-effort setting anywhere (rule 17)
- [ ] Conditional Block-focus check: expose-what-exists or breaking-change (rules 18-19)
- [ ] Area-convention check ids injected inline, where applicable (rule 41)
- [ ] YAGNI / over-engineering line, graded Major, always (rule 36)
- [ ] Known false positives from `recurring-lessons.md` injected inline
- [ ] "Comments and commit messages are claims to verify" line (rule 42)
- [ ] Header matches the mode (`agent-run` or `human`)
- [ ] Files in scope, reference files (do not review), source-of-truth references (rules 26-28)
- [ ] Any rough cue from the human expanded into a resolved focus area (see "Cue expansion")
- [ ] Reason-before-verdict line (rule 37)

## Workflow

| # | Rule |
|---|---|
| 1 | Trigger: after implementation, local tests green and Phase 8, before commit and push. |
| 2 | Two run modes (`phase-9-external-review.md`): `agent-run` (default; Claude starts a fresh, read-only reviewer session from the target worktree after the human's go) and `human` (the human starts a fresh reviewer session in a two-root workspace). Never any other route. |
| 3 | The prompt goes in a file; chat gets the path only. |
| 4 | Framing notes not addressed to the reviewer stay out of the prompt file. |
| 5 | No triage before the findings file exists. |
| 6 | Rounds continue until Clean. |
| 7 | Two layers: Phase 8 in-session review, then Phase 9, mandatory even if Phase 8 was clean (separate blind spots). |

## Cross-repo items (library PR + consumer PR)

| # | Rule |
|---|---|
| CR-1 | Review, fix and finish the library PR to Clean first. Do not start the consumer review before. |
| CR-2 | Continue the same round counter for the consumer (r(N+1)...). A round number maps to exactly one repository. |
| CR-3 | Why: the consumer depends on the library's API and package; reviewing it against a final library avoids rework. |
| CR-4 | Phase 5 still builds both; only the review is serialised. |
| CR-5 | File names carry reviewer, repository, type and round: `phase-9-ext-library-prompt-r2.md`, `phase-9-ext-consumer-findings-r4.md`. Single-repo items drop the repository part. |
| CR-6 | Tracker posture follows the order: the library PR's review request is due when it is ready and green; the consumer stays Draft until the library is accepted and its package published. |

## `human` mode workspace

- Claude creates `phase-9-review-r{N}.code-workspace` (or your editor's equivalent) in the item folder with **only** two roots: the item folder and the exact repository or worktree under review. A same-repo sibling on another branch is forbidden.
- The human opens it and starts a **fresh** reviewer session: not an implementation thread, no attached selection.
- The prompt names both roots and the exact prompt and findings file names. The reviewer writes the findings file inside the item folder.
- A path reachable by absolute path, a folder glob or a copied routing file does not prove access. If both roots are not visible, do not start.

## Mandatory context

| # | Element | Example |
|---|---|---|
| 8 | Repository path | `<workspace>/my-service` |
| 9 | Branch and base | `Branch: feature/1240-export-report vs main` |
| 10 | Commit or uncommitted state | `Commits: a1b2c3d + d4e5f6a` or `Reviewing uncommitted working tree changes` |
| 11 | **Full spec path** | `Spec: <workspace>/my-service/docs/specs/export-report.md` |
| 12 | Item and child-task ids | `Item: #1234 (dev task #1240)` |
| 13 | Cross-repo dependency, if any | `Depends on: ReportService.GetExport from the library PR <URL>` |

## Mandatory instructions

| # | Instruction |
|---|---|
| 14 | "Do not run the test suite." Claude already ran it; some suites hang in a reviewer sandbox. Keep the line even if yours does not: the reviewer's job is reading, and rule 15 supplies the counts. |
| 15 | State the locally verified counts and freshness: "Tests verified locally: 18/18 in ExportReportTests, full suite 214/214." |
| 16 | "Grade findings as Block / Major / Minor / Nit / Clean", with the mapping from the reviewer's own scale, for example critical = Block, high = Major, medium = Minor, low = Nit, an explicit no-findings statement = Clean. |
| 17 | No model or reasoning level in the prompt or on the command line. The reviewer's configuration (or the human's choice in the `human` mode client) owns them. |
| 36 | "Also grade over-engineering / YAGNI: is any abstraction (generic, reflection, factory, interface hierarchy, extensibility hook) more than this feature needs? Flag as **Major**." Always. Correctness-only grading misses over-engineering. |
| 40 | **Open with the reviewer's review-skill trigger, if it has one, and require it to say whether the skill loaded.** A skill that is not invoked implicitly needs its literal trigger; a skill can also be missing after a reviewer update. Always include: "State explicitly whether the review skill loaded. If it did not, stop and report that instead of reviewing without it." Fail closed: a review that silently ran without its discipline looks compliant and is worse than none. |

## Conditional rules

| # | Rule | When |
|---|---|---|
| 18 | "Expose what exists" check, graded as Block focus | A feature meant to surface data the system already produces, not to orchestrate new data |
| 19 | "Breaking change" check, graded as Block focus | A public surface in a released major version (default to non-breaking patterns) |
| 20 | Flag known-stale spec lines explicitly | The spec contains outdated statements |
| 21 | Mark preparation commits as out of scope | Cherry-picks or helpers from other branches in the range |
| 22 | Separate in-scope and out-of-scope explicitly | Multi-commit branches with mixed concerns |
| 41 | Inject the applicable area-convention check ids inline, one line each on what it asks, and require grading by id | The diff touches an area whose conventions live in an external source. A reviewer given only a path applies general taste: three rounds on one item never mentioned the house checks and found nothing in that category. |

## Prompt structure

| # | Section | Content |
|---|---|---|
| 23 | Context paragraph | Repository, branch, commit, spec, dependency |
| 24 | Round info (r2+) | "Round N: verify the round N-1 finding {id} is fixed: {summary}" |
| 25 | Focus areas, numbered | Each with expected grade and specific questions |
| 26 | Files in scope | Paths to review |
| 27 | Reference files (do not review) | Siblings and runtime files for comparison only |
| 28 | Source-of-truth references | e.g. `src/Invoicing/InvoiceTotals.cs:134`, the runtime calculation |

## Round 2+

| # | Rule |
|---|---|
| 29 | Reference the earlier finding: "Round N-1 finding X; fix applied: ..." |
| 30 | Ask to verify the fix without regression. |
| 31 | Update the test count if it changed. |
| 32 | Update the commit SHA if there is a new commit. |

## Downstream

| # | Rule |
|---|---|
| 33 | Shared artifacts (PR body, tracker comment, commit message) do not name the reviewer tool or model. |
| 34 | Use neutral wording: "verified", "reviewed", "tested". |
| 35 | Findings arrive → `superpowers:receiving-code-review` (verify each claim, push back if questionable, triage). |

## Quality rules

| # | Rule |
|---|---|
| 37 | **Reason before verdict.** "For each finding, state the reasoning, then the grade." Verdict-first hides faulty logic. |
| 38 | **One dimension per pass for high-stakes reviews.** For a large or risky change, prefer separate passes (correctness, breaking change, simplicity) over one mega-prompt. A single prompt is fine for small changes. |
| 39 | **Deterministic framing.** Review is analytic: precise instructions, grounded findings with `file:line` only. |
| 42 | **Comments in the diff are claims to test, not context to trust.** Every code comment, doc comment and commit-message assertion in the range is something to check against the code and reality; a confidently worded one earns more suspicion. Ask for a verdict per checked claim, not only per defect. Lesson: a commit message asserted an unverified code-generation behaviour, the review came back Clean, and the claim was only tested after the push. |

## Cue expansion: rough cue → focus area

The human often knows where the risk is and says it in one loose line: "check the hydration path", "thread-safety in this service", "is the migration reversible?". Turn it into a focus area. This shapes the input; it does not fabricate findings.

Slots:

- **Grade:** Block / Major / Minor / Nit (a correctness or contract cue → Block).
- **Objective:** one concrete sentence of what must be verified.
- **Inspect:** the exact `file:line`, method or contract, resolved against the real code before writing.
- **Contract / known fact:** the invariant that could break, including any entry from `recurring-lessons.md`.
- **Ask:** the pointed question the reviewer answers.

Example, cue "check the hydration path":

```
Focus [Block], hydration parity:
  Objective: verify the feature reads from the same source the runtime populates.
  Inspect: ExportService.BuildInvoiceRows (read path); IOrderRepository.List vs Get(id)
  Contract: List() does not load order lines; only Get(id) does (recurring-lessons.md, test-gaps).
  Ask: does the implementation or its mock read a source production never populates? (false-green risk)
```

- **Resolve before writing**: a focus area that repeats the vague cue adds nothing.
- **Cross-check `recurring-lessons.md`**: inject relevant patterns as the Contract line and relevant false positives so the cue does not re-raise a settled non-issue.
- **Cues add to the standard focus areas**, and usually go first.

## Prompt skeleton

```
{agent-run header; the file is sent as is, so its first line is the rule 40 line:}
{review-skill trigger, if any}: state explicitly whether the review skill loaded. If it did not, stop and report that instead of reviewing without it.
Review target (your working directory): {exact repository or worktree}
Prompt file: {phase-9-ext-prompt-rN.md}
Findings file: {phase-9-ext-findings-rN.md} (the caller saves your reply there)
Review only. Do not create, edit or delete any file. Return the complete report in your reply.
Open the reply with: the prompt file you answer, the branch and commit reviewed, and the round number.

{human header:}
Review workspace: {phase-9-review-rN.code-workspace}
Artifact root (opened): {item folder}
Review target root (opened): {exact repository or worktree}
Prompt file: {phase-9-ext-prompt-rN.md}
Findings file: {phase-9-ext-findings-rN.md}
Use a fresh session. Read this file first; write the complete findings to the findings file in the artifact root before replying. Open it with the prompt file you answer, the branch and commit reviewed, and the round number.

Round {N}: confirm the round {N-1} {severity} finding on {feature} is fixed without regression.

Repository: {path}
Branch: {branch} vs {base}
Commits reviewed: {SHAs}
Spec: {full spec path}
Item: #{id} (dev task #{id})
{dependency note, or "Dependencies: none"}

Do not run the test suite. Tests verified locally: {counts}.

Round {N-1} finding being remediated:
[{severity}] {description}
Fix applied:
- {what changed}

Grade findings as Block / Major / Minor / Nit / Clean ({mapping from the reviewer's scale}).
For each finding, give the reasoning first, then the grade.
Treat every code comment, doc comment and commit-message statement in the range as a claim to verify against the code; give a verdict per claim you checked.
Constraints not visible in the code are stated in this file. Where the code alone does not explain a choice, ask rather than assume.

Known non-issues (do not re-flag):
- {from recurring-lessons.md false-positives}

Focus areas:
{cue-derived focus areas first, if any}
1. Block: {question}
2. Block: {question}
3. Major: over-engineering / YAGNI: is any abstraction more than this feature needs?
4. Minor: {question}
{conditional: expose-what-exists / breaking-change}
{conditional: area-convention check ids, one line each}

Files in scope:
- {path}

Reference files (do not review, comparison only):
- {path}

Source-of-truth references:
- {path:line}
```
