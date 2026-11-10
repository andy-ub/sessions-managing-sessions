# Phase 7 — Domain review panel (optional)

## Step identifier

`phase-7-domain-panel`: N persona subagents review the Phase 6 text in parallel, before code review and commit.

**Optional, but binding when it applies:** it runs whenever Phase 6 produced new or changed text, and is skipped exactly when Phase 6 is.

## Sequence

- **Runs after:** Phase 6.
- **Hands to:** Phase 8.

## What this step does

Each persona reads the exact text through one lens and reports only from that lens. It catches text-level defects that code review cannot see: a caveat that misleads a real user, a field promoted from configuration to observed fact, a recommendation the data does not support. Block findings must be resolved before commit.

## Skill

**`superpowers:dispatching-parallel-agents`**: one subagent per persona, all dispatched in one message.

## The panel

Keep the personas in files in your own repository (one file per persona: who they are, the lens, what a Block looks like, a no-findings sentinel). Pick three to five lenses that match your users. An example set for an orders and invoicing app, mapped to the Phase 2 audit:

| Persona lens | Owns audit questions |
|---|---|
| Voice: fact versus opinion, generic versus imposed wording | Q1b, Q3 |
| Workflow stage: polarity, which order stage (draft, invoiced, paid) the text speaks to, handoffs | Q2, Q6 |
| Hypothesis: does the text support evidence-led action, or echo a guess? | Q7 |
| Data trust: filter policy (for example whether cancelled orders count), evidence tier, aggregation, caveats | Q1a, Q5 |

## Notes

- **Each subagent receives:** its persona file path, the full text under review, and a short context block (what the data layer can and cannot see, precedents from earlier items).
- **Severity:** each persona returns a no-findings sentinel, or findings graded **Block / Concern / Nit** with evidence and a suggested change.
- **Merge rule:** a single finding keeps its severity; two or more distinct personas raising a Concern on the same point elevate it to Block.
- **Binding rule:** the report embeds the **full text reviewed**, not a snippet or a path. If the text changes in any way after the run and before the Phase 11 commit, the verdict is void: rerun the panel on the final text. A valid report about text that does not ship proves nothing.
- **Regression manifest:** keep a small set of known-defect eval cases (a text with a planted defect, the persona expected to catch it, the expected severity). Run it after any change to a persona or to the merge rules, before trusting the panel on live work.
- The panel output stays local; do not post it to the tracker.
- A product-intent conflict the panel surfaces goes to Phase 4 and the owner, not to a local rewrite.

## Output

`phase-7-domain-panel-{DD-MM-YYYY}.md`: the full text reviewed, each persona's verdict (sentinel or findings), merged severities, context gaps, run health.

`implementation-notes.html` §7: "Domain panel: {N} Block / {M} Concern / {K} Nit. Cleared for commit." or the fixes being applied.

## Checklist

- [ ] `superpowers:dispatching-parallel-agents` invoked; one subagent per persona in a single message.
- [ ] Each received persona file, full text and context block.
- [ ] Outputs parsed and merged per the merge rule.
- [ ] Report saved with the full text embedded.
- [ ] Every Block resolved; each Concern applied or pushed back with evidence in §2 or §4.
- [ ] Text in the code matches the reviewed text exactly (or the panel was rerun).
- [ ] §7 updated.
- [ ] Hand off to Phase 8.
