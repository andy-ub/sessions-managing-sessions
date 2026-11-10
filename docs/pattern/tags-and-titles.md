# Tags and session titles

The session title is the status. You read the session list, not the transcripts. The layers are in [topology.md](topology.md); the machine-readable copy of the same state is in [status-files.md](status-files.md).

## Stop tags

A tag answers one question: **who has to act next?**

| Tag | Meaning | Who acts |
|---|---|---|
| (none) | the lane is working | nobody: leave it alone |
| `CHECK` | the lane needs your answer or decision, or CI or tests are red (for example after a base merge) | you; on red, the lane fixes it too |
| `GATE` | the lane stopped at an agreed approval point (for example before a tracker write or a push) | you |
| `CLOUD` | merged and deployed; the change needs checking on the cloud test environment | you, with the lane |
| `WAIT` | waiting on other people or machines: CI, the reviewer, a deploy, the PM, RAM, a resource another lane holds | others |
| `DONE` | merged and closed out | nobody: archive it |

**You only open lanes tagged `CHECK`, `GATE` or `CLOUD`.** Everything else is working or waiting on someone else.

When a lane sets `CHECK`, `GATE` or `CLOUD`, it also sends one line to its parent: its title and what it needs ([topology.md](topology.md#who-talks-to-whom)). The Board Leader relays it to you in one line. A `GATE` is where [rule 1](rules.md#rule-1-only-your-own-words-are-a-go) applies: the lane waits for your words.

No staging or cloud test environment? Skip the `CLOUD` tag: a lane goes from merged straight to its close-out.

## Lane stop table

When an item runs as a lane, this table replaces the per-phase human gates of the [dev flow](../../skills/dev-flow/SKILL.md). The lane stops, sets the tag and sends one line to its parent **only** here; everything else runs without asking.

| Stop | Tag | You do |
|---|---|---|
| Phase 2: the planned UI check has no real path to exercise (not blocking: the lane carries on with Phases 3–9) | `CHECK` | give the path, or agree to skip the UI check with a reason |
| Phase 9: the review-round limit is reached and a blocking finding is still open | `CHECK` | decide |
| Phase 10 done (items with a UI check): evidence captured, the tracker comment drafted | `GATE` | check the evidence; approve the tracker write |
| Phase 11: committed locally; one stop with the commit message, the push command and the decisions the lane took on its own | `GATE` | push (or say go); overturn any decision |
| PR open, CI green, reviewer requested | `WAIT` | nothing until the reviewer answers |
| Merged and deployed (if you have a cloud test environment) | `CLOUD` | check it with the lane |
| Phase 12: each tracker state change, each branch deletion, each lesson moved into a shared file | `GATE` | approve each one |
| Real blocker: red build the lane cannot fix, RAM over the limit, scope or acceptance criteria change, a missing dependency, a tool failure | `CHECK` or `WAIT` | unblock |

Without a stop here, the lane does not ask: it picks its recommended option on technical forks, logs the choice in its implementation notes and lists it at the Phase 11 stop, where you can overturn it.

A lane waiting on review, merge or deploy may be archived. The Board Leader unarchives it when the merge or deploy lands and sends one message: "merged/deployed, run the cloud check".

## Title format

```
<TAG> · <ID> <short name> · P<phase> · PR <a>/<b>
```

- **Tag first**, because the session list cuts long titles.
- **At most one tag.** No tag means "working".
- **Leave out parts that do not exist yet.** A new lane is just `<ID> <short name>`.
- **`<ID>`** is the parent item's id in your tracker. **`P<phase>`** is the step of your dev flow ([dev-flow skill](../../skills/dev-flow/SKILL.md)).
- **PR slots**: one per supported version, in a fixed order. A slot is a PR number, or `-` for a PR not opened yet.
- **No free text.** Dates and notes go in the lane's status file (`need` or `now`, see [status-files.md](status-files.md)), never in the title.
- **Grouped verify lane** (the exception in [rule 2](rules.md#rule-2-one-lane--one-parent-item)): the first item's id is the lane id, the others go in the name.

Examples (fake ids):

```
1234 export fix
CHECK · 1234 export fix · P5 · PR 1201/-
GATE · 1234 export fix · P11 · PR 1201/1202
WAIT · 1235 date filter · P11 · PR 1203/1204
1236 verify +1237 · P10 · PR -/-
```

Update the title whenever the phase, a PR number or the tag changes.

## Works without any UI

Everything above is plain text in session titles. Any client that lists sessions by title shows it. Sort or scan for `CHECK`, `GATE` and `CLOUD` and you know where to look next.

Two lessons from running it:

- **Stale tags were the most common friction** (observation from the first trial days). A lane mid-turn still showed `GATE` from an earlier stop. Have lanes retitle in the same step as they change state, and treat a tag older than the lane's last turn with suspicion.
- **Keep the set small.** An earlier set had six tags, with separate "help", "red CI" and "in review" tags. They were merged: `CHECK` covers help and red CI, `WAIT` covers review. `CLOUD` was added so after-deploy checks have their own tag.
