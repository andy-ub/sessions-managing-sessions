# Phase 0 — Intake + kickoff

## Step identifier

`phase-0-spec-kickoff`: the first phase of a **fresh** item. On a resume, do not re-run Phase 0: run the pre-flight resume gate in `SKILL.md`, then re-enter at the earliest incomplete phase. Re-running Phase 0 risks overwriting a real kickoff.

## Sequence

- **Runs after:** the item is committed to the current iteration and the human decides to start.
- **Hands to:** Phase 1, only after the checkpoint gate below.

## What this step does

Loads the item into a working model and writes the kickoff artifact, so the human (and any later session) can see what ships, why it matters to the user, and how it fits the bigger picture. The kickoff is the driver's context document, not a PM deliverable.

## Skill

`superpowers:brainstorming` (optional), when the spec leaves design space open. Save its output as `phase-0-brainstorm.md`.

## Tracker usage

- Read the item: description, acceptance criteria, relations, reported version and environment.
- Read **all** comments (often a separate call). Owner analysis often lives there.
- Optional: search for related prior decisions.

## Requirement justification (Tier-1 YAGNI), per acceptance criterion, before planning

The simplicity passes later ask *how* to build minimally. This asks *whether* each criterion is worth building now, whoever wrote it:

1. Which user problem does it serve?
2. Who is waiting on it; what breaks without it?
3. A fix, or a nice-to-have?
4. Was it deferred or descoped before? Why, and what changed?

**Proportionate by default.** An obvious fix justifies itself in one line. Scrutinize only when the answers are weak (niche value, nobody waiting, deferred before, not a fix) or a risk-checklist item is set.

**Un-defer / scope-add tripwire.** If the work un-defers a criterion or adds scope beyond the item's current state, this gate is mandatory before any code, tests included. Lesson behind it: an un-deferred criterion with no re-justification once grew into a full, test-green mechanism that was reverted before its first commit.

**Output is a flag and a recommendation, never a silent scope change.** Report to the human and get confirmation before cutting or deferring, even on an item the human owns. If the PM owns it, the human sees the evidence first and the question reaches the PM as a drafted, evidenced question.

## Output

**Feature story:** `<scratch>/story-{parent-id}-{slug}/kickoff.html` (HTML or Markdown, your choice; keep it consistent across items). Sections:

1. Purpose for the user, in natural-language scenarios (what the user asks or does).
2. What ships: files added or changed, public surface, result shape.
3. Test cases: `input | expected behaviour | discipline verified`, covering every acceptance scenario at minimum.
4. Out of scope.
5. Dependencies: other PRs, package versions, blocking items.
6. Big picture: related items, PR table, sequencing.
7. Phase status (0-12) and plan-change history.

**Standalone bug, task or feature:** `<scratch>/{bug|task|feature}-{id}-{slug}/phase-0-item-intake.md`: full item and comments read, repro, version and environment (verbatim), agreement or divergence with any owner analysis, intended scope, initial risk score, and the reproduce-first outcome.

## Checklist

- [ ] **Pre-flight first** (`SKILL.md`). Anything found → resume gate, not Phase 0.
- [ ] **Read the full work item**, every task type, including bugs: description, acceptance criteria, repro, version, environment, relations, **and all comments**, before reading code, before any diagnosis, before trusting any local artifact. If the owner posted an analysis, anchor on it and state agreement or divergence with reasons. A root cause sitting in comment 1 is easy to miss.
- [ ] **Reproduce first (bugs and behaviour items, mandatory).** Reproduce the reported symptom live, on the reported version and environment, before any diagnosis or fix.
  - Reproduced → proceed.
  - Not reproduced → **vary the method first**: the reporter's exact flow, a deeper or more specific poke, different timing or state. A negative repro is usually a method artifact; a shallow poke once produced a false negative that nearly triggered a premature escalation.
  - Still not reproduced after genuine variation → raise it with the reporter or lead, and decide before investing. Never build a fix for a symptom nobody has seen live. A lead's "confirmed and root-caused" comment may be code reading, not a live repro.
  - Record the outcome (exact steps, or "raised") in the intake note.
- [ ] Create the folder and write the kickoff (story) or intake note (standalone item).
- [ ] Optional: `superpowers:brainstorming` → `phase-0-brainstorm.md`.
- [ ] Requirement justification per criterion (above). Flags plus recommendations, no silent cuts.
- [ ] If the spec looks stale or contradictory, note it now; raise it in Phase 4.
- [ ] Phase status initialised (Phase 0 done, others pending).
- [ ] **CHECKPOINT GATE: stop for the human.** Present the kickoff or intake, the diagnosis and scope, and every flagged criterion with your recommendation. Wait for the human to confirm the understanding and that each criterion is justified. If the human is away, hold. Do not self-approve.
- [ ] Hand off to Phase 1 only after that confirmation.
