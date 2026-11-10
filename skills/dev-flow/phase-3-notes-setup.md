# Phase 3 — Implementation notes (+ Phase 3.5 grill gate)

## Step identifier

`phase-3-notes-setup`: create `implementation-notes.html` in the item folder and seed it from Phase 2.

## Sequence

- **Runs after:** Phase 2 checkpoint confirmed.
- **Hands to:** Phase 3.5 (grill), then Phase 4.

## What this step does

Creates the notes file that grows through Phases 4-12: audit summary, decisions, trade-offs, open questions, spec changes, items for the PM, and an update log. HTML is convenient for reading; Markdown works too.

## Notes

- **Concern threshold** (log it): spec ambiguity, an edge case with two or more viable options, runtime correctness doubt, a naming collision, a cross-system collision, risk from an intermediate choice. Skip ambiguities you can settle in under five minutes.
- **Autonomous decision threshold** (log it with reasoning and rejected alternatives): shapes a public surface, defines an error or edge contract, picks between viable patterns, crosses an acceptance-criterion boundary, affects a downstream surface. Skip local refactors, variable and test names, comment wording, formatting.
- The file stays local. Never paste it into the tracker.
- Voice: structured documentation for your future self.
- **Body = latest state; §7 = history.** When a later phase accepts a finding that changes the design, revise the body section in place, mark it `(revised Phase 9 r1, see §7)`, and log the change in §7. A notes file not updated after review is stale and misleading.

## Output

`<scratch>/{item folder}/implementation-notes.html`, seven sections:

1. Audit summary (from Phase 2), each question tagged.
2. Decisions (D1, D2, ...).
3. Trade-offs (T1, T2, ...).
4. Open questions (OQ-A, ...), seeded from Phase 2, resolved in Phase 4.
5. Changes from the spec.
6. To raise with the PM.
7. Update log: dated checkpoints (TDD cycles, each review finding with its decision and reason, panel runs, push, UI verification, breaker re-checks, skipped phases with reasons).

## Checklist

- [ ] Create the file with all seven sections.
- [ ] Transcribe the Phase 2 audit into §1 with tags.
- [ ] Move open questions into §4 (Pending) and spec staleness into §5.
- [ ] Run Phase 3.5 below.
- [ ] Hand off to Phase 4.

---

## Phase 3.5 — Grill gate (understanding check)

A human-understanding gate, distinct from the Phase 0 and Phase 2 approach gates: those confirm the approach is right; this confirms the human actually understands the design before code is written. Rule behind it: never ship what you cannot explain.

**Runs after:** Phase 3 (there is now a concrete design to grill). **Hands to:** Phase 4; the grill usually surfaces the real questions for the owner.

### Steps

1. **Read `grill-ledger.md`** (beside this skill) for recurring weak areas, so the grill probes them harder.
2. **Invoke a "grill-me" style interview skill** on the packaged design: one question at a time, each with a recommended answer, walking the design tree until understanding is shared. Where the code can answer a question, it reads the code instead of asserting.
3. **Save the session** as `grill-{DD-MM-YYYY}.md` in the item folder: a score per question (❌ / 🟡 / ✅), weak areas, strengths, topics to review.
4. **Capture to the ledger now:** append each weak area (dated, item id) to `grill-ledger.md`. Do not defer it to an end-of-day step that can be skipped.
5. **Feed Phase 4:** any 🟡 or ❌ that is really a design-intent question owned by someone else becomes an open question.

### Pass condition

- **Mechanism first.** The gate passes only when the interview skill was actually invoked (a real Skill tool call) and `grill-{date}.md` exists. A self-administered checklist, a summary table or "I asked myself the questions" never passes; that is the generator grading its own output. If the skill cannot be invoked, the gate is BLOCKED; tell the human.
- **Coverage floor.** The grill file maps every active ledger weak area and every open Phase 2/4 question to a question with a result, or to an evidenced N/A. One trivial ✅ does not pass.
- **Substance.** Every core question reaches ✅. A remaining 🟡 is either studied and re-confirmed, or becomes a Phase 4 question for the owner. Never enter Phase 5 on an ❌ core understanding: a green unit test over a misunderstood design is how false greens ship.

### Skip conditions

- Trivial work (typo, dead code) may skip, as a logged decision in §7, never a silent substitution.
- A non-trivial bug runs at least a thin grill on the fix mechanism. "The intent is clear" is not a skip reason.
- **On resume the gate is mandatory.**
