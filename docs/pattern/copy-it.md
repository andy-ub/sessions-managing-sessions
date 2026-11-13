# Copy it yourself

You need plain Claude Code sessions, a shared folder and a few conventions. No custom tooling.

## Three steps

1. **One coordinating session, and one session per item.** The coordinating session plans and writes a handoff per item. Each piece of work (one parent item) gets its own session, in its own git worktree. See [topology.md](topology.md), two-layer form.
2. **Put the state in the session title, plus one shared status file.** The title follows `TAG · ID name · phase · PR` ([tags-and-titles.md](tags-and-titles.md)). The status file is append-only, and every line has a clock time and a session name ([status-files.md](status-files.md)).
3. **Status is status.** Approvals come only from you, in words. A session's "done", a reviewer's "looks fine" and the coordinating session's OK are information ([rule 1](rules.md#rule-1-only-your-own-words-are-a-go)).

## What to add next

Add each piece when you feel the problem it solves, not before.

| Add | When | See |
|---|---|---|
| **Board Leader layer** | the coordinating session's transcript grows with every lane turn, or lanes start fighting over the browser, ports, database or RAM | [topology.md](topology.md), [rule 3](rules.md#rule-3-shared-resources-have-one-owner) |
| **Stop tags** | you have more lanes than you can check by reading each one | [tags-and-titles.md](tags-and-titles.md) |
| **One lane per parent item** | evidence or comments for two items get mixed up at a gate | [rule 2](rules.md#rule-2-one-lane--one-parent-item) |
| **Day rhythm** | you lose track of where a lane stood yesterday | below |
| **A dev flow per lane** | lanes stop at different points, or not at all | [dev-flow skill](../../skills/dev-flow/SKILL.md) |
| **Idle-cost check** | you run plugins with hooks and leave sessions open overnight | [cost.md](cost.md#the-idle-hook-lesson) |

### Day rhythm

```
/office-start → /handoff (one per item, starts a lane) → lanes report with /lgtm → /office-end
```

- **[/office-start](../../skills/office-start/SKILL.md):** the Orchestrator builds the plan from yesterday's day file, the tracker, open PRs and (optionally) your calendar.
- **[/handoff](../../skills/handoff/SKILL.md):** the Orchestrator writes a handoff file for an item. The Board Leader starts a fresh session on it, on your words.
- **[/lgtm](../../skills/lgtm/SKILL.md):** a lane appends its state to the day file and reports to its parent. It approves nothing.
- **[/office-end](../../skills/office-end/SKILL.md):** the Orchestrator closes the day from every lane's block. The day file is append-only and becomes tomorrow's starting point ([status-files.md](status-files.md#day-file)).
- **[/handover](../../skills/handover/SKILL.md):** when the Orchestrator's or the Board Leader's transcript gets long, a fresh session takes the role under the same title.

Each session's instructions: [roles/](../../roles/contract.md).

## Questions

| Question | Answer |
|---|---|
| Do lanes collide in git? | Each lane works in its own git worktree. Lanes write a `note` line to the shared status file when they change shared code or tests, and read it before merging. Merge rules still apply: re-run CI on the current base, one merge per target branch at a time ([rules.md](rules.md#merging-is-shared-too)). |
| What about local databases? | Each lane claims its own database clone by name with a `CLAIM` line and releases it after. The database server itself is shared: a timing-sensitive step claims it and runs alone ([status-files.md](status-files.md#lane-lines-claim-release-note)). |
| What if a lane does something wrong? | Lanes stop at agreed gates. Tracker writes, push, PRs, merges and outward comments are confirm-first. Only your own words count as a go ([rule 1](rules.md#rule-1-only-your-own-words-are-a-go)). |
| How much does it cost? | Coordination was about 19 % of all tokens over two weeks, for one developer. The trap is idle polling through plugin hooks ([cost.md](cost.md)). |
| How long does setup take? | The full setup was built step by step over about a month. A minimal version (title convention, one shared status file, one coordinating session) should take about a day to copy; that is an estimate, not a measurement. |
