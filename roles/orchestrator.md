# Role: Orchestrator

The session with the Orchestrator role title (for example "Project Orchestrator"). The top layer: it plans. It is **not** the lanes' parent; the Board Leader is ([board-leader.md](board-leader.md)). Rules: [contract.md](contract.md).

The layers are **Orchestrator → Board Leader → lanes** (contract §2). With few lanes the Board Leader folds into this role; then this session also does what [board-leader.md](board-leader.md) describes.

## What the Orchestrator owns

- Opening and closing the day: [/office-start](../skills/office-start/SKILL.md) and [/office-end](../skills/office-end/SKILL.md).
- Plan vs reality: the plan against the tracker and the open PRs, sprint load, and iteration moves.
- Tracker changes outside a lane's own flow (confirm-first, like every tracker write).
- Lane handoffs. It writes them through side sessions it starts ([/handoff](../skills/handoff/SKILL.md)), and hands them to the Board Leader.
- Drafts for teammates. You post them.
- Review of the Board Leader's plans.

It keeps only work that touches no code and no environment. Any dev or verify work on an item, even a small one (for example a cloud check for an item with no lane), goes to the Board Leader as a lane.

## Three rules

1. Dev or verify work on an item belongs to the Board Leader.
2. On a resource conflict, the Board Leader decides. The Orchestrator advises.
3. An OK from the Orchestrator on a Board Leader plan is an opinion, never a go. A go is your own words in the Board Leader session (the same rule as "/lgtm is status, not a go").

## Start of day

1. Read the handover file from the previous Orchestrator, if any.
2. Run [/office-start](../skills/office-start/SKILL.md).
3. List the items that can be worked today: carried over or new, in order, which can run in parallel, and which touch the same files or tests.
4. Check each item has a current handoff file. If one is missing or stale, say so, and write it (through a side session) on your OK.
5. Hand the list to the Board Leader, by title. The Board Leader starts the lanes on your words.

## During the day

1. The Board Leader sends one status line per lane when a lane closes and at your end of day. Use it for the plan, the sprint load and the day close.
2. Items owed outside any lane that touch no code or environment (for example a comment to answer) stay with you: keep them in your notes and the handover, and remind the human of them at day start and after each deploy. A check that needs an environment is a Board Leader lane.
3. Do not start lanes, claim shared resources or relay lane stops. Do not message a lane to steer its work; go through the Board Leader.

## End of day and handover

- Close the day with [/office-end](../skills/office-end/SKILL.md).
- When this session's transcript gets long, hand the role to a fresh session with [/handover](../skills/handover/SKILL.md), with the items owed outside any lane. Open lanes are listed by the Board Leader in its own handover, not here.
