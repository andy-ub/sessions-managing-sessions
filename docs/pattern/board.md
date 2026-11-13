# The board: a status view on top of the files

The pattern works with session titles and status files alone ([copy-it.md](copy-it.md)). With many lanes it helps to see them all in one place. A small UI does that: it draws the lanes as a band above the prompt, and opens a lane's detail in a side pane.

It is a personal mod for the Claude desktop app and **its code is not included**. A text sample of the band, with five lanes on one day: [examples/board.md](../../examples/board.md). This page describes what it shows and what it reads, so you can build your own view (a script, a terminal status line, a web page) from the same files.

## The band in the Board Leader session

> **[Image slot 1: `board/board-band.png`]** The band in the Board Leader session with several lanes at different phases and tags (at least CHECK, GATE, WAIT and one working lane), the header counts and the RAM figure. Fake item ids, names and PR numbers only.

- **Header:** counts per tag (`2 check · 2 gate · 1 cloud · 1 done`), then on the right the machine's RAM use and this session's context size.
- **One row per lane**, sorted by who must act: `CHECK`, `GATE`, `CLOUD`, `WAIT`, then working lanes. Inside a tag, the longest wait comes first. Done lanes are only counted.
- **Row parts:** tag (in its colour), item id and short name, current phase (`P8`), a 13-segment track for the phases, `wait` time since the tag was set (or `run` time for a working lane), and the PR numbers.
- **Click a row** to jump to that lane's session.

So the question "which lane needs me, and since when?" is answered without opening any transcript. Tags and who acts on each: [tags-and-titles.md](tags-and-titles.md).

## The lane detail pane

> **[Image slot 2: `board/lane-detail.png`]** The Lane detail pane for one lane stopped at a GATE: the card with `need`, wait and run times and the item/PR links, the phase list with files and dates, and the scratch-folder footer. Generic phase and file names, fake ids.
>
> **[Image slot 3: `board/lane-band.png`]** The one-line band in a lane session: tag dot, id and name, the track with its `P10/12` pill, `need` and the wait time.

- **Card:** id, name, tag, what the lane needs from you (`need: go for push`), how long it has waited and run, and links to the tracker item and the PRs.
- **Phases:** each phase of the lane's [dev flow](../../skills/dev-flow/SKILL.md), done or not, with the file each phase wrote and its date. Click a file to open it. `◆` marks the phases where the lane stops for you.
- **Footer:** the lane's scratch folder, with a copy button.

In each lane session a one-line version of the same card sits above the prompt: tag colour, id, name, the track with a `P10/12` pill, and `need`.

## What it reads

| Part | Source |
|---|---|
| tag, id, name, phase, PR numbers | the lane's session title ([tags-and-titles.md](tags-and-titles.md)) |
| `need` / `now`, `wait`, `run` | the lane status file: `need`, `now`, `tagSince`, `startedAt` ([status-files.md](status-files.md#lane-status-file)) |
| list of lanes, jump to a lane | the app's session list (the lanes are child sessions of the Board Leader) |
| RAM | a small JSON file written every minute by a scheduled script: `{ "ram": { "usedPct": 79, "capPct": 85 }, "updatedAt": "…" }` |
| phase files in the pane | the lane's scratch folder |

**Stale rows.** If a lane's status file disagrees with its live title (a different title or tag), the row is dimmed and marked `~`. Staleness is judged by disagreement, never by age: a lane that has waited three hours with a matching file is not stale.

**Cost.** Drawing, polling and file reads are plain code: they spend no model tokens. See [cost.md](cost.md).

## Lessons from building it
- Sketch it first. The layout was designed as a mock-up before any code, then checked live with fake lanes (idle child sessions on a cheap model, with lane-format titles and a throwaway status folder), never with real lanes.
- A tag can be left over: a lane may still say `GATE` while it is already working again. The band dims such a tag (`GATE?`) after two polls show the lane busy.
- The title is the source of truth and the file is a cache. A lane rewrites its status file in the same step as every retitle.
