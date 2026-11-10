# Ad-hoc — Systematic debugging

## Step identifier

`adhoc-systematic-debugging`: whenever a bug, an unexpected test failure or odd behaviour appears mid-flow. Not a fixed phase. (For a bug item, Phase 2 is this skill.)

## Triggers

- A test fails for an unexpected reason during Phase 5 and does not resolve in about five minutes. (A test failing as intended in RED is TDD, not a trigger.)
- A defect found during Phase 10.
- Unexpected runtime behaviour in any phase.
- A Phase 9 finding that points at a real bug needing investigation.

## What this step does

Root cause first. No fix is proposed until the cause is confirmed, and no fix hides the symptom (swallowing an exception, loosening a threshold, retrying until green).

## Skill

`superpowers:systematic-debugging`, mandatory before proposing any fix.

## Notes

- **Reproduce before diagnosing, and treat "cannot reproduce" as a method artifact first.** Vary the method (the reporter's exact flow, a deeper or more specific poke, different timing or state) before concluding a symptom is unreproducible or escalating it. A shallow poke once produced a false negative that nearly caused a premature escalation.
- **Name the layer.** In UI verification a defect can sit in the feature, in the pipeline that feeds it, or in the client (an AI assistant, a browser cache). Establish which before changing code.
- **Check the environment before the code.** A missing setting can make background jobs skip silently. Example of a methodical trace: request sent → network tab shows the expected status → the expected data still missing → server log shows the export job skipped with a warning that no output folder is configured → the required export-path setting was absent → set it in the local settings → restart → verified.
- A root cause that reveals a reusable pattern (a config gap, a test-layer blind spot) is a candidate for project memory or `recurring-lessons.md` at Phase 12.

## Output

`phase-debug-{topic}-{date}.md` in the item folder: symptom, hypothesis tree, evidence, confirmed root cause, fix, verification.

`implementation-notes.html` §7: "Debug: {topic}. Root cause: {summary}. Fix: {summary}."

## Checklist

- [ ] `superpowers:systematic-debugging` invoked.
- [ ] Symptom reproduced (method varied before giving up).
- [ ] No fix proposed before the root cause is confirmed.
- [ ] Debug file written; §7 updated.
- [ ] Reusable pattern noted for Phase 12.
- [ ] Return to the interrupted phase.
