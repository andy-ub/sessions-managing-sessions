# Setup — external reviewer for Phase 9

The external reviewer is a second, independent reviewer of your choice: another model, another agent harness, or a review tool. This file says what it must do for Phase 9 to count, how to set it up, and how to verify the setup. It names no product; pick one that can meet the contract.

Phase 9 has a dependency this skill folder cannot carry: the reviewer is configured outside Claude Code. A fresh machine has it missing by default.

## Requirements

| Requirement | Why |
|---|---|
| **Read-only, enforced by sandbox** (not only by instruction) | The reviewer must not change the code it reviews. |
| **Fresh session per round**, started from the review target worktree | Clean context is the point of Phase 9. No resumed threads. |
| **Reads files by path** from the worktree, including the spec and plan you point to | The prompt references the spec instead of inlining it. Confirm with the probe. |
| **A review discipline it loads explicitly** (a review skill, system prompt or agent profile), with a way to tell whether it loaded | A review that silently ran without its discipline looks compliant. |
| **Fails closed** when that discipline cannot load: it reports and stops | A clean verdict from an unconfigured reviewer is worse than no verdict. |
| **Model and reasoning effort set in the reviewer's own configuration**, never in the prompt or command | One place to change them; prompts stay portable. |
| **Can be started non-interactively** (CLI or plugin entry point) for `agent-run` mode | Otherwise only `human` mode is available. |

## The review discipline

Whatever form it takes, it should:

- stay read-only: no edits, commits, pushes, comments, or delegation onward;
- be defect-first, and keep going through the whole diff after the first issue;
- confirm each finding against tests and call sites;
- exclude speculative concerns, pre-existing problems, intentional behaviour changes and pure style;
- grade on a fixed scale and give an explicit no-findings statement rather than invent a finding;
- for a base-branch review, compare against the merge base.

If its scale differs from the flow's, the prompt states the mapping (for example critical = Block, high = Major, medium = Minor, low = Nit, an explicit no-findings statement = Clean). If the discipline is a skill that is not invoked implicitly, the prompt opens with its literal trigger (prompt rule 40); prose asking for "a code review" does not load it.

## Reviewer contract (put this in the review discipline or the reviewer's global instructions)

**Role.** Inspect the stated review target and report findings. Do not edit code, tests, configuration, commits, branches or remote state. Do not run destructive commands. Do not run the test suite.

**Context boundary.** In round 1, read only: the prompt file, the spec and acceptance criteria, the target diff and the source references named in the prompt, and the stated test evidence. Do not read the kickoff, implementation notes, the Phase 8 review or earlier findings. A later round reads only the earlier finding and the claimed remediation needed to verify it.

**Method.**

1. Confirm repository, branch, base and commit match the prompt.
2. Read the diff and the surrounding contracts, callers, tests and runtime facts.
3. Test each suspected issue against a concrete trigger, state and bad outcome.
4. Treat comments, doc comments and commit-message statements in the range as claims to verify; give a verdict per claim checked. Confident wording earns more scrutiny.
5. Report only what the target supports. Return Clean when nothing defensible remains.

**Finding threshold.** Each finding has: severity, `file:line`, trigger, state and bad outcome, why existing tests or guards do not catch it, and a remediation direction. Reasoning comes before the grade. No line and no failure mechanism → drop or downgrade it.

**Receipt.** The report opens with:

```text
Prompt: <prompt file name>
Repository: <path>
Branch/base: <branch> vs <base>
Target: <commit SHA or "working tree">
Round: <N>
Review discipline loaded: <yes, from <path or name> | no>
Verdict: <Block | Major | Minor | Nit | Clean>
```

In `agent-run` mode the reviewer cannot write files, so it returns the whole report in its reply and the caller saves it verbatim as the findings file. In `human` mode it writes the findings file into the item folder. Either way, a copied, renamed or self-written receipt is invalid.

## Routing rules (if the reviewer delegates to sub-agents)

- Delegate every review to the one read-only review agent, with the review discipline loaded.
- Do not use any other review skill or profile unless the prompt asks for it.
- No silent fallback: if the discipline cannot load, stop and report.
- Use the caller's severity scale in the report when the prompt states a mapping.

## Verification (run once per machine, and after any reviewer update)

Do not trust that config files exist. Run a read-only review of a small change that has already been reviewed, and confirm all of:

- [ ] the probe ("Reply with the single word: ok. Do not use any tools.") returns `ok` from the target worktree;
- [ ] the reviewer reports that its review discipline **loaded**, and from where;
- [ ] it wrote no files and the reviewed repository is unchanged (`git status` clean);
- [ ] no test command ran;
- [ ] no other review skill or profile was used;
- [ ] the report opens with the receipt header and uses the mapped scale;
- [ ] with the discipline deliberately made unavailable, the reviewer **refuses** instead of returning Clean.

The last check matters most. In the setup this skill came from, a reviewer whose discipline was wiped mid-setup refused rather than returning Clean, and that refusal was the only reason the breakage was noticed.

## Keeping it current

- A reviewer tool process left running from before an update keeps the old version until restarted.
- If you install a private copy of a review discipline because the reviewer does not ship one yet, add an entry to `deferred-work.md` to remove the copy once upstream ships it; a private copy that takes precedence silently drifts from upstream fixes.

## Related

- `../code-review-prompt-rules.md`: rules 14-17, 36, 40-42 and the skeleton.
- `../phase-9-external-review.md`: run modes and Gates 1, 1.5 and 2.
