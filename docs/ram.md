# What RAM it takes

RAM runs out before work does. This page is one machine's measurements: Windows 11, 32 GB RAM (31.5 GB usable), Claude desktop app, one developer. Snapshots, not a capacity test.

## The floor: 32 GB

32 GB is the least this should run on. With about eight lane sessions open and one local test site running, the machine sat at **75 %** of RAM in use (snapshot 13-11-2026). A second snapshot, on 11-11-2026 with about six lanes, read **78 %**.

## Where it goes

Most of it is the agent side, not the app under test. Snapshot of 13-11-2026, grouped by what the process is for:

| What | Processes | RAM |
|---|---|---|
| **Agent side** | | **≈ 13.7 GB** |
| Claude desktop app (every open session) | claude | 7.8 GB |
| Tool servers and plugins (MCP) | node, toolbox | 4.4 GB |
| Shells opened by the agents' commands | conhost, cmd, pwsh | 1.4 GB |
| **Environment under test** | | **≈ 1.9 GB** |
| Local test site and build servers (ASP.NET) | dotnet | 1.5 GB |
| SQL Server | sqlservr | 0.4 GB |
| **Browser** (the shared test browser plus personal tabs) | chrome | 4.7 GB |
| **Windows itself** | memory compression, services, antivirus, desktop | ≈ 6.0 GB |
| **Chat and other desktop apps** | | ≈ 2.1 GB |

Working set per process, read with `Get-Process`. The rows overlap a little (shared memory), so they add up to more than the 23.5 GB in use. "Memory compression" is Windows squeezing RAM because it is getting tight: 3.1 GB of it in this snapshot.

## Where the tool-server RAM goes

Every open session starts its own copy of each MCP server, so the cost grows with the number of sessions, not with how busy they are. About 14 sessions were open for this snapshot:

| MCP server or plugin | Copies running | RAM, all copies | Each copy |
|---|---|---|---|
| Playwright (browser control) | 28 | 1.6 GB | ≈ 57 MB |
| context-mode (keeps tool output out of the context) | 14 | 1.1 GB | ≈ 79 MB |
| Issue tracker server | 14 | 0.8 GB | ≈ 59 MB |
| MCP toolbox (database tools) | 14 | 0.7 GB | ≈ 47 MB |
| External reviewer plugin | 4 | 0.15 GB | ≈ 38 MB |
| Other | 3 | 0.08 GB | |

Same snapshot (13-11-2026), node and toolbox processes grouped by the server their command line starts.

**Lesson:** a lane that never opens a browser or a database still pays for those servers. Turning off the ones a lane does not need (a project-level settings file with only the servers that lane uses) is the cheapest RAM win left.

## What has helped

- Running SQL Server natively instead of in a container freed about 4.4 GB ([aspire-evaluation.md](aspire-evaluation.md)).
- Lanes stop their local test site while they wait.
- The Board Leader holds back a new lane when RAM is high ([board-leader.md](../roles/board-leader.md#shared-resources)).
- Closing finished session tabs. RAM per lane from earlier days: [solo-vs-team-lanes.md](solo-vs-team-lanes.md#ram-per-lane).

**Not measured:** how many lanes fit before the machine slows down.
