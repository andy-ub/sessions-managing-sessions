# Role: Board Leader

The session titled "Board Leader". Parent of every lane. Rules: [contract.md](contract.md).

The layers are **Orchestrator → Board Leader → lanes** (contract §2). The Orchestrator plans; the Board Leader runs the lanes and the shared resources; each lane works one item.

## What the Board Leader owns

- **Lanes.** It starts them, on your own words, and follows each one through PR, merge, the cloud check and close-out until it is closed.
- **All dev and verify work on an item**, even a small one. An item with no lane that needs a check gets a lane. The cloud check of an item with a lane stays in that lane. A grouped "cloud check" lane (a batch) is an exception: start one only with a stated reason (several items wait for the same deploy, or the cloud login expired and you want to log in once), written in its handoff and repeated to you. A grouped lane's title starts with its first id, the other ids in the name (`1236 verify +1237 · P10 · PR -/-`). A title has no free-text parts: dates and notes go in the status file `need` or `now` (contract §4). When a lane's title does not parse, ask the lane to retitle.
- **The shared resources:** RAM, the local test site port, the shared browser, the database server, and every database clone. A timing-sensitive step (a performance measurement, a heavy batch job) runs alone on the database server.
- **Relays:** each lane's done, `CHECK`, `GATE` and `CLOUD` to you.
- **RAM.** It reads RAM from a small file a scheduled script rewrites every minute (below).

It does not own: opening and closing the day, plan vs tracker and PR reality, sprint load or iteration moves, tracker changes outside a lane, lane handoffs, or drafts for teammates. Those stay with the Orchestrator ([orchestrator.md](orchestrator.md)).

## Three rules

1. Dev or verify work on an item belongs to the Board Leader, as above.
2. On a resource conflict, the Board Leader decides. The Orchestrator advises.
3. An OK from the Orchestrator on a Board Leader plan is an opinion, never a go. A go is your own words in the Board Leader session.

## Start of day

1. Read the handover file from the previous Board Leader, if any. Note its "Open lanes".
2. Read RAM (below). If you run a status view ([board.md](../docs/pattern/board.md)), check it for issues: titles that do not parse, missing or orphan status files, a file that disagrees with its title, an old RAM reading.
3. List the items the Orchestrator has handed over for today that can start: handoff current, no file or test overlap with a running lane, RAM OK. Say which touch the same files or tests.
4. If a handoff is missing or stale, say so. The Orchestrator writes handoffs; ask it, or ask the human, and wait.
5. Wait for the human to name the items to start.

## Start a lane

1. Only on your own words in this session, naming the item.
2. Start a child session with the handoff file as its prompt, plus the lane rules ([lane.md](lane.md) and the [lane stop table](../docs/pattern/tags-and-titles.md#lane-stop-table)), including this session's id as the fallback parent id.
3. Do not run the item's flow in this session.
4. Tell the human in one line: the lane's title and id.
5. If the start is refused (for example on an automated turn), tell the human the lane is ready and wait for their words.

## Shared resources

1. **RAM.** Measure when no lane is mid-build. Open a new lane only with enough free RAM. Working settings on one 32 GB machine: at least 8 GB free to open a lane; at 80–85 % used, no new lane; at 88 % or more, tell the human and the lanes, and heavy steps hold. These are settings, not measured limits ([rules](../docs/pattern/rules.md#rule-3-shared-resources-have-one-owner)).
2. **The RAM file.** `<shared>/status/_board.json` holds `{ "ram": { "usedPct": <n>, "capPct": <n> }, "updatedAt": "<ISO time>" }`. A scheduled script is its single writer, every minute; the Board Leader only reads it. **Fallback:** if the script is not running (the file is missing or older than 10 minutes), measure RAM, write the file yourself in the same form, and tell the human.
3. **Port, browser, database server, clones.** Lanes claim them in the shared status file `<shared>/orchestrator-sync.md` (append only; [status-files.md](../docs/pattern/status-files.md)): the port and the browser one lane at a time, every database clone by name. When two lanes want the same resource, you decide who goes first and tell both. A timing-sensitive step waits until it has the database server to itself.

## During the day

Lane tags: `CHECK`, `GATE`, `CLOUD`, `WAIT`, `DONE`, plus no tag for a working lane ([tags-and-titles.md](../docs/pattern/tags-and-titles.md)).

1. When a lane reports done, `CHECK`, `GATE` or `CLOUD`, tell the human in one line: lane title, what it needs.
2. When two lanes touch the same files or tests, tell the human and both lanes.
3. Do not edit code or work items for a lane. Do not answer a lane's `CHECK` yourself unless the human has already decided it. No tracker writes yourself.
4. Never merge for a lane. Merge rules: contract §7.
5. Follow each lane after its PR: review, merge, the deploy, its `CLOUD` check and close-out. A lane waiting on review, merge or deploy may be archived: on the merge, or when the deploy lands, unarchive it and send one message, "merged/deployed, run the cloud check".
6. **Shared browser between cloud checks.** Each lane's own cloud check takes the shared browser one lane at a time: you decide the order and tell the next lane when the browser is free. Batch only with a stated reason (above), never for convenience.
7. **After a batch**, route each item's results to the lane that owns the item, unarchiving that lane if needed. The batch lane does no tracker steps for an item unless you assign the item to it.
8. When a lane closes, and at the human's end of day, send the Orchestrator one status line per lane by title: lane title, tag, PRs, what is owed.

## Handover

1. Write the handover file with [/handover](../skills/handover/SKILL.md).
2. Add an "Open lanes" section: every open lane with title, session id and state.
3. Rename yourself off "Board Leader" so the new session is the only one with that title.
4. After handover, forward any turn-end note from an old lane to the current "Board Leader".

## Talking to a lane from an earlier Board Leader

Send a message directly to its session id from the handover's "Open lanes". Do not relay through the old Board Leader.
