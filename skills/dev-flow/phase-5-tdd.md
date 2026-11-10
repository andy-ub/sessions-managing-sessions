# Phase 5 — Strict TDD

## Step identifier

`phase-5-tdd`: implement through strict red-green-refactor.

## Sequence

- **Runs after:** Phase 4 (every question resolved, or deferred if technical).
- **Hands to:** by task type: a feature with user-facing text → Phase 6; otherwise (including logic bugs) → Phase 8.

## Skill

**`superpowers:test-driven-development`**, mandatory. Iron law: no production code without a failing test first. Code written before its test is deleted and redone.

## Notes

- Each cycle: RED (failing test) → confirm it fails for the expected reason → GREEN (minimal code) → confirm all tests pass and output is clean → REFACTOR (stay green).
- Test names describe one behaviour each (`Method_Condition_Expected` or similar; follow the repository).
- **Read the area `CLAUDE.md` before implementing**, and the external convention source if the area has one. A pre-edit hook that reminds you is a reminder, not the gate; the graded pass happens at Phase 8.
- **Public surface in a released major version:** default to non-breaking patterns (default interface members, virtual members, an obsolete-redirect). Break public surface only in a deliberate major release.
- **Test behaviour, not mechanism.** A test that proves your own infrastructure works ("the factory finds the implementation by reflection") rather than that the feature behaves is a sign the infrastructure is unnecessary. Question the abstraction, not the test.
- **Requirements traceability.** Every test traces to an acceptance criterion or a domain-real failure mode (a way the feature can genuinely be wrong for its user). A test for a scenario no criterion implies is speculative scope: get the human's sign-off or drop it. Weigh failure modes by impact × probability × detectability.
- **Mock the source production reads.** A mock of a conveniently pre-populated entity can hide that the production read path never populates that collection. Check what the real query hydrates.
- **Explain before deciding.** For a design-level choice during TDD (pattern A or B), give the mechanism and trade-offs first, confirm the human follows, then implement.
- **Keep reasoning about a change out of the code**; it belongs in the commit message. `comment-hygiene.md` has the test. A comment not written is one nobody has to catch at Phase 8.

## Output

- Tests in the repository's test project; production code in the main project.
- `implementation-notes.html` §2 decisions, §3 trade-offs, §7 TDD checkpoints (per cycle or batched).

## Checklist

- [ ] `superpowers:test-driven-development` invoked.
- [ ] For each kickoff test case and audit discipline: failing test first, confirm RED, minimal GREEN, refactor.
- [ ] Each test traces to a criterion or a domain-real failure mode; speculative ones signed off or dropped.
- [ ] Each test asserts behaviour, not your own mechanism.
- [ ] Decisions and trade-offs logged as they arise.
- [ ] §7 updated per checkpoint.
- [ ] Full suite green (record the count, e.g. `214/214`) before leaving Phase 5.
- [ ] Hand off to Phase 6 (user-facing text) or Phase 8.
