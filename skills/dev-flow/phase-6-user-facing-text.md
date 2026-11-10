# Phase 6 — User-facing text (optional)

## Step identifier

`phase-6-user-facing-text`: write the text that end users or an AI assistant read to decide what the feature does and how to use it. Typical cases: the description of a tool an AI assistant can call, a help text that drives a decision, a prompt fragment, an error message that tells the user what to do next.

**Optional.** Skip when the item adds or changes no such text, and log the reason in §7. When this phase is skipped, Phase 7 is skipped too.

## Sequence

- **Runs after:** Phase 5 (the code the text describes exists and is tested).
- **Hands to:** Phase 7.

## What this step does

The text is a contract between the implementation and its reader: when to use the feature, what its scope is, what each field means, and what the reader may and may not conclude. For an AI tool description, the reader is a model deciding whether and how to call the tool, so the text is a prompt and is written like one.

## Notes

- **Structure:** for anything longer than a paragraph, compose the text from named blocks (constants, sections), each covering one discipline: when to use, how inputs resolve, what the output means, caveats, out of scope. How to split, and how to refactor without changing a byte by accident: `user-facing-text-rules.md`. **Read the assembled value, never the source**: a phrase split across two string literals is invisible to a grep.
- **Length is not the target, and the shortest sibling is not the baseline.** A shorter sibling may be under-described. Cut only provable duplication; let Phase 10 decide the rest.
- **Never promise behaviour the runtime does not enforce.** If a field can be null on the success path, the text says so.
- **Reuse cross-feature phrasing** for shared caveats (data freshness, polarity, scope handoffs) so the same concept reads the same everywhere.
- **Out of scope names the sibling.** "Does not return X; use `<sibling>`."

### Rubric (a description is a prompt)

- **Instruction:** open with one concrete command-verb sentence stating what the feature does ("Returns a customer's unpaid invoices, oldest first", not "gets data about invoices").
- **Context, when and when not:** encode scope boundaries explicitly and name the sibling to use instead. Phase 10's scope-boundary probe tests exactly this.
- **Input:** parameters, units, allowed ranges, and data-freshness limits.
- **Output:** what the result contains, so the reader frames its answer correctly.
- **Trigger examples:** one to three realistic user phrasings that should route here.
- **Factuality framing:** if Q-sec flagged user-authored free text in the result, frame those fields as data to report, not instructions to follow. No unverifiable claims, no personal names.

## Output

- The text in the source, composed from named blocks.
- `implementation-notes.html` §2: decisions about its shape (how many blocks, which caveats, which template it mirrors).

## Checklist

- [ ] Applies? If no user-facing text changed, log the skip and go to Phase 8.
- [ ] Composed from named blocks, split per `user-facing-text-rules.md`.
- [ ] Rubric run: instruction, when / when not with sibling named, input, output, trigger examples, factuality framing.
- [ ] Every claim matches what the code does (no over-promises).
- [ ] Covers the Phase 10 categories: acceptance-mirror, edge, scope boundary, realistic phrasing.
- [ ] Hand off to Phase 7.
