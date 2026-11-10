# Deferred hardening ledger

Template. The durable queue for process hardening deliberately **not** done yet. Not a wish list: every entry has a trigger, an entry point and a completion proof, so a later session can pick it up safely. The example entry is invented.

## Resume protocol

When maintaining this flow:

1. Read the repository `CHANGELOG`, then this file, before proposing changes.
2. Pick only an item whose **trigger has fired**. Otherwise leave it `DEFERRED`; do not build an abstraction just to empty the ledger.
3. Make a narrow change from the stated entry points. Keep the mechanism-first rules.
4. Run the item's proof, append a dated evidence note under the item, set it `COMPLETE`, and mention it in the `CHANGELOG`.
5. A new deferral is added here, in this schema, in the same change that defers it. A deferral that exists only in chat or a changelog line is not a deferral.

## Entry schema

```markdown
## H-NNN — <short title>

- **Status:** DEFERRED | IN PROGRESS | COMPLETE, and what kind of trigger (event, dogfood signal, external dependency)
- **Source:** where and when it came up (DD-MM-YYYY)
- **Problem:** what can go wrong today, concretely
- **Trigger:** the observable event that starts the work
- **Do not start merely because:** the tempting non-reasons
- **Entry points:** the files or settings to change
- **Required design:** the shape of the change, and what it must not do
- **Completion proof:** what demonstrates it works, including a negative case
```

---

## H-001 — Mechanical check that every Phase 9 prompt has a findings file

- **Status:** DEFERRED (dogfood signal)
- **Source:** 12-01-2026, process review
- **Problem:** Phase 9 Gate 2 requires a findings file with an origin header, but an instruction-level gate can still be skipped or hand-written.
- **Trigger:** a real item reaches Phase 11 without a matching, origin-valid findings file; or two items show the manual check is routinely missed.
- **Do not start merely because:** a hook sounds stronger.
- **Entry points:** `phase-9-external-review.md` Gate 2; `phase-11-commit-push.md`.
- **Required design:** before commit, pair each `phase-9-*-prompt-r{N}.md` with its findings file and validate the header. Block only mechanically decidable absence or mismatch. Give it a release valve and make it fail open if it cannot run, so a broken check never strands an item.
- **Completion proof:** missing-pair and wrong-origin fixtures are blocked; valid single-repo and cross-repo pairs pass; one real item uses it without a bypass.
