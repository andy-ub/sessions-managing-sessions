# The journey: from a role team per item to three layers

How this way of working changed between September and November 2026, told in four milestones. For each one: what it was, why it changed, and what I dropped. The ideas I rejected on the way are at the end.

Machine for every number: Windows 11, 32 GB RAM (31.5 GB usable), Claude desktop app, one developer. A number without a date and a source is a recollection, and it says so.

## 1. The role-team model (September to early October 2026)

**What it was.** One work item was handled by a team of sessions: a lead session I talked to, plus six role sessions (planner, plan reviewer, builder, internal reviewer, external reviewer, auditor). Each role ran in its own background session. A state-helper script moved the item between phases. It had a lot of proof machinery around the roles: acknowledgements with freshness windows, hashes of the reviewed tree, a launch registry, a check that each edit really came from the role that claimed it, a version pin on the CLI, and receipts for every gate.

**How it went.** I built it in slices through September, then ran two pilots on real bugs.

- Pilot 1 (02-10-2026 to 06-10-2026). It delivered a ready PR. The story work itself took about 1.5 h. The delivering run took about 11.3 h of wall clock, after a hold of about 2.6 days for fixes to the tooling. 14 things broke; none of them was a safety problem, and every stop failed closed. I counted about 108 helper commands for 6 role turns: about 18 commands per story turn (from the lead's command log, approximate). I was pulled in 9 times: 5 by design, 4 because something broke.
- Pilot 2 (08-10-2026 to 10-10-2026), a replay of an already-fixed bug. It took six runs. Runs 1 to 5 broke on the environment: an untrusted folder, a CLI auto-update that hid background sessions, the PC going to sleep mid-turn. Run 6 passed every gate, including the auditor. It used about 125 helper commands, about 13 per role hand-off (approximate, same method). I was pulled in 10 times: 4 by design, 6 unplanned.
- Cost. Around 28-09-2026 the quota meter showed 25 % of the weekly quota gone on the first day of the week, after long builder and coordinator sessions. From then on, a second model (the one I also use as external reviewer) did most build work, and Claude did review and the checks only Claude Code could run.

**Why it changed.** Across both pilots, I counted that the proof machinery caught 0 product defects, while messaging and custody caused about 15 of about 20 stops. The value came from one thing: independent reviewers looking at a frozen commit.

**What I dropped.** Acknowledgements, tree-hash binding, the launch registry, the authorship replay, the version-pin probe, the receipts, and live messaging between roles. I froze the old version as a reference and did not run it again.

## 2. The YAGNI pivot (10-10-2026 to about 22-10-2026)

**What it was.** I rebuilt the role team with only what the pilots had shown to be useful:

- a lead session I talk to, because every stop that needed me needed judgment, which a script cannot give;
- five roles (planner, reviewer with a plan mode and a code mode, builder, external reviewer, auditor), each a fresh session per hand-off;
- a frozen commit as the target of every review;
- a file as the evidence: the message is only a pointer, and a failed ping goes to me;
- the fail-closed rule: a role that is unsure parks and asks.

Every new piece of machinery had to come from a real failure in a run. The silent-role nudge (the lead asks me to check a role after 20 minutes of silence) came from one.

**How it went.** Three runs passed:

- Run 1 (19-10-2026 to 20-10-2026), a synthetic task with a planted bug. The reviewer caught the bug; there was no false pass. A memory plugin injected earlier roles' summaries into later roles, so I excluded the run folders from it. A role sat silent for about 50 minutes before anyone noticed.
- Run 2 (20-10-2026), a real bug: ready in about 1 h, roles about 32 min of it, no fix loop.
- Run 3 (21-10-2026), a real bug: about 2 h 50 min, 8 hand-offs, one fix loop. The verdict said the user now saw a better error. I opened the screenshots: before and after showed the same generic error. Since then the lead puts the key evidence in front of me before calling a run ready.

**Why it changed.** RAM. One role session used about 1.3 GB (measured 21-10-2026, one sample on one role tab). About 325 MB of that was Claude Code itself; the rest was MCP servers and plugins every session loads from user settings, most of which a role never uses. Finished role tabs stayed open. By the 7th hand-off of run 3, the machine had 4.4 GB free; closing six finished role tabs and one probe tab freed about 4 GB (same day). With a project-level light profile that turns off unused servers, a role session measured 0.6 to 0.8 GB (22-10-2026 to 23-10-2026).

A note on the "about 3 lanes" ceiling: it was measured later, on 29-10-2026, with solo lanes (milestone 3), not with team lanes. For team lanes I only have the run-3 figure above and an observation from 21-10-2026 that two team lanes fit once finished tabs are closed.

**What I dropped.** Nested desktop sessions as roles (see the rejected ideas), replaying a shipped bug as a test run (too much work to keep the shipped fix from leaking into the roles), and the idea that the role team is the default. Details and the full comparison: [solo-vs-team-lanes.md](solo-vs-team-lanes.md).

## 3. Solo lanes (from 21-10-2026)

**What it was.** One session takes one item end to end: plan, build, review, verify, and stop at my gates. Review happens through subagents inside the session (internal review) and the external reviewer (a second model). From 21-10-2026 the dev flow asks at its first phase whether an item runs solo or as a team. On 27-10-2026 solo became the default lane.

**Why it changed.** Three reasons, in order of weight:

- RAM: one session per item instead of a lead plus a live role, plus the finished tabs.
- Clicks: in the role team, I started every role by hand, one click per role.
- Speed for ordinary risk: subagent review plus the external reviewer was enough for most items. The role team stays for risky changes or fixes I cannot easily check.

**What I learned on the first day.** On 29-10-2026, before I added an explicit autonomy line ("stop only at the hard gates or a real issue"), three solo lanes stopped 3, 2 and 3 times to ask "continue?". Each idle solo lane used about 1 to 1.3 GB with its share of servers and plugins. 3 solo lanes plus a light browser was the ceiling; a 4th lane fit only by replacing a lane that was waiting (same day, from the RAM readings in the trial log).

**What I dropped.** Lanes as chat tabs in the editor. Lanes became desktop sessions, so the coordinating session can start them and see their titles. The code can still be opened in the editor.

## 4. The three-layer Board (27-10-2026 to 05-11-2026)

**What it was.** Orchestrator → Board Leader → lanes. The Orchestrator plans the day and writes handoffs. The Board Leader starts lanes on my own words, owns the shared resources and follows each lane to the end. Each lane holds one parent item. Full description: [pattern/topology.md](pattern/topology.md). The rules: [pattern/rules.md](pattern/rules.md).

**Why it started (27-10-2026).** Two of my lanes each had a green PR. After both merged, the shared dev branch was red: neither lane knew what the other had changed. I was also renaming sessions by hand to remember which PR was where (recollection, not measured). The first answer was a two-layer form: lanes as child sessions of the existing Orchestrator, with the lane's status in its title.

**The trial (29-10-2026).** Three lanes ran as children of a trial coordinator. Stale title tags were the top friction: a tag was set at a gate and never cleared. The coordinator's transcript reached about 4.9 MB in one day, with one compaction.

**Why the middle layer was split out (04-11-2026, named 05-11-2026).** The Orchestrator's transcript grew with every lane turn (observation, not measured), and two sessions with "Orchestrator" in their titles but different jobs confused people. The Board Leader took the lanes and the resources; the Orchestrator kept planning.

**What I dropped.** The Orchestrator as the lanes' direct parent (it is still fine with few lanes), the status pane, polling through tool calls (see [pattern/cost.md](pattern/cost.md#the-idle-hook-lesson)), and grouping several items in one lane by default ([rule 2](pattern/rules.md#rule-2-one-lane--one-parent-item)).

**One observation that confirmed rule 1.** On 06-11-2026 the host's auto-mode safety check in the Board Leader refused to forward a merge go that the Orchestrator had relayed, even with my exact words quoted. Since then, a merge or push go is typed by me in the session that acts.

**Where it stands.** Coordination was about 19 % of all tokens over two weeks ([pattern/cost.md](pattern/cost.md)). My approvals rose every week while approvals per item fell ([pattern/results.md](pattern/results.md#the-human-is-the-bottleneck)). I am the bottleneck now, and that is the next problem.

## Rejected ideas

| Idea | Why I rejected it |
|---|---|
| **"YOLO merge"**: an agent merges without my go. | It breaks rule 1: only my own words are a go. Rejected on 09-11-2026 while I looked for ways to cut approvals. |
| **Two-touchpoint approval**: I approve the plan and the result, and the plan approval covers every push and tracker write in between. | It drops the one-go-per-push-or-write rule. Rejected the same day, for the same reason. |
| The proof and custody machinery of the first role team. | 0 defects caught, about 15 of about 20 stops (milestone 1). |
| Live messaging between roles. | Files were enough. Deferred until a file round trip is too slow for questions and answers. |
| Nested desktop sessions as roles (tested 20-10-2026). | Siblings get a shared notes folder, which is a role-to-role channel and breaks independence. Every role after the first was still a click, and the lead would have had to move into the target repo. |
| Background sessions as roles, with no lead. | I had recorded this as decided, but it was the assistant's assumption, not my decision. I took it back: the stops that needed me needed judgment. |
| A new "office hour" parent session every day. | One more session to create every day. The existing Orchestrator became the parent instead. |
| A status pane beside the sidebar (29-10-2026). | It showed what the sidebar already showed, and its 30-second poll put it behind the sidebar. A band above the prompt replaced it ([pattern/board.md](pattern/board.md)). |
| Switching the host to an open-source agent runner (reviewed 23-10-2026). | The gain was plumbing comfort, not RAM: each agent is still a full session. One defaulted to skipping permission prompts. Watched, not adopted. |
| One cloud VM per agent. | It moves RAM off the laptop, but the local test site, database and worktrees would move too, and company code on a third-party cloud needs approval. Parked. |
| Roles as cloud sessions. | A cloud session cannot message the lead back and cannot see the local run folder, test site or database. |
| Killing finished role tabs automatically. | I chose a reminder from the lead instead, so nothing closes a tab I still want to read. |

## What I would do again / differently

- **Again:** start from one session per item, and add machinery only when a real run fails without it.
- **Again:** frozen commit plus evidence in files. Independent review on a fixed target was the part that earned its place.
- **Again:** check claims against the evidence myself. A verdict once described a screen the screenshots did not show.
- **Again:** keep "only my own words are a go" even when it costs approvals.
- **Differently:** measure RAM per session on day one, before designing a team of sessions.
- **Differently:** trim MCP servers and plugins per session from the start; most of a session's RAM was tools it never used.
- **Differently:** run one cheap pilot before building custody machinery. Two pilots showed most of it was not needed.
- **Differently:** give status tags a trigger (gate answered, phase started) from the first day, not a general "keep your title current".
