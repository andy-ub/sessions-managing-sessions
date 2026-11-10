# Ad-hoc — Receiving review feedback

## Step identifier

`adhoc-receiving-code-review`: whenever review feedback arrives and needs processing before any fix.

## Triggers

- A Phase 9 round returns findings. **Ordering rule:** in `human` mode with a pasted result, first write the findings verbatim to `phase-9-ext-findings-r{N}.md` (Phase 9 Gate 2); the triage file below comes afterwards and never replaces it.
- Comments on the PR from the reviewer, the PM or anyone else.
- Block findings from the Phase 7 panel.
- Feedback on the approach in a message thread.

## What this step does

Process feedback with technical rigour. Verify every finding against the current code; the reviewer may have a stale view or be wrong. Push back with evidence when a finding is technically incorrect. Triage, then fix.

## Skill

`superpowers:receiving-code-review`, mandatory. It enforces: verify each claim, no performative agreement, push back when questionable, no blind implementation.

## Notes

- Severity:
  - **Block**: fix before merge.
  - **Major**: should fix; push back if the reviewer is wrong.
  - **Minor**: fix if quick, defer if not blocking.
  - **Nit**: fix if trivial, otherwise note and move on.
- Applied fixes → `implementation-notes.html` §2; deferrals and pushbacks → §4.
- Pushback cites evidence: the code line, the runtime behaviour, a precedent.
- **Replies on a PR thread are drafted by the agent and posted by the human.** Neutral wording; do not name the external review tool, even if it caught the same issue first.
- Read `recurring-lessons.md` `false-positives` first, so a settled non-issue is not re-litigated.

## Output

**A. PR review comments: capture first, before triage.** One file per PR in the item folder: `pr-{number}-review-findings.md`. Append a dated `## Round N, {DD-MM-YYYY}` section per review round; never overwrite. For each finding: verdict (approved / changes requested / comment), the **verbatim** quote, `file:line`, the comment URL, a short interpretation, the concrete action (or "no action").

**B. Other feedback** (a Phase 9 round, the panel, a message thread): `phase-receiving-review-{trigger}-{date}.md`.

Both hold: the source, the findings verbatim, per-finding triage (verified against code, pushback reason, fix summary), counts (applied / pushed back / deferred).

`implementation-notes.html` §7, **one line per finding**: `[severity] <finding> -> <accept | reject | discuss> - <reason>`. Reject-with-reason lines seed `false-positives` at Phase 12.

## Checklist

- [ ] `superpowers:receiving-code-review` invoked.
- [ ] Feedback read in full, verbatim.
- [ ] PR comments captured to `pr-{number}-review-findings.md` first.
- [ ] Each finding verified against the current code.
- [ ] Severity triaged; pushback candidates identified with evidence.
- [ ] The accept / reject / discuss calls shown to the human before fixing.
- [ ] Fixes applied; tests re-run.
- [ ] Triage file saved; §7 updated one line per finding.
- [ ] Phase 9 finding → prepare the next round's prompt with the remediation note.
- [ ] PR comment → reply drafted for the human to post.
