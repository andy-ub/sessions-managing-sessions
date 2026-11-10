# Grill ledger (cross-item human understanding)

Template. Store 8 in `memory-routing.md`. Where `recurring-lessons.md` tracks code and review patterns, this tracks **the human's understanding**: the weak areas the Phase 3.5 grill surfaces, aggregated across items, so learning becomes measurable. The example rows are invented.

- **Captured** at the end of each grill session: raw, dated, item id. Never deferred to a step that can be skipped.
- **Consolidated** periodically (for example at the end of the day): dedupe, count recurrences, tag recurring areas `[INVEST]`, move mastered areas to *graduated*.
- **Read** at the start of Phase 3.5, so the grill probes recurring weak topics harder.
- **Entry format:** `[DD-MM-YYYY, #<item>] <topic>: <the specific gap>. <score ❌ / 🟡 / ✅>`

Lifecycle: captured → recurs in two or more items → `[INVEST]` (study with intent) → a fresh probe with no hints passes → *graduated*.

Count only gaps a grill surfaced. A finding from code review is evidence about the code, not about the human's understanding, and does not advance the ladder.

---

## weak-areas

- [05-03-2026, #1270] Test layering / false green: could not say which mocked test goes red if the production query changes (answer: none; the mock sits between the assertion and the change). ❌

## [INVEST] (recurred in two or more items)

- _(none yet)_ Suggested shape for an entry: the topic, the items it recurred in, and one concrete exercise, e.g. "before writing an assertion in a mocked test, name the layer the change lands at and ask whether the mock sits between it and the assertion".

## graduated

- _(none yet)_ Record the evidence: the item, the fresh probe, and that it passed with no hints.

## strengths

- [05-03-2026, #1270] Asked a clarifying question mid-grill instead of nodding through; it exposed a three-way confusion worth more than a confident wrong answer.
