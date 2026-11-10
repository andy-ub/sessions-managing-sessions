# Three rules

These rules hold the pattern together. The layers they refer to are in [topology.md](topology.md).

None of them is enforced by the host. They hold because each session's prompt or handoff says so, and because you or the Board Leader remind a session that forgets.

## Rule 1: Only your own words are a go

A go is your own words, in the session that will act on them. Everything else is information:

- a lane's "done",
- a reviewer's "looks fine",
- an OK from the layer above (the Orchestrator's OK on a Board Leader plan is an opinion),
- a status report, including one made with [/lgtm](../../skills/lgtm/SKILL.md), which records state and approves nothing,
- an automated event or another session's message.

What this means in practice:

- A lane stops at agreed points (a `GATE`, see [tags-and-titles.md](tags-and-titles.md)) and waits for you.
- Actions that leave your machine or change shared state are confirm-first: tracker writes, push, opening or merging a PR, deleting branches, outward comments, releasing a resource. A session lists them as `awaiting the human's go: …` and waits.
- The Board Leader may relay your go to a lane, but only as your quoted words that name the action. A summary ("the human is fine with it") is not a go.

Lesson (the details were not recorded): a lane's status report once almost read as permission for its next step. The guard now in use: every report starts with `STATUS (/lgtm, not a go):`, and a session writes "session state recorded", never "approved".

## Rule 2: One lane = one parent item

A lane holds one parent work item, with:

- all of that item's child tasks,
- one PR per supported version of the product (for example one per maintained release branch),
- its own cloud check after deploy.

An item that depends on another gets its own lane, with "depends on #N" in its handoff. Stacked PRs are not a reason to put two items in one lane.

The one exception is a grouped verify lane (several items checked together, for example because they wait for the same deploy). Start one only with a stated reason, written in its handoff and repeated to you. Its results go back to each item's own lane.

Lesson: on one day, one lane carried three items and six PRs, and a verify lane checked two items together. At the approval gate it was not possible to tell which comment and which screenshot belonged to which item. The lanes were split the same day, and the rule dates from then.

## Rule 3: Shared resources have one owner

The Board Leader (or the Orchestrator, in the two-layer form) owns every resource that lanes share, and decides when two lanes want the same one. The Orchestrator may advise.

| Kind | What | Example |
|---|---|---|
| Capacity | a finite amount everyone uses | RAM |
| Exclusive | one holder at a time | the shared test browser with one cloud login, local site ports, each database clone |
| Budget | a shared quota | tokens: idle polling can spend them ([cost.md](cost.md)) |

How it works:

- A lane claims an exclusive resource with a `CLAIM` line in the shared status file and releases it with a `RELEASE` line ([status-files.md](status-files.md)). If another lane holds it, the lane tags itself `WAIT` and the Board Leader decides the order.
- A timing-sensitive step (for example a performance measurement) runs alone on the database server.
- The Board Leader opens a new lane only with enough free RAM. The thresholds used on one machine (Windows 11, 32 GB RAM): at least 8 GB free to open a lane; at 80–85 % used, no new lane; at 88 % or more, tell the human and hold heavy steps. These are working settings, not measured limits.
- RAM per lane and the lane ceiling on one 32 GB machine were measured on single days: see [solo-vs-team-lanes.md](../solo-vs-team-lanes.md#ram-per-lane). They are single samples, not a capacity test.

Lesson: there was one test browser, and every lane needed a cloud check. To avoid logging in several times, two items were verified in one lane. At the gate the evidence was mixed up, so rule 2 was broken too. A resource conflict pushed us into a bad batching decision. Now each lane verifies its own item, the Board Leader queues the browser, and batching needs a stated reason.

Still hard:

- Queuing means waiting. The cloud check became the bottleneck.
- A claim is a convention, not a lock. A session that forgets can still close another lane's browser tab.
- A shared cloud login is risky: repeated failed logins from several sessions can lock the account.

### Merging is shared too

Shared status helps lanes see each other early. It does not make a merge safe. Observation: two lanes each had a green PR; after both merged, the shared dev branch was red, because neither lane knew what the other had changed. The merge rules stay:

- Re-run CI on the current base before merging.
- One merge per target branch at a time.
