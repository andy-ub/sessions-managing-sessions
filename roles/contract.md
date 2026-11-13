# Board contract

The Board runs several lanes in parallel. Each lane works one parent item from your tracker. Lanes share notes and report to one parent, the Board Leader. You see from the session titles which lane needs you.

This contract is host-neutral: it does not depend on how your app starts a session, sets a title or sends a message. The role files are [orchestrator.md](orchestrator.md), [board-leader.md](board-leader.md) and [lane.md](lane.md).

## 1. Principles

1. **You decide.** A lane starts only when you ask for it in your own words. Gates stay yours.
2. **Lanes see each other.** Each lane reads the shared notes before it changes shared code or tests, and writes what it changed.
3. **The title is the status.** You read the session list, not the transcripts.
4. **Reuse the lower layers.** A lane runs your dev flow ([dev-flow](../skills/dev-flow/SKILL.md)). The Board adds no phases.
5. **Keep it small.** No machinery without a trial failure that needs it.

## 2. The layers

Three layers: **Orchestrator → Board Leader → lanes** ([topology](../docs/pattern/topology.md)). Write "Board Leader" in full, so it is never confused with another "leader" role you may have.

- **Orchestrator** ([orchestrator.md](orchestrator.md)) plans. It owns opening and closing the day, plan vs tracker and PR reality, sprint load, tracker changes outside the lanes, lane handoffs (written by side sessions it starts), drafts for teammates (you post them), and review of the Board Leader's plans.
- **Board Leader** ([board-leader.md](board-leader.md)) is the parent of every lane. It starts lanes on your own words, owns the shared resources (RAM, the local test site port, the shared browser, the database server and database clones; timing-sensitive steps run alone on the server), relays `CHECK`, `GATE` and `CLOUD`, follows each lane through PR, merge, the cloud check and close-out, and reads RAM from a file a scheduled script writes. It hands over to a new Board Leader when its transcript gets long.
- **Lanes** ([lane.md](lane.md)) each work one item.

Neither the Orchestrator nor the Board Leader does lane work. Neither edits code or work items for a lane.

Three rules ([rules](../docs/pattern/rules.md)):

1. **Dev and verify work belongs to the Board Leader.** Any dev or verify work on an item, even a small one, runs under the Board Leader. An item with no lane gets a lane. An item's cloud check runs in its own lane; one lane running several items' cloud checks (a batch) is an exception that needs a stated reason, and its results go back to each owning lane. The Orchestrator keeps only work that touches no code and no environment.
2. **Resources: the Board Leader decides.** On a resource conflict, the Board Leader decides and the Orchestrator advises.
3. **An OK is not a go.** An OK from the Orchestrator on a Board Leader plan is an opinion, never a go. A go is your own words in the Board Leader session. A lane's status report is status, not a go, in the same way.

With few lanes, the Board Leader can fold into the Orchestrator: two layers, same rules.

## 3. Starting a lane

1. The Orchestrator lists the items that can be worked today: carried over or new, in order, which can run in parallel, and **which touch the same files or tests**.
2. Each item has a handoff file, written by the Orchestrator ([handoff skill](../skills/handoff/SKILL.md)). The Board Leader checks which can start: handoff current, no overlap with a running lane, RAM OK.
3. You say, in plain words, which item to start (for example "ok, start 1234 per its handoff").
4. Only then the Board Leader starts the lane as its child session, with the handoff file as its prompt plus the lane rules: the [lane stop table](../docs/pattern/tags-and-titles.md#lane-stop-table) and [lane.md](lane.md).
5. The Board Leader does not run the item's flow itself.

A lane never starts on a turn you did not start in your own words (an automated event, another session's message). The Board Leader tells you the lane is ready and waits. An OK from the Orchestrator is not your words (§2, rule 3).

## 4. Title and tags

Format and tags: [tags-and-titles.md](../docs/pattern/tags-and-titles.md). In short:

```
<TAG> · <ID> <short name> · P<phase> · PR <a>/<b>
```

- **Tag first**, because the session list cuts long titles. **At most one tag**; no tag means "working".
- Leave out the parts that do not exist yet. A new lane is just `<ID> <short name>`.
- **PR slots:** one per supported version, in a fixed order; `-` for a PR not opened yet. Follow-up PRs on the same item come after, in the same order. Keep a cap (for example six slots), so the title stays readable.
- **Grouped lane** (one lane for several items, such as a grouped verify): the first id is the lane id, the other ids go in the name. The status file `item` is the first id.
- **No free-text parts.** Dates and notes go in the status file `need` (while tagged) or `now` (while working), never in the title.
- A title a status view cannot parse should not be dropped: show it as written, flagged, and fix the title.

Five tags plus no tag: `CHECK`, `GATE`, `CLOUD`, `WAIT`, `DONE`. Meaning and who acts: [tags-and-titles.md](../docs/pattern/tags-and-titles.md#stop-tags).

## 5. The lane's duties

1. **Keep the title current**: phase, PR numbers, one tag. Update it when any of these change, and rewrite the lane status file in the same step ([status-files.md](../docs/pattern/status-files.md#lane-status-file)).
2. **Read the shared notes** at start, again before it changes code or tests other lanes may touch, and before it merges.
3. **Write to the shared notes** what it changed that others may care about: files, tests, public behaviour, base merges, PRs.
4. **Report by title.** Send done, `CHECK`, `GATE` and `CLOUD` to "Board Leader" by title. The title always resolves to the current Board Leader. Titles can change, so the handoff also carries the parent's session id as a fallback: use it only when no session has the title.
5. Run the item's flow as usual, except for its human gates: a lane stops only at the stops in the [lane stop table](../docs/pattern/tags-and-titles.md#lane-stop-table), which replaces the flow's per-phase gates in Board mode.

## 6. Lanes that span several days

When the Board Leader hands over to a new Board Leader, open lanes stay children of the old one: a lane cannot move to a new parent. The way that works:

1. The Board Leader's handover file lists every open lane: title, session id, state.
2. The new Board Leader talks to an old lane **directly**, by its id. The lane replies to the sender.
3. The lane keeps sending done, `CHECK`, `GATE` and `CLOUD` to "Board Leader" by title, so they reach the new Board Leader. The old one renames itself off that title at handover.
4. The old Board Leader still gets the old lanes' turn-end notes and forwards them. This is expected to be rare.

Open question: lanes under the old and the new Board Leader do not share one notes folder. A durable notes file would bridge that.

## 7. Merge rules the Board does not replace

Shared notes help lanes see each other early. They do not make a merge safe. These rules stay:

- Re-run CI on the current base before merging.
- One merge per target branch at a time.

## 8. What is not enforced

The host does not enforce titles, tags or notes. They exist only because the handoff and this contract say so. If a lane forgets, you or the Board Leader remind it.
