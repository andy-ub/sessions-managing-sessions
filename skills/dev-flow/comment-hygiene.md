# Code comment hygiene

The definition the Phase 8 comment pass applies, and the rule behind the strip-before-review gate. Open this file during the pass; do not run it from memory.

## The test

> **A comment is junk if deleting it costs the reader nothing.**

Code already says *what* it does. A comment earns its place only by saying something the code cannot: why this way, why not the obvious way, or what contract holds that the types do not express.

## The kinds of junk

(Unnumbered on purpose: a heading that said "six" while listing seven is the same defect as a count in a comment.)

### Translating code into English

```csharp
// Order totals keyed by id, open orders only (List() skips cancelled orders, which are never invoiced).
var totalsByOrderId = orderRepository.List().ToDictionary(order => order.Id, order => order.Total);
```

The first half is the line read aloud. The second half is real information. Keep the half that informs.

### Narrating the process or the timeline

"after review", "corrected in Phase 8", "the panel flagged this", person names, ticket numbers, dates. Git history owns how the code got here; the code owns what is true now. A reader six months out wants the second and is misled by a half-remembered version of the first.

### Repeating the interface doc on the implementation

If the interface documents the contract, the implementation does not restate it. Two copies drift, and the one on the concrete class is usually the one that goes stale. Use an inherit-doc mechanism where your language has one.

### Decorative banners

`// ----- SectionName -----`. Structure is the file's job.

### Test comments that repeat the assertion message

The assertion message already explains intent to whoever reads the failure. A comment saying the same thing is a second copy to keep in sync.

### Justifying a structural decision instead of describing the code

`// Kept separate because...`, `// Deliberately NOT split...`, `// The recovery path and its caveat stay together...`

The comment defends how the code is arranged rather than telling the reader what it does. Six months on nobody is relitigating the arrangement. Where a split or merge is provably byte-identical in output, the comment defends a decision with no downside if reversed. **Order** is the exception: order changes the output, so order comments are worth keeping.

Lesson: this kind was added after the file failed to prevent it within a day of being written. Seven such comments were written while restructuring one class, and all seven were deleted the same day with no information lost, because the reasoning was already in the commit message.

### Stale comments

Describes behaviour that is no longer true. **The worst kind**: the others are noise, this one lies. It survives refactors because nothing compiles against it, and it does most damage on a public interface, where it is the first thing a reviewer or an external implementer reads. Example: an interface doc said a collection "carries no configured sort order"; review proved it does. The implementation and the user-facing text were corrected; the interface doc was missed and kept asserting the opposite.

### Walking the reader through the reasoning instead of stating the fact

The kinds above are comments that should not exist. This one limits comments that should: a "why" or a landmine can be a keeper by category and still be three times too long.

```ts
// The reset alone would not hold. A request already in flight still carries a matching
// sequence, so it resolves rather than being discarded, and a failure puts the page it was
// read from back before the scheduled frame runs. Moving the sequence on is what makes that
// answer superseded, which is the one outcome that returns before writing any state.
```

Four sentences for one fact: *the sequence moves on so an in-flight failure cannot restore the old page.* The rest is the trace of working it out.

**Why review makes it worse.** On one PR, each of several review rounds returned at least one comment-accuracy finding, and each correction added a qualifying clause; nothing pulled the other way. The final review asked for one thing: shorter comments. Merge prep cut the comments in the worst files to about a third, with no fact lost.

**The norm:** state the invariant and stop, in a line or two. Past about three lines, what was added is usually derivation. The exception is a landmine whose consequence must be spelled out (see the keeper below).

### Where structural junk comes from: splitting a declaration

A comment does not split with the thing it describes. Splitting one constant into several leaves its comment above whichever fragment is first, now describing something else. One split of six constants into seventeen produced three of four stale comments found an hour later: a comment above a constant it had nothing to do with, a comment promising to cover a half that had moved, and a test comment stating a count that was now wrong.

Two rules: after splitting or renaming a declaration, re-read the comment above every piece; and **never put a count in a comment**.

## What is not junk

- **Why, where the obvious choice is wrong.** Rationale a reader cannot reconstruct from the code.
- **Landmines.** A warning that stops the next person "fixing" something into a defect. The highest-value comments in a codebase; state the consequence, not just the rule.
- **Contract the types do not carry.** For example: null means "unavailable", empty means "none configured".

A keeper:

```csharp
// Looked up on first use through IServiceProvider, not injected in the constructor:
// InvoiceService -> IOrderService -> ... -> IInvoiceService is a DI cycle.
// Injecting IOrderService in the constructor fails container validation at startup.
```

Nothing in the code hints at this, unit tests pass either way, and the build passes either way. Without the comment, the "cleanup" that breaks startup is inevitable.

## The strip-before-review gate (end of Phase 8)

Comments that explain logic are stripped from the diff so the external reviewer reads bare code. A comment that explains logic is an **unverified claim**, and a reviewer who reads it tends to accept it instead of checking. Stripping forces a grounded review and surfaces comment rot for free. It is a step inside Phase 8; the flow is not renumbered.

**The reviewer's re-derived question is the receipt.** If the reviewer, reading stripped code, asks the question a removed comment answered, an independent reader has shown it is needed. The one-line answer is the comment to re-add.

**Two signals, not one.** Reviewer silence is not proof a comment was worthless; the reviewer may not have looked there.

- reviewer asked → keep, one line, receipt recorded;
- reviewer silent **and** the comment fails the deletion / reversal test → cut;
- reviewer silent **and** it passes → keep, one line.

**Rationale routing.** Context that is not a code fact (a design signed off, a surface out of scope, why an alternative was rejected) goes into the Phase 9 prompt file (the reviewer reads it) and `implementation-notes.html`, never the source. Otherwise each review round's "why is this like this?" gets answered in the file, and four rounds later the file has a 20-line header.

**Comments come back before commit, smaller, with receipts.** Sequence: strip at the end of Phase 8 → Phase 9 rounds → re-add surviving facts as one-liners at Phase 10/11 → commit. The reviewed and committed artifacts then differ in comments only; say so in the phase file so nobody reads it as a bypassed gate.

## Relation to language style guides

A language's official comment conventions are usually mechanical: delimiter, placement, capitalisation, punctuation, doc comments on public members. This file is about whether a comment earns its place, which those guides rarely address. They do not conflict; read both. Where the repository already deviates consistently from a style guide (end-of-line comments, lowercase openings), follow the repository rather than converting other people's files.

## Stopping it from happening again

Writing the rule down did not work on its own; that was measured, not suspected. Two causes:

1. **The file did not name the class.** The comments were a shape the rule had not described. Closed by adding the kind.
2. **Comments are written when the decision is made**, when the reasoning feels valuable and the cleanup pass is hours away. A definition consulted at cleanup cannot prevent something written at design time.

### The redirect, which is the actual fix

> **Reasoning about a change belongs in the commit message. Only reasoning about the code stays in the code.**

A prohibition with no outlet gets violated, because the urge to record reasoning is legitimate. The commit message and `implementation-notes.html` are its homes. The test for any structural comment: **if this decision were reversed, would anything break?** For a split or merge, no, so no comment. For order, yes, so keep it.

### On a mechanical check

A banned-phrase test was measured and rejected. A year pattern matched legitimate dates inside test fixtures; a phrase like "Deliberately NOT" matched a legitimate scope-boundary comment as well as junk. What survives is too thin to be a gate, and **a check that looks like a gate but is not one is worse than no check**. An advisory grep before committing is still useful, understood to catch known wording only:

```
git diff --cached | grep -nE '^\+\s*//.*(Kept separate|Deliberately NOT split|Separated deliberately|// ---)'
```

A hook was also rejected: a failing hook once blocked file reads and every turn end for a whole session. Not worth it for a stray comment.

## Working rule when cleaning up

- **Delete** what is wrong or provably redundant. Safe; do it immediately.
- **Trim** what is verbose: delete derivation, keep every clause that states a fact the code does not. Identify the fact, drop the path that led to it, re-read once to confirm the fact survived. The caution is about *which* clauses go, not about whether to cut.
