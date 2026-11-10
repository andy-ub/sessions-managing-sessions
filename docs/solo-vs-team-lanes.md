# Solo lane or team lane?

A **lane** is one work item, run in its own Claude Code session (or sessions) beside other lanes.

- **Solo lane:** one session takes the item end to end: plan, build, review (through subagents and an external reviewer), verify, and stop at your gates.
- **Team lane:** a leader session you talk to, plus a fresh role session for each step (for example planner, builder, reviewer, verifier). Every role works on a frozen commit and leaves its result in files.

Machine for all numbers: Windows 11, 32 GB RAM (31.5 GB usable), October and November 2026. How lanes sit under a coordinating session: [pattern/topology.md](pattern/topology.md). Cost in more detail: [pattern/cost.md](pattern/cost.md).

## RAM per lane

| What | RAM | Date and how |
|---|---|---|
| Solo lane, idle (Claude desktop app session plus its share of MCP servers and plugins) | about 1-1.3 GB | 29-10-2026, measured with 3 lanes running |
| Solo lane, working with the local test site up | about 2-3 GB | same; build servers (about 1-1.3 GB) are shared by all lanes |
| One role session in a team lane | about 1.3 GB | 21-10-2026, one sample, a role session in a VS Code tab |
| Team lane, leader plus one live role, finished tabs closed | about 2-2.5 GB | estimate from the figure above, not measured as a whole |

Where the 1.3 GB of a role session goes (same sample): the Claude Code process about 325 MB. The rest is MCP servers and plugins that every session loads from user settings: browser automation about 200 MB (only the verifier needs it), a memory plugin about 130 MB (not needed), two other MCP servers about 420 MB (not needed), other plugins and shells about 250 MB (partly needed).

The trap in a team lane: a finished role's tab stays open, and its process and servers stay in memory. In one run, by the 7th hand-off the machine had 4.4 GB free of 31.5 GB. Closing six finished role tabs and one probe tab freed about 4 GB (8.4 GB free).

Capacity seen on 29-10-2026: 3 solo lanes plus a light browser was the ceiling. A 4th lane fit only by replacing a lane that was waiting. With finished tabs closed, two team lanes in parallel fit (observation, 21-10-2026).

## Coordination cost

**Solo lane.** One session, so no hand-offs. The cost is stops. In the first day of desktop lanes, each lane stopped 2-3 times to ask "continue?" before an explicit autonomy line ("stop only at the hard gates or a real issue") was added.

**Team lane.** Each step is a new session, and you start it (one click per role).
- A real bug, one run: about 1 h end to end, roles about 32 min, no fix loop.
- Another real bug: about 2 h 50 min, 8 hand-offs, one fix loop.
- A silent role went unnoticed for about 50 minutes. Fix: the leader nudges you after 20 minutes.
- Keeping each role's context clean is the hardest part. A memory plugin injected earlier roles' summaries into later roles; a resumed tab and the wrong editor window leaked too.
- Earlier, heavier versions added messaging, acknowledgements and custody checks. Those caused about 15 of about 20 stops and caught 0 defects. The value came from one thing: independent reviewers on a frozen commit.
- Independent roles can still be wrong together. In one run the verdict said the user saw a better error; the screenshots showed the same generic error before and after. The leader must put the key evidence in front of you before calling a run ready.

## When each fits

Use a **solo lane** when:
- the item is ordinary risk, and subagent review plus an external reviewer is enough;
- you want several items in parallel and RAM is the limit;
- you want the shortest wall time and the fewest clicks.

Use a **team lane** when:
- independent eyes matter more than speed: a risky change, a fix you cannot easily verify, or a test of the negative path (a planted bug the reviewer must catch);
- you can spare RAM for the leader plus one live role, and you close each finished role's tab;
- you are there to start each role and read the evidence.

## Rules that came out of it

- Start with solo lanes. Add team lanes once solo lanes run well.
- In a team lane, only the leader joins the coordinating session's lane list. Roles stay separate sessions. Nested sessions get a shared notes folder, which would become a role-to-role channel and break independence.
- Close a finished role's tab when the leader logs its result.
- Turn off MCP servers and plugins a role does not use (an idea; the saving is not yet measured).
- Notes between lanes do not replace merge rules: re-run CI on the current base before a merge, one merge per branch at a time.
