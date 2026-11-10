# Phase 4 — Resolve open questions

## Step identifier

`phase-4-resolve-oq`: resolve the open questions from Phases 2 and 3.5 before code. Phase 5 is blocked until they are resolved or explicitly deferred.

## Sequence

- **Runs after:** Phase 3 (and 3.5).
- **Hands to:** Phase 5.

## What this step does

**First classify every question:**

- **design-intent**: what the feature should do, owned by the reporter, designer or PM;
- **technical**: how to build it.

A design-intent question may **not** be deferred and may **not** be accepted as residual risk. Its resolution cites the owner's reply.

For technical questions, pick a path:

- self-resolve from code, project memory or a precedent item, with the reasoning recorded;
- ask the PM or lead (architectural, cross-team or product-semantics questions);
- defer to review time if low impact, with the reason.

## Notes

- **Do not edit the spec or the tracker text yourself**, even for an obvious defect. Flag it to the owner with a proposed fix and wait. If a spec file lives in the repository, the spec change lands in the same PR as the code.
- **Small reversible choices:** recommend and let the human approve. Escalate to the PM or lead only for architectural, cross-team or product-semantics decisions.
- **Questions to other people go through the human.** Draft the question, show it to the human, and let the human send it. Every question carries "my suggestion: X, because Y". Hold a question until a cheap test cannot answer it. Ask once; do not chase.
- **Design-intent is owner-resolved (hard gate).** A multi-agent panel is a legitimate way to explore options (give it the real artifact, a screenshot or the code, in a second round to ground it), but exploration is not resolution.
- Do not post the engineering approach as a tracker comment; it stays in the local kickoff and notes.

## Output

Updates to `implementation-notes.html` §4: each question tagged Resolved (or Deferred, technical only) with a bullet citing the source (code, memory entry, message thread). Drafted messages can be saved as `phase-4-question-draft-{date}.md`.

## Checklist

- [ ] Classify each Pending question: design-intent or technical.
- [ ] Self-resolve where possible; record the reasoning.
- [ ] Draft owner questions for the human, with a recommendation each.
- [ ] Defer only technical questions, with a reason.
- [ ] Design-intent questions resolved by the owner, not self-picked and not "decided by the panel".
- [ ] No Pending question blocks Phase 5 (or residual risk explicitly accepted, technical only).
- [ ] Hand off to Phase 5.
