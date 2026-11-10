# Evaluation: would .NET Aspire help parallel Claude Code lanes on one machine?

Date of evaluation: 10-11-2026. Status: evaluation of one setup, not a general verdict on Aspire.

## The question

A peer engineer suggested .NET Aspire when we described our RAM problem. The question:

> Would .NET Aspire help a developer who runs several parallel Claude Code sessions ("lanes"), each of which may need a local web app, a database and a browser for verification, on one machine?

Short answer: not for this setup, not now. The rest of this page shows why, and what would change the answer.

## Context

**Machine.** Windows 11, 32 GB RAM (Windows reports 31.5 GB usable). One developer.

**Sessions.** Every lane is a Claude Code session in the Claude desktop app. One coordinating session starts the lanes as nested sessions, one lane per work item. The developer approves the gates in each lane (plan, push, evidence, review requests). See [pattern/topology.md](pattern/topology.md).

**Environments a lane may need.**
- The local test site (an ASP.NET web app), started with `dotnet run` on a fixed local port.
- A database: SQL Server, installed natively since 02-11-2026. Before that it ran in a container under Rancher Desktop (WSL 2). Each lane works on its own database clone.
- One shared Playwright browser for UI checks.

**Shared resources are claimed.** A lane writes a claim line to a shared, append-only log before it uses the test site port, the browser or the SQL instance, and a release line after. The coordinating session owns the RAM budget and decides conflicts. A new lane starts only with at least 8 GB free.

## What Aspire offers (verified claims only)

Checked on 10-11-2026 against the official pages. The learn.microsoft.com Aspire pages now serve or redirect to aspire.dev, so aspire.dev is the source below. The pages show no "last updated" date.

| # | Claim | Status | Source |
|---|---|---|---|
| 1 | Free and open source. Licence: MIT. No page names a charge for local development; costs come only from cloud targets you choose to deploy to (that last part is an inference). | Verified | https://aspire.dev/get-started/what-is-aspire/ |
| 2 | An MCP server for coding agents: list resources, console and structured logs, traces; start, stop and restart resources. It does not expose source code, environment variable values or secrets. | Verified, but the mechanism changed (see below) | https://aspire.dev/get-started/aspire-mcp-server/ |
| 3 | Runs locally: the AppHost, DCP (the orchestrator) and the developer dashboard. Deploying is a separate, opt-in command (`aspire publish` / `aspire deploy`), with one hosting package per target. | Verified | https://aspire.dev/architecture/overview/ and https://aspire.dev/deployment/deploy-with-aspire/ |
| 4 | `aspire run --isolated` / `aspire start --isolated` (Aspire 13.2) runs several instances of the same AppHost side by side. The docs name agentic workflows and git worktrees as a use. | Verified | https://aspire.dev/whats-new/aspire-13-2/ |
| 5 | Claude Code sessions as Aspire resources. | Not found. No official page documents a coding agent session as an AppHost resource. | — |

Notes on claim 2:
- Aspire 13 built the MCP server into the dashboard. Aspire 13.1 added agent setup for Claude Code and others. Aspire 13.2 renamed `aspire mcp` to `aspire agent`. The dashboard MCP server has since been removed.
- Today `aspire agent init` writes the config, and `aspire agent mcp` starts a stdio server. The AppHost must be running (`aspire start`).
- Older blog posts still show `aspire mcp init` / `aspire mcp start`. Those are the pre-13.2 names.

Notes on claim 5:
- The documented integration goes the other way: the agent uses Aspire through `aspire agent init` and its MCP server.
- Wrapping `claude -p` in a generic executable resource might work. That is an assumption, not documented for this purpose.

## Measured evidence

### RAM by process group (10-11-2026, 13:09)

How: one read-only `Get-Process` snapshot, summed by process name into groups. Several lanes were open (count not recorded). No test site was running. Total used RAM at the time, as noted with the snapshot: about 66 %.

| Group | Processes | MB |
|---|---|---|
| Other (Windows, services, other apps) | 389 | 11,478 |
| Claude desktop app | 26 | 5,749 |
| Browsers (Chrome, Edge) | 40 | 4,652 |
| node / bun (Claude Code CLI, MCP servers, plugins) | 67 | 3,725 |
| VS Code | 14 | 1,632 |
| .NET (build servers; no test site running) | 11 | 1,001 |
| SQL Server (native) | 1 | 172 |

Limits:
- One snapshot, idle state. Two more were planned and not taken: one lane in UI verification (test site and browser up), and peak lanes.
- The groups sum to about 28.4 GB, more than the RAM in use (about 66 % of 31.5 GB). Figures for single processes count shared memory more than once. Read the groups as relative sizes, not exact shares.
- The file does not record which memory counter was summed.

What it shows: the agent side (Claude desktop app plus node/bun) is about 9.5 GB. The environment side (.NET plus SQL Server) is about 1.2 GB.

### RAM for each lane (29-10-2026, 17:32, measured during a trial with 3 lanes; 71 % used at the time)

- Each lane's Claude process: about 0.4 GB.
- An idle lane, with its share of MCP servers, the memory plugin and PowerShell: about 1-1.3 GB.
- A working lane also uses the shared MSBuild and compiler servers (about 1-1.3 GB, shared by all lanes). Booting the test site adds about 1-1.5 GB. A working lane: about 2-3 GB.
- Starting the third lane moved total use from 57 % to 66 %.
- Working ceiling found that day: 3 lanes plus a light browser. A 4th lane fits only by replacing a lane that is waiting.

### How often more than one test site runs (27-10-2026 to 10-11-2026)

How: the claim and release lines in the shared log, cross-checked against the modified times of the test site's boot logs.

- 39 recorded test site windows on the main site's port. **0 overlaps** between lanes. Each claim comes after the previous release.
- Boot-log times for 9 of the 39 sit inside the claimed windows. The rest have no boot log to check.
- 1 near miss (31-10-2026): a lane wrote its claim while another held the port. Its boot started after the release. Self-reported; no boot log.
- 1 aborted second start (02-11-2026): it stopped on the port clash before it touched the database.
- 1 overlap across projects (28-10-2026, 12 minutes): a lane for another project ran its own site on a different port. That lane did not use the shared browser.
- No claims on 4 of the 15 days.

Limits: the log is self-reported, not process monitoring. A lane that booted without claiming would not show. Three timestamp errors were corrected by the lanes; one stays uncorrected. So the claim holds as "one test site per port at a time", not "one site on the machine at a time".

### History: the container runtime (October and November 2026)

| Date | State | Figure |
|---|---|---|
| 22-10-2026 | Rancher Desktop running | 3.0 GB free of 31.5 GB; `vmmemWSL` 3.3 GB working set, 8.5 GB committed |
| 02-11-2026, morning | Rancher Desktop running, SQL container stopped | 14.8 GB free (about 53 % used); `vmmemWSL` 2.45 GB |
| 02-11-2026, a heavy SQL job in the container | Rancher Desktop running | `vmmemWSL` grew 4.4 → 6.6 → 7.7 GB and stayed at 7.3 GB; host free RAM fell 14.8 → 10.9 GB |
| 02-11-2026, after moving to native SQL Server | Rancher Desktop still running | `vmmemWSL` 4,374 MB, Rancher processes 198 MB; 7.5 GB free (other apps open, not comparable) |
| 02-11-2026, 13:13 | Rancher Desktop quit | 11.5 GB free, 63 % used; `sqlservr` 241 MB; no `vmmemWSL` |
| 05-11-2026 | Rancher Desktop removed | no `vmmemWSL` or `wslrelay` process |
| 10-11-2026 | lanes running | 61 % (12.2 GB free), 64 % (11.3 GB free), 74 % (8.1 GB free) at three moments |

What it shows: quitting the container runtime freed about 4.4 GB (the WSL VM at 4.37 GB plus 0.2 GB of Rancher processes went to zero). There is no controlled before/after figure for total use. The 76 % → 63 % drop on 02-11-2026 mixes in other apps, so it is not a clean measure.

## Assessment

**The bottleneck is the agent side, not the environments.** In the 10-11-2026 snapshot the sessions and their tool servers take about 9.5 GB. The environments take about 1.2 GB, and only one test site runs at a time anyway.

**Aspire would add RAM, not free it.** It runs its own processes: the AppHost, DCP and the dashboard, plus the `aspire agent mcp` server per agent that uses it. Not measured here; this is an assumption based on the architecture page. It manages the environment side, which is the small part. It does not shrink the sessions.

**Running the sessions headless under Aspire would lose things this setup depends on.**
- Human-in-the-loop gates. Each lane stops for the developer's approval before a push, a review request or a status change. A headless `claude -p` run has no one to ask.
- Desktop features: nested sessions under the coordinating session, the note to the parent at each turn end, waking a session by message, the shared notes folder, and the status band above the prompt. These exist only in the Claude desktop app.
- The desktop app refuses to start a nested session from an automated turn. A person has to ask in their own words. That is the gate, and it is wanted here.
- Billing, checked 10-11-2026: `claude -p` uses the subscription when logged in, if no API key variable is set and `--bare` is not used (verified with conditions, https://code.claude.com/docs/en/authentication and https://code.claude.com/docs/en/headless). For the Agent SDK, personal use on a subscription is not prohibited, but products built on it need API key auth (partly verified, https://code.claude.com/docs/en/legal-and-compliance). Whether SDK runs count against subscription limits in practice is not verified.

**Why only one lane uses the local test site at a time.**
- The shared Playwright browser is one browser. Two lanes driving it at once would break each other's checks.
- The test site runs on a fixed port. A second start on the same port fails (seen on 02-11-2026).
- So lanes queue through the claim log. Aspire's `--isolated` mode could give each lane its own ports, but the browser would still be shared, and the queue is not the limit today: 0 overlaps in 39 windows.

**What helped RAM instead.**
- Removing the container runtime and running SQL Server natively (about 4.4 GB, see History).
- Closing finished session tabs, and lanes stopping their test site while they wait.
- One owner for shared resources, and a free-RAM threshold before a lane starts.

Next ideas, not yet tried: fewer MCP servers and plugins per session (67 node/bun processes in one snapshot), putting waiting lanes to sleep, and a RAM cap checked before each lane start. See [pattern/cost.md](pattern/cost.md).

## Verdict

Not worth adopting for this setup now. Aspire solves environment orchestration, and environments are not the limit here. It would add processes to a machine that is short on RAM, and the way to fit sessions into it (headless) would remove the human gates the setup relies on.

## What would change the verdict

- **Several lanes need their own running site at the same time.** The claim log would show overlaps or long queues. `aspire start --isolated` per worktree looks made for that case.
- **Several people share the lane setup.** Then a web dashboard, shared resource views and a shared host start to matter.
- **Runs with no human gate.** If lanes run unattended, headless sessions under an orchestrator lose nothing that matters.
- **A documented pattern for coding-agent sessions as Aspire resources that keeps a human approval step.** None was found on 10-11-2026.
- **More RAM, or a measurement that shows the environment side is large.** The two missing snapshots (one lane in UI verification, peak lanes) could change the split above.
