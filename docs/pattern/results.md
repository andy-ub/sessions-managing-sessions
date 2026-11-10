# One month in numbers

These are observations from one developer's work over four weeks, 13-10-2026 to 09-11-2026, counted on 09-11-2026. They are not proof that the pattern caused the change. Read the [data notes](#data-notes) before quoting any of them.

Machine and setup: Windows 11, 32 GB RAM, Claude desktop app.

## By week

Weeks run Tuesday to Monday, five working days each.

| Week from | 13-10 | 20-10 | 27-10 | 03-11 |
|---|---|---|---|---|
| Setup | early pipeline (pilot) | pipeline on real items | board trial | board lanes |
| Lanes in parallel, peak / avg per working day | – | – | 3 / 1.6 | 6 / 3.0 |
| Items to "ready for acceptance" | 1 | 1 | 3 | 10 |
| Coordination tokens vs coordination + lane tokens | – | – | 52 % | 29 % |
| Approvals given ("go") | 3 | 7 | 10 | 22 |

"Setup" in short: in the first two weeks, each item ran through a multi-role pipeline (a leader session plus builder sessions per item), with an orchestrator session and handoffs already in place. The board trial started on 29-10, with three lanes under a coordinating session. The three-layer form ([topology.md](topology.md)) ran from 04-11.

## Honest framing

- This was built step by step over about a month: the pipeline first, the lanes after. The last week was the first full week of real lanes, and things were still being fixed daily.
- The first two weeks are low partly because the developer was building the tooling itself. Read the table as investment, then payoff, not as "parallel sessions made one person 10× faster".
- An orchestrator and handoffs existed in the first two weeks, and output stayed at one item a week. The jump came when items ran as parallel lanes under a managing session. A status view helps keep many lanes in sight; it is part of the gain, not the cause.

## The human is the bottleneck

Approvals per finished item went down, from about 3.3 (10 / 3) to 2.2 (22 / 10). Total approvals rose every week: 3, 7, 10, 22. The job moved from remembering and doing to deciding, and decisions now queue on one person. "I no longer hold every item's state in my head" is personal experience, not a measured fact.

Open question: how do you keep approvals from piling up on one person?

## Data notes

**Items**

- Only the developer's own parent items are counted. A teammate's own items are not included, even when they were in the same sprint.
- An item counts in the week it reached "ready for acceptance" (handed to the PM to accept), as recorded in the day files and status files.
- One of the 10 items in the last week was later sent back (not accepted). It is still counted in that week.
- Item sizes differ by week, and so does sprint timing.

**Lanes in parallel**

- A lane is a session whose title follows the lane format ([tags-and-titles.md](tags-and-titles.md)). Test sessions created only to test tooling are excluded.
- "In parallel" means the lane had at least one model turn that local day, not that lanes ran at the same instant. A lane waiting on review with no turn that day is not counted.
- The average is over the five working days of the week; weekend turns are left out of it.
- Weeks 13-10 and 20-10 have no lanes under the title rule. Delivery then ran through the pipeline's own sessions, which are not counted as lanes.

**Tokens**

- Summed from local Claude Code transcripts: input + cache write + cache read + output, each assistant message counted once by its message id (forked sessions copy their parent's history). Totals are dominated by cache reads.
- Coordination = the Orchestrator and Board Leader sessions. The share is not countable in the first two weeks, because there were no lanes.
- The week from 27-10 includes three trial days in which the Orchestrator still did lane work itself, which raises its share.
- Some work sessions ran outside the lane title format and count as "other work", not lanes. Counted as lanes, they would lower the coordination share.
- Share of all tokens, and the two-week figures: [cost.md](cost.md#coordination-share).

**Approvals**

- Counted by text search over end-of-day records, for phrases that record the human's go.
- The count may double-count a go recorded by two sessions, and it misses approvals given only in chat.
- Eight days in the period have no end-of-day record. Their approvals are not countable, which is not the same as zero.

**What is missing**

- PRs merged per week are left out on purpose: the count depends on when the reviewer gets to them and is noisy.
- Idle cost was measured only from 06-11-2026 ([cost.md](cost.md#the-idle-hook-lesson)).
- RAM per lane and the lane ceiling are single-day samples, not a capacity test ([solo-vs-team-lanes.md](../solo-vs-team-lanes.md#ram-per-lane)).
- Each week is a single data point. No control period, no second developer.
