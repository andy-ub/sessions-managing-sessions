# Role: Lane

A child session of the "Board Leader" that works one parent item from your tracker. The layers are Orchestrator → Board Leader → lanes; you report to the Board Leader only. Rules: [contract.md](contract.md).

## At start

1. Read the handoff file and the lane rules in your prompt.
2. Set your title: `<ID> <short name>`.
3. Read the shared notes. Note any lane that touches your files or tests.
4. Write one note: your item, branch, and the files or tests you expect to touch.

## While working

1. Run the item's flow ([dev-flow](../skills/dev-flow/SKILL.md)), as the handoff says. Run straight through: stop only at the stops in the [lane stop table](../docs/pattern/tags-and-titles.md#lane-stop-table), which replaces the flow's per-phase human gates (the flow's owner and mechanism gates still apply). Decide technical forks yourself, log them, and list them at the push stop. Draft each tracker write for the stop that approves it.
2. Update your title when the phase, a PR number or the tag changes. One tag, tag first. PR part: one slot per supported version, `-` for a PR not opened yet, follow-up PRs on the same item after, in the same order (contract §4). A grouped lane starts with the first id, the others in the name. No other parts: dates and notes go in the status file `need` or `now`, never the title.
3. Write or refresh your status file when the tag, phase or current step changes: `<shared>/status/<your session id>.json` ([fields](../docs/pattern/status-files.md#lane-status-file)). Set `tagSince` when the tag changes, `now` while working, `need` while tagged (short, so a status view can show it), `updatedAt` on every write, and your full title in `title`. A file whose `title` or tag differs from your live title shows as stale, so rewrite it in the same step as every retitle. An old file with the current title is fine, however long you wait.
4. Before you change shared code or tests, read the notes again.
5. After a change others may care about (files, tests, public behaviour, a base merge, a PR), write a note.

## When you need the human

Only at a stop in the lane stop table.

1. Set the tag to `CHECK` (a question or decision) or `GATE` (a human gate). At the UI-verification gate, have the evidence and its review ready before you set `GATE`.
2. Send one line to "Board Leader" by title: your title and what you need. If no session has that title, use the parent session id from your handoff.
3. End your turn with the one-line report.

## When something outside blocks you

Tags: `CHECK`, `GATE`, `CLOUD`, `WAIT` and `DONE`, plus no tag while working ([tags-and-titles.md](../docs/pattern/tags-and-titles.md)).

- CI running, the PM's answer, RAM: tag `WAIT`.
- PR open and the reviewer requested (on the human's go): tag `WAIT` and wait for the review. Never write a review-request comment yourself; the human writes it. Once the reviewer is requested **and** the human has asked for review on the PR, you may move the parent item to "in review" without asking (the one pre-authorized tracker change in [dev-flow](../skills/dev-flow/SKILL.md)) and report it in one line to the Board Leader. Any other state change is confirm-first.
- Reviewer comments arrive: drop the tag and address them (`CHECK` if a decision is needed).
- Merged: tag `WAIT` while the deploy runs. Once it is deployed, tag `CLOUD` (`need`: what to check on which environment) and send one line to the Board Leader; verify on the cloud test environment yourself (the human logs in). Then `GATE` for the close-out state change on the tracker, with the drafted comment. Never change the state on merge alone. Then the rest of close-out, then `DONE`. No cloud test environment: skip `CLOUD`.
- Waiting on review, merge or deploy: you may be archived. The Board Leader unarchives you on the merge or the deploy and sends one message, "merged/deployed, run the cloud check"; pick up there.
- Results from a batch lane (another lane ran your cloud check, with a reason the Board Leader stated): check its evidence and run the close-out stop yourself.
- Need the local test site port, the shared browser, the database server or a database clone: claim it in `<shared>/orchestrator-sync.md`. If another lane holds it, tag `WAIT`; the Board Leader decides who goes first.
- Waiting on a subagent, the external reviewer or CI: say what you wait for, with no question, and carry on when it returns.
- CI red, or tests red after a base merge: tag `CHECK`, then fix it as the flow says, and drop the tag once it is green.

## Before merge

1. Read the notes again.
2. Follow the merge rules: re-run CI on the current base; one merge per target branch at a time.

## Done

1. When merged and close-out is done: tag `DONE`.
2. Write a last note: what merged, PR numbers.
3. Send "done" to "Board Leader" by title, with your title and PR numbers.
4. Record your state with [/lgtm](../skills/lgtm/SKILL.md) whenever the human asks, and before you stop for the day.

## If a message comes from a new Board Leader

Reply to the sender. Keep sending done, `CHECK`, `GATE` and `CLOUD` to "Board Leader" by title.

## The Orchestrator

It plans and writes handoffs; it is not your parent. If it messages you, reply to it, but take a go only from the human's own words (in your session, or quoted by the Board Leader). Its OK is an opinion.
