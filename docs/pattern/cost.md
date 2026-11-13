# What it costs

Expected question: doesn't managing sessions with sessions cost a lot more tokens?

Short answer, from one person's measurements: coordination was about a fifth of all tokens, and it behaved like a fixed cost. The bigger risk was idle sessions spending quota through a plugin hook.

Machine and setup for every number below: Windows 11, 32 GB RAM, Claude desktop app, one developer. Dates are local time.

## Code vs LLM turns

Keep everything that can be plain code out of the model.

| Action | Runs as | Tokens |
|---|---|---|
| Read session titles and status files, render any status view | plain code | none |
| Measure RAM | scheduled script (once a minute) | none |
| Set its title, write its status file | the lane, while it works | very few |
| Plan the day, write handoffs, open and close the day | Orchestrator (LLM) | per turn |
| Start lanes, settle resource conflicts | Board Leader (LLM) | per turn |
| Code, test, review inside a lane | lane (LLM) | the bulk; you pay it with one session too |
| Third-party plugin hooks | hidden | the trap: see below |

## Coordination share

Coordination = the Orchestrator and the Board Leader sessions together ([topology.md](topology.md)).

| Period | Coordination as share of all tokens | Coordination vs coordination + lane tokens | Lanes in parallel, avg per working day |
|---|---|---|---|
| 27-10-2026 to 09-11-2026 (2 weeks) | 19.4 % | 36.9 % | 2.3 |
| Week from 27-10-2026 | 19.8 % | 52.1 % | 1.6 |
| Week from 03-11-2026 | 19.0 % | 29.0 % | 3.0 |

- About 19 % of all tokens went to coordination over the two weeks.
- Measured against coordination plus lane tokens, the share fell from 52 % to 29 % while the average number of lanes almost doubled (1.6 to 3.0). That is what a fixed cost looks like. Two weeks is two data points: an observation, not proof.
- The first week includes three days of trial, when the Orchestrator still did some lane work itself.

How it was counted, and what is missing: [results.md](results.md#data-notes).

## What the 19 % buys

About 19 % is the price of letting sessions manage sessions. What it pays for, as experienced by one developer (not measured, except where a number is given):

- **You stop being the memory.** You no longer hold every item's state in your head; each lane keeps its own, and the day file carries it to tomorrow.
- **You only look where you are needed.** The tags say which lanes wait on you ([tags-and-titles.md](tags-and-titles.md)). Everything else is working or waiting on someone else.
- **One item, one clean context.** A lane never mixes two items' evidence or decisions ([rule 2](rules.md#rule-2-one-lane--one-parent-item)).
- **No fights over shared things.** One owner for the browser, the database server, ports and RAM, so lanes do not step on each other's deploys or tabs ([rule 3](rules.md#rule-3-shared-resources-have-one-owner)).
- **Approvals stay yours.** Lanes stop at fixed gates, and nothing upstream can approve for you ([rule 1](rules.md#rule-1-only-your-own-words-are-a-go)).
- **More in flight at once.** Up to seven lanes working at the same moment (12-11-2026), not seven spread over a day ([how it was counted](results.md#data-notes)).

## The idle-hook lesson

What happened (observation, one weekend, 06-11-2026 20:00 to 08-11-2026 22:00):

- Five idle sessions (one coordinating session, four lanes) each polled session state every 30 seconds **through a tool call**.
- Every tool call fires the post-tool-use hook. A hook-based third-party plugin sent each hook event to a small model, on the same plan quota.
- That came to about **600 hook events an hour** (5 sessions × 120), flat from 06-11 20:00 to 08-11 22:00: 26,397 poll events.
- The idle sessions used **about 30 % of the weekly quota** over that weekend. This figure comes from the plugin's own logs on the hook stream; it was not re-measured as a quota percentage after the fix.

The fix:

- **Repeated reads go through the file system, not tool calls.** File reads fired no hook events (measured: 0).
- **Tool calls run only on events**: session start, after a turn, on an explicit command.
- **The one remaining session-list poll backs off** while nothing changes: 30 s, then 2 min after four quiet polls, then 5 min after four more. Any change snaps it back to 30 s.
- As a stopgap before the code fix, the plugin's skip-list was set to ignore the two poll tools.

Measured after the fix (09-11-2026, about one idle hour): about **12 hook events an hour**, down from about 600, roughly 98 % fewer. A lane made 0 tool calls an hour while idle (was 120); the coordinating session made 12 (was 120).

Lessons:

- Hook-based plugins pay per tool call. Keep polling off the tool path.
- Measure your idle cost: leave your sessions idle for an hour and count hook events in the plugin's log.
- Verify the explanation before fixing, and set the target before you measure.
