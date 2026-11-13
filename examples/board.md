*Sample of the board above the Board Leader's prompt, at 10:45 and at 15:20. Fictional day; the structure mirrors the real view.*

# Board, 18-11-2026

This is the terminal rendering of a personal mod for the Claude desktop app (its code is not in this repo; see [board.md](../docs/pattern/board.md)). The same information is in the session titles: the board only reads them, plus each lane's status file and a RAM file.

## 10:45, after the stand-up

```
Board  2 check · 1 gate                                         RAM 54% · ctx 96k
CHECK  1235 date filter     P11 ▰▰▰▰▰▰▰▰▰▰▰▰▱  wait 2h05  PR 1327/1328  fix red CI
CHECK  1204 image-gallery   P11 ▰▰▰▰▰▰▰▰▰▰▰▰▱  wait 1h55  PR 1321/1322  lazy-load: here or later
GATE   1206 price-rounding  P12 ▰▰▰▰▰▰▰▰▰▰▰▰▰  wait 1h10  PR 1317/1318  ok close-out state
WAIT   1234 export fix      P12 ▰▰▰▰▰▰▰▰▰▰▰▰▰  wait 0h33  PR 1325/1326  deploy in 14:30 batch
       1240 memory leak     P0  ▰▱▱▱▱▱▱▱▱▱▱▱▱  run 0h40                 repro on clone app_1240
```

## 15:20, before refinement

```
Board  2 check · 1 gate · 1 cloud · 1 done                      RAM 61% · ctx 210k
CHECK  1235 date filter     P11 ▰▰▰▰▰▰▰▰▰▰▰▰▱  wait 0h35  PR 1327/1328  fix red CI
CHECK  1240 memory leak     P2  ▰▰▰▱▱▱▱▱▱▱▱▱▱  wait 0h20               ok investigation task
GATE   1204 image-gallery   P10 ▰▰▰▰▰▰▰▰▰▰▰▱▱  wait 1h38  PR 1321/1322  go for push
CLOUD  1234 export fix      P12 ▰▰▰▰▰▰▰▰▰▰▰▰▰  wait 0h15  PR 1325/1326  check on cloud v4+v5
```

The same five lanes as session titles at 15:20:

```
CHECK · 1235 date filter · P11 · PR 1327/1328
CHECK · 1240 memory leak · P2
GATE · 1204 image-gallery · P10 · PR 1321/1322
CLOUD · 1234 export fix · P12 · PR 1325/1326
DONE · 1206 price-rounding · P12 · PR 1317/1318
```

## How to read a row

| Column | Example | Source |
|---|---|---|
| Tag | `GATE` | the session title; no tag = working |
| Id and name | `1204 image-gallery` | the session title |
| Phase | `P10` | the session title; the step of the dev flow |
| Track | `▰▰▰▰▰▰▰▰▰▰▰▱▱` | 13 cells for Phases 0–12, filled up to the current phase |
| `wait` / `run` | `wait 1h38` | status file: time since the tag was set (`tagSince`); for a working lane, `run` time instead |
| PRs | `PR 1321/1322` | the session title; one slot per supported version (v4/v5) |
| Need / now | `go for push` | status file: `need` while tagged, `now` while working |

**Header:** counts of `CHECK`, `GATE`, `CLOUD` and `DONE` lanes, then RAM in use on the machine and this session's context size.

**Sort order:** `CHECK`, `GATE`, `CLOUD`, `WAIT`, then working lanes. Inside a tag, the longest wait comes first. `DONE` lanes are only counted, never shown as a row.

## What changed between the two

- **1206 price-rounding:** GATE → DONE. The close-out go came at 10:55; the lane closed at 11:45 and was archived.
- **1204 image-gallery:** CHECK → working → GATE. You answered the lazy-load question at 10:50 (fix the alt text now, ask the PM about the rest). The lane went back to Phase 10 for a UI retake, then stopped for the push at 13:42.
- **1234 export fix:** WAIT → CLOUD. The v5 merge missed the 10:00 deploy batch; the 14:30 batch landed at 15:05.
- **1235 date filter:** CHECK both times, for different reasons. The morning red was a time-zone test, fixed at 11:05. The 14:45 red came from a base merge that picked up the export fix's query change.
- **1240 memory leak:** working → CHECK at 15:00. It needs your OK on the proposed tracker task before refinement at 15:30. Its handoff is in `handoff.md`, its 16:50 block in `lgtm.md`, its day-end state in `office-end.md`.

You open only the `CHECK`, `GATE` and `CLOUD` rows. At 15:20 that is four lanes; the order says where to start.
