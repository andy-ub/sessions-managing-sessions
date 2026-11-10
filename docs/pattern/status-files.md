# Status files

Three kinds of file carry state between sessions. All are plain text in folders every session can reach, outside any repo or worktree.

| File | Who writes | Who reads | Shape |
|---|---|---|---|
| Shared status file, `<shared>/orchestrator-sync.md` | Board Leader (`who` lines); each lane (its own lines) | every session | one line per event, append-only |
| Lane status file, `<shared>/status/<session id>.json` | that lane only | the Board Leader, any script | one small JSON object, rewritten in place |
| Day file, `<scratch>/daily/{YYYY-MM}/{DD}/day.md` | each session, one block per close | the Orchestrator at day close and next morning | blocks, append-only |

`<shared>` is a folder outside every repo, so all worktrees see the same file. `<scratch>` is a git-ignored work folder in your workspace.

## Shared status file

Append only. Never edit or delete another session's line. Every line carries a clock time and a session name.

### Lane lines: CLAIM, RELEASE, note

Each lane writes its own lines:

```
<DD-MM-YYYY HH:MM tz> local_<id> (<lane>): CLAIM|RELEASE|note · <resource> · <why> · <expected release>
```

Examples (fake ids):

```
10-11-2026 10:48 +01 local_<id> (1234 export fix): CLAIM · database clone app_1234 · local verify · ~12:00
10-11-2026 10:52 +01 local_<id> (1235 date filter): CLAIM · shared browser · cloud check · after 1234 releases
10-11-2026 11:58 +01 local_<id> (1234 export fix): RELEASE · database clone app_1234 · verify done · -
10-11-2026 12:25 +01 local_<id> (1234 export fix): note · PRs 1201/1202 open · waiting for CI · -
```

- `CLAIM` before using an exclusive resource: the shared browser, a local site port, a database clone (by name), the database server for a timing-sensitive step.
- `RELEASE` when done. A session releases only what it claimed. A status report ([/lgtm](../../skills/lgtm/SKILL.md)) lists held claims but never releases them.
- `note` for anything other lanes may care about: files or tests changed, public behaviour, a base merge, a PR opened.
- Read the file at start, before changing shared code or tests, and before merging.

A held claim is visible as a `CLAIM` with no later `RELEASE` from the same session. If two lanes want the same resource, the Board Leader decides ([rule 3](rules.md#rule-3-shared-resources-have-one-owner)).

### Board Leader lines: who

The Board Leader writes `who` lines: a role starting, a rename or handover, a lane started and whose child it is. A suggested form:

```
<DD-MM-YYYY HH:MM tz> <role title>: who · <what changed> · local_<id> · <lanes it is parent of>
```

A lane's report finds its parent from its handoff or from the newest `who` line about that lane ([topology.md](topology.md#addressing-a-message)).

## Lane status file

Optional, and useful when a script or a view reads lane state. Each lane rewrites its own file when its tag, phase or current step changes. Fields:

| Field | Meaning |
|---|---|
| `id` | the lane's session id (also the file name) |
| `title` | the lane's full live title ([tags-and-titles.md](tags-and-titles.md)) |
| `item` | the parent item id (the first id for a grouped lane) |
| `phase` | the current phase number of the lane's flow |
| `tag` | the current tag, or `null` while working |
| `startedAt` | when the lane started |
| `tagSince` | when the tag last changed |
| `now` | what the lane is doing, while working |
| `need` | what it needs, while tagged; short (at most 25 characters) |
| `updatedAt` | time of this write, with offset |

Example (fake ids):

```json
{ "id": "local_<id>", "item": 1204, "title": "GATE · 1204 image-gallery · P10 · PR 1321/1322",
  "phase": 10, "tag": "GATE", "startedAt": "2026-10-30T07:02:00Z", "tagSince": "2026-10-30T09:43:00Z",
  "now": null, "need": "go for push", "updatedAt": "2026-10-30T09:43:05Z" }
```

What a status view draws from these fields: [board.md](board.md).

Rewrite the file in the same step as every retitle. A file whose `title` or tag differs from the live title is stale. An old file whose title still matches is fine, however long the lane has waited.

Write to a temp file in the same folder, then move it over the target, so a reader never sees half a file.

## Day file

One file per working day. Each session appends **one block per session close**, never rewrites earlier blocks, and may mark a row in an earlier block resolved in place with a pointer. Lanes write their blocks with [/lgtm](../../skills/lgtm/SKILL.md); the Orchestrator closes the day from every block. The day file becomes tomorrow's starting point: the next morning's plan is built from it.

The exact rules (clock, working day vs clock day, append-only, the Session line, the block format) are in [day-file-rules.md](../../skills/lgtm/day-file-rules.md). They are not repeated here.

## A correction is not applied until the old claim is deleted

When you correct a number or a claim, search the file for the old number and the old wording, and remove or mark every copy. A correction added while the original survives elsewhere is worse than none: the reader meets both, and the stale one usually comes first.

Lesson: a corrected number survived in a "Next" line of a day file. The next morning's plan was built on the wrong number.

Search first where readers act: headings, "Next" and blocker lines, then "Done" rows and any arithmetic that used the old figure. Full checklist: rule R5 in [day-file-rules.md](../../skills/lgtm/day-file-rules.md#r5-a-correction-is-not-applied-until-the-old-claim-is-gone).
