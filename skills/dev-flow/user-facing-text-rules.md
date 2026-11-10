# User-facing text: structure and safe refactoring

Reference for Phase 6. Applies to any text that a model or end user reads to decide what to do: the description of a tool an AI assistant can call, a prompt fragment, help text. The worked example below is an AI tool description composed from string constants.

## The problem

A tool description is code (constants concatenated into one property) whose content is English and whose only reader is a model. It has a failure mode of its own: **it only grows.** Every review round that finds a defect adds a sentence; none removes one. Adding is safe; a new caveat cannot make the model more wrong. Removing is frightening; the sentence you delete may be the one that took nine rounds to get right, and nothing tells you until a user is misled.

In one case a description grew past ten thousand characters over many review rounds and panel runs, while its nearest sibling did the same job in about a third of that. Fix the asymmetry between "adding is safe" and "removing is frightening" and the text becomes maintainable.

## What makes it tractable

If every description is composed entirely from compile-time constants (verify that for your codebase), the assembled value can be read, hashed and compared. A refactor meant to change nothing can then be **proven** to change nothing, byte for byte:

- split a page-long constant into named pieces → no bytes moved;
- extract a phrase repeated five times → no bytes moved;
- reorder the composition → no bytes moved.

Only deliberate content cuts change the hash, and only those need judgement.

## Read the assembled value, never the source

Scanning the source gave a confidently wrong answer four separate times in one session:

| What was scanned | What went wrong |
|---|---|
| grep for a repeated phrase | One copy straddled a string-literal boundary and was invisible: count 4, truth 5 |
| Field-coverage check | Two fields sat on a second literal; the regex could not span the boundary |
| "Is the description dynamic?" scan | `\bthis\b` matched the English word "this" in prose |
| Length of each tool | The script resolved only constants in the same file and undercounted every tool that used a shared fragment |

Common cause: **this artifact is prose inside code, and a regex cannot tell the two apart.** The compiler can.

## The method

1. **Measure from the assembled value**: length per fragment and per tool.
2. **Find provable duplication**: the same fact stated in more than one fragment, where you can point at both.
3. **Cut only that.** State each fact once, in the fragment whose job it is.
4. **Split by meaning, not by size** (heuristics below).
5. **Prove the no-op.** Dump the assembled text before and after; compare hashes.
6. **Let existing guards fire, and when one does, restore the claim rather than loosen the guard.**
7. **Record order dependencies at the composition site**, where whoever reorders next will see them.
8. **After any intended content edit, diff the whole assembled text character by character** (for example `git diff --no-index --word-diff-regex=. before/ after/`). It must show exactly the characters you meant. A sentence-level check is blind to a dropped space between two fragments.

## Splitting heuristics

- **`And` in a constant's name means it holds two concepts.** Splitting such a constant once also surfaced a third thing buried at the end: the instruction the other two existed to justify.
- **A name that says nothing hides more than a long one.** A short constant with no `And` held three unrelated claims; only reading the text found it.

### The reference test, for the cases the heuristics cannot decide

Neither heuristic separates "several concepts" from "several instances of one concept". An out-of-scope list of ten lines, each `Does NOT <x>, covered by <y>`, with a precise name, looks splittable and is not.

> **Split when the pieces are referenced independently. Keep them together when they are only ever read as a set.**

Three greps, all empty before you keep a constant whole:

1. Does another fragment cross-reference the piece by name or label?
2. Does a test pin the piece alone, not only inside a whole-text snapshot?
3. Does any tool compose a subset of the pieces?

**A uniform list defends itself by staying together.** A panel once found one out-of-scope line with no destination while the other nine had one, which was visible only because the ten lines sat together. Split into ten constants, each name would also restate its value, the same defect as a comment that translates code.

### When not to split

- **A member of a labelled, exhaustive set** (items (a)-(e) classifying every result field): splitting one forces a renumber and breaks cross-references.
- **Halves that share a load-bearing framing sentence**: split them and the framing is either duplicated or each half is meaningless alone.
- **A prohibition and its carve-out**: keep them adjacent; when they drifted apart once, a contradiction appeared.

## The guard rule

An approval or predicate test that fires during a refactor has done its job. The reflex is to update the test to match the new wording. **Do not.** A guard once caught the removal of an explicit claim whose meaning survived elsewhere in weaker words; updating the assertion would have looked reasonable. The claim was restored instead, because loosening a guard right after it fires is exactly how five earlier defects got through.

A guard that fires is evidence. A guard edited to stop firing is evidence destroyed.

## Sharing fragments between tools

Reuse the invariant part (a parse rule, a list of allowed values); fork any sentence whose content must differ for one consumer. Editing a shared fragment changes every tool that uses it, silently, unless a test pins each tool's assembled text.

## What this method is not

- **Not the domain panel.** The panel asks "does this mislead a user?"; this asks "is this structured so a human can review it?". Independent axes: a four-persona panel found eight real findings on one description and none mentioned length or duplication.
- **Not a correctness check.**
- **Shorter is not better.** In the case above, about half the length was content the shorter siblings lacked, each piece tracing to a verified defect. The obvious baseline (the siblings' length) is not a proven correct size; auditing the older tools may well make them longer.

## Tooling to build once

A test helper that:

- discovers every tool by reflection (or your language's equivalent);
- reads each description **without constructing the tool**, which is safe only if no description touches instance state;
- guards that every description is a compile-time constant, so the no-op proof stays valid for future tools;
- dumps all descriptions to a folder when an environment variable is set, so you can dump before, dump after and diff.

## Result in the worked example

| | before | after |
|---|---|---|
| Length (characters) | past 10,000 | about 10 % shorter |
| Longest constant | 49 lines | 10 lines |
| Constants | 11 | 36 |
| Constant names containing "And" | 2 | 0 |

Every step except the deliberate content cut was verified byte-identical. The cut removed only duplication that could be pointed at in two places.
