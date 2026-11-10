# Memory routing: where learned knowledge goes

Answers one question:

> **Something was just learned. Which store does it go in?**

Without a rule, knowledge lands in the wrong store, or nowhere, and is gone by the next item. This file is a lookup table; it gates nothing.

## The stores

| # | Store | Scope | Owns | Lifetime |
|---|---|---|---|---|
| 1 | This skill | The **process** | Phase steps, templates, rules of the flow | Permanent; a change is a process change |
| 2 | Workspace `CLAUDE.md` | Workspace **governance** | Stable workspace facts, cross-phase rules, folder and branch conventions, tracker authorization | Rarely changes |
| 3 | `recurring-lessons.md` | **Cross-item** code and review lessons | Patterns that repeat across items, in four sections (below) | Until graduated |
| 4 | Claude project memory | The **human and the project** | Preferences, feedback, project decisions, reference links | Long-lived; one fact per entry |
| 5 | Repository or area `CLAUDE.md` | One **repository or folder** | "This area works like X; edit pattern Y; gotcha Z", next to the code. Repository root first; nested files only when an area's conventions grow | Lives with the code |
| 6 | `implementation-notes.html` | **One item** | Its concerns, decisions, review debate | Archived with the item |
| 7 | Session context | **This session** | Transient research and observations | Ephemeral |
| 8 | `grill-ledger.md` | **Cross-item** human understanding | Weak areas the grill keeps finding in the human's own understanding | Until graduated |

**Store 3 versus store 8:** `recurring-lessons.md` is what the code keeps teaching (bug classes, test gaps); `grill-ledger.md` is what the human keeps needing to learn. Both are cross-item and both graduate; one is about the codebase, the other about the operator.

`recurring-lessons.md` sections: `repo-patterns` · `false-positives` · `test-gaps` · `code-review-findings`.

## Routing decision tree

First match wins:

1. True **only for this item**? → `implementation-notes.html` (6).
2. A **pattern that has recurred or will recur** across items (a bug class, a repeated review false positive, a test gap)? → `recurring-lessons.md`, right section (3).
3. A **convention of this repository or folder**? → that `CLAUDE.md` (5).
4. A stable **workspace or governance fact**? → workspace `CLAUDE.md` (2).
5. About **the human, a preference or a project decision**? → project memory (4).
6. Did **the process itself** change? → this skill (1).
7. Just **transient research**? → leave it in the session (7).

If two fit, prefer the narrowest (item < area < cross-item < workspace). Never copy one fact into two stores; pick one home and link to it.

## Graduation lifecycle

1. **Capture:** a lesson surfaces (TDD, review debate, a bug). Write it to `recurring-lessons.md`, dated, one line plus why.
2. **Promote:** it recurs, so it has earned permanent enforcement.
3. **Graduate** into the store that enforces it without anyone remembering:
   - a mechanical rule → a **hook**;
   - a code-level invariant → a **test**, or a comment at the site;
   - an area fact → that folder's **`CLAUDE.md`**;
   - a process rule → **this skill**.
4. **Remove** the line from `recurring-lessons.md` (a one-word pointer to its new home is fine).

## Read-gates

- **Phase 2:** read `recurring-lessons.md` (`repo-patterns`, `test-gaps`) and the area `CLAUDE.md` before planning.
- **Phase 3.5:** read `grill-ledger.md` before grilling.
- **Phase 9:** read `recurring-lessons.md` (`false-positives`, `code-review-findings`) before writing the prompt and before triage.

## Anti-patterns

- A one-item detail in `recurring-lessons.md` → noise.
- A recurring lesson left in one item's notes → it dies with the item.
- The same fact in `CLAUDE.md`, the skill and memory → drift.
- `recurring-lessons.md` growing without bound → graduate and remove.
