# Recurring lessons (cross-item)

Template. Store 3 in `memory-routing.md`. Copy it next to your installed skill and fill it as items teach you things. The example rows are invented.

- **Read** at Phase 2 (`repo-patterns`, `test-gaps`) and Phase 9 (`false-positives`, `code-review-findings`).
- **Written** at the Phase 12 compound step, after the human approves.
- **Lifecycle:** capture → recurs → graduate into a hook, test, area `CLAUDE.md` or this skill → **delete the line**. A small staging queue, not a landfill.
- **Entry format:** one line (or a short paragraph), dated, with the why and a guard:
  `[DD-MM-YYYY, #<item> / PR <n>] <lesson>. Guard: <what to do next time>.`

---

## repo-patterns

Recurring code and structure conventions that planning should assume.

- [03-02-2026, #1234 / PR 42] A new `Reset()` that nulls a lazily-primed cache field turns an unlocked "check then return" fast path into a null-return race. **Guard:** read the field once into a local on the fast path, and recheck every other unlocked read of that field.

## false-positives

Review findings settled as non-issues. Injected into the Phase 9 prompt so a later round does not re-flag them.

- [10-02-2026, #1250 / PR 47] "Service-locator instead of constructor injection in `InvoiceService`" is deliberate: it breaks a DI cycle that only fails at startup. Not a finding.

## test-gaps

Categories of tests repeatedly missed. Feed Phase 2 and Phase 5.

- [17-02-2026, #1262] A "reset before refetch" test on a cold cache passes even when the code never clears its cache. **Guard:** prime the cache first, then reset, then assert the refetch; confirm the test fails with the clear line removed.

## code-review-findings

Recurring real findings across rounds; candidates for a hook, test or `CLAUDE.md`.

- _(none yet)_
