# Phase 2 — Design audit (or bug investigation)

## Step identifier

`phase-2-audit`: apply a fixed audit question set to the planned design and result shape before any code. Mandatory for feature stories.

**Bugs branch here:** a bug does not run the audit. It formally invokes `superpowers:systematic-debugging`, writes `investigation.md` (root cause with `file:line`, fix design, task breakdown, and the Phase 10 test plan), then passes the same checkpoint gate. Ops and deploy work skip Phase 2.

## Sequence

- **Runs after:** Phase 1.
- **Hands to:** Phase 3, after the checkpoint gate. The findings live in `phase-2-plan.md` (or `investigation.md`) and are summarised into `implementation-notes.html` §1 in Phase 3.

## Skill

`superpowers:writing-plans`. Save the output as `phase-2-plan.md`.

## Tracker usage

Search for prior decisions on related items. Read-only.

## The audit question set

Each question gets **Resolved** or **N/A** with a reason. Open questions go to Phase 4. The set below fits a feature that returns data to a user or to an AI assistant; replace it with your own if your domain differs, and keep the shape: a fixed list, each answer tagged, each lens owned by a Phase 7 persona where one applies.

| # | Question | Panel lens (Phase 7) |
|---|---|---|
| Q1a | Data-source fidelity and filter policy: which rows are included or hidden, and does the result say so? | data-trust |
| Q1b | Is each statement a fact or an opinion? | voice |
| Q2 | Polarity: is "up" good or bad for every field, and can that invert? | workflow stage |
| Q3 | Generic versus imposed semantics: does a field carry an implicit unit or meaning the consumer must guess? | voice |
| Q4 | Decision class: does this help someone browse and orient, or does it recommend an action? | (surface directly) |
| Q5 | Evidence tier: confidence, aggregation scope, attribution. | data-trust |
| Q6 | Workflow-stage attribution (for example draft, invoiced, paid) and handoffs to sibling features or tools. | workflow stage |
| Q7 | Recommendation hygiene: does it echo a hypothesis instead of evidence? | hypothesis |
| Q8 | Cross-context fitness: arguments and results usable outside the main UI (automation, other clients); no hidden session dependency. | (surface directly) |
| Meta | Field by field: is each field needed by a current acceptance criterion? | |
| Q-fact | Grounding: can every acceptance-criterion claim be answered from the data returned? A thin result shape pushes a model to fill gaps from priors. Surface or drop gaps; never engineer around them. | |
| Q-sec | Injection exposure: does the feature put user-authored free text (titles, names, URLs) in front of a model? If yes, note it: Phase 6 frames those fields as data to report, Phase 10 adds an injection probe. | |

## Notes

- **Read-gate:** before planning, read `recurring-lessons.md` sections `repo-patterns` and `test-gaps`, and the area `CLAUDE.md`.
- **Area-convention gate.** If the change touches an area whose conventions live outside the repository (registry in your project `CLAUDE.md`), pull that source, run its checks skill, and list in the plan the specific check ids the change will be judged against, with the source version. Naming them now makes Phase 8 mechanical.
- **One concept per feature.** If the scope spans two distinct concepts, raise a split in Phase 4.
- **Expose what exists.** Prefer surfacing data the system already produces over orchestration that synthesises new data. Note gaps rather than engineering around them.
- **Simplicity / YAGNI design check.** What is the simplest implementation that satisfies the criteria? List every abstraction the design adds and the current criterion that justifies it; drop the rest. Present the flattest design first. This is the cheapest place to catch over-engineering: no code or tests exist yet. Example of a miss: an invoice formatter built as a generic interface plus a reflection factory when one non-generic class was enough.
- **Front-load intent (hard gate).** If the item has no acceptance criteria, ambiguous intent, or "what outcome is correct" is a product or design decision owned by someone else, stop: the owner answers before Phase 5. Self-resolving it, even through a rigorous multi-agent panel, manufactures confidence around an unvalidated goal. A panel may explore; the owner confirms.
- **Phase 10 test plan (runtime / behaviour changes).** For bugs and any change verified by Phase 10 Track B, write the test plan now, next to the repro (template below). Name only screens and URLs you have confirmed exist. **Expected outputs and pass criteria are fixed here, before any run**; Phase 10 never edits them to fit results. Track A (AI-assistant tools) uses its four prompts instead.
- **No real UI path → say so now.** If the change can be verified only by injecting state, or not at all, tell the human in one line now: verify by injection, or skip Phase 10 with a reason. In multi-session mode this is a `CHECK` to the coordinator and does not block Phases 3-9.

## Output

| Task type | File |
|---|---|
| Feature story | `phase-2-plan.md`: audit, design, task breakdown |
| Bug | `investigation.md`: root cause `file:line`, fix design, task breakdown, Phase 10 test plan |
| Ops / deploy | none |

Never bury the audit inside the notes file; it must be findable on its own. Phase 3 transcribes a summary.

### Phase 10 test plan (Track B), in the same file

| # | Screen / URL | Data / fixture | Steps | Expected before fix | Expected after fix | Where to look | Measured signal | Verification level |
|---|---|---|---|---|---|---|---|---|
| 1 | {confirmed path} | {DB copy, date range, seed} | {what to click or call} | {outcome on base} | {outcome with fix} | {visible marker, e.g. "red 7px border on the main header"; or "data only"} | {signal name the script writes, e.g. `rows.before/after`} | {real UI / injected state / replica harness} |
| C1 | {control: must keep working} | … | … | {unchanged} | {unchanged} | … | … | … |

Primary rows: {numbers; the Phase 12 cloud check re-runs these}.
Pass criteria: {e.g. "every primary row PROVEN or DATA-ONLY by plan; none CONTRADICTED"}.

- Rows `C{n}` are controls. A row whose level is not "real UI" says why in its Steps cell.
- **Where to look** names a marker designed into the fixture so a screenshot proves the row on its own: a coloured border or background on the element the row is about, in a colour used nowhere else on the page. Never a `body` outline; an iframe or viewport crops it.
- **Measured signal** names the value the Phase 10 script writes to `signals.jsonl`; never a number typed by hand.
- If the UI drops or normalises an input before the server sees it, add a direct-request variant row (`{n}b`) that sends the input unchanged.

## Checklist

- [ ] Read `recurring-lessons.md` (`repo-patterns`, `test-gaps`) and the area `CLAUDE.md`.
- [ ] Area-convention gate: check ids and source version named in the plan, where applicable.
- [ ] `superpowers:writing-plans` invoked; output saved as `phase-2-plan.md` (bug: `superpowers:systematic-debugging` → `investigation.md`).
- [ ] Every audit question tagged Resolved / N/A with a reason.
- [ ] Open questions listed (Pending); spec staleness noted for Phase 4.
- [ ] Simplicity pass: every abstraction justified by a current criterion, or dropped.
- [ ] Q-fact and Q-sec passes done.
- [ ] Front-load intent gate: owner-owned intent questions answered by the owner before Phase 5.
- [ ] Track B test plan written: controls, primary rows, fixed expected outputs and pass criteria, markers, signals, direct-request variants. No real UI path → one line to the human now.
- [ ] **CHECKPOINT GATE: stop for the human.** Present the audit, approach, result shape and task breakdown. Wait for confirmation. If the human is away, hold.
- [ ] Hand off to Phase 3.
