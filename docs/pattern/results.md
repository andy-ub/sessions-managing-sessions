# Before and after

These are observations from one developer's work over four weeks, 13-10-2026 to 09-11-2026. They are not proof that the pattern caused the change. Read the [data notes](#data-notes) before quoting any number.

Machine and setup: Windows 11, 32 GB RAM, Claude desktop app.

## What changed

- **Before:** items moved through one at a time, and I kept every item's state in my head.
- **After:** several lanes work at the same time (up to seven at once so far), and I open only the lanes that are waiting on me ([tags-and-titles.md](tags-and-titles.md)).

There are no output numbers here on purpose. Items differ a lot in size, and a count of finished items is not a fair yardstick for anyone, the author included. The numbers on this page are about what the setup costs to run.

## By week

Weeks run Tuesday to Monday, five working days each.

| Week from | 13-10 | 20-10 | 27-10 | 03-11 |
|---|---|---|---|---|
| Setup | early pipeline (pilot) | pipeline on real items | board trial | board lanes |
| Lanes in parallel, peak / avg per working day | – | – | 3 / 1.6 | 6 / 3.0 |
| Coordination tokens vs coordination + lane tokens | – | – | 52 % | 29 % |

"Setup" in short: in the first two weeks, each item ran through a multi-role pipeline (a leader session plus builder sessions per item), with an orchestrator session and handoffs already in place. The board trial started on 29-10, with three lanes under a coordinating session. The three-layer form ([topology.md](topology.md)) ran from 04-11.

Coordination behaves like a fixed cost: as lanes doubled, its share against lane tokens fell. Share of all tokens: [cost.md](cost.md#coordination-share).

## Honest framing

- This was built step by step over about a month: the pipeline first, the lanes after. The last week was the first full week of real lanes, and things were still being fixed daily.
- An orchestrator and handoffs existed in the first two weeks, and items still moved one at a time. The change came when items ran as parallel lanes under a managing session. A status view helps keep many lanes in sight; it is part of the change, not the cause.

## The human is the bottleneck

Each item needs fewer approvals than before, but with more lanes there are more approvals in total. The job moved from remembering and doing to deciding, and decisions now queue on one person. "I no longer hold every item's state in my head" is personal experience, not a measured fact.

Open question: how do you keep approvals from piling up on one person?

## Data notes

**Lanes in parallel**

- A lane is a session whose title follows the lane format ([tags-and-titles.md](tags-and-titles.md)). Test sessions created only to test tooling are excluded.
- "In parallel" means the lane had at least one model turn that local day, not that lanes ran at the same instant. A lane waiting on review with no turn that day is not counted.
- The average is over the five working days of the week; weekend turns are left out of it.
- Weeks 13-10 and 20-10 have no lanes under the title rule. Delivery then ran through the pipeline's own sessions, which are not counted as lanes.
- **"Up to seven at once"** is a different, stricter measure: lanes working at the same moment, counted from the transcripts. A lane counts as working while its turns are less than 10 minutes apart. The peak was 7, on 12-11-2026 and again on 13-11-2026, after the four weeks in the table.

**Tokens**

- Summed from local Claude Code transcripts: input + cache write + cache read + output, each assistant message counted once by its message id (forked sessions copy their parent's history). Totals are dominated by cache reads.
- Coordination = the Orchestrator and Board Leader sessions. The share is not countable in the first two weeks, because there were no lanes.
- The week from 27-10 includes three trial days in which the Orchestrator still did lane work itself, which raises its share.
- Some work sessions ran outside the lane title format and count as "other work", not lanes. Counted as lanes, they would lower the coordination share.

**What is missing**

- Output counts (finished items, approvals) are left out on purpose: see [What changed](#what-changed).
- Idle cost was measured only from 06-11-2026 ([cost.md](cost.md#the-idle-hook-lesson)).
- RAM per lane and the lane ceiling are single-day samples, not a capacity test ([solo-vs-team-lanes.md](../solo-vs-team-lanes.md#ram-per-lane)).
- Each week is a single data point. No control period, no second developer.
