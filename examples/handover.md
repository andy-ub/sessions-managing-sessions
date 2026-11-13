*Sample output of `/handover "Board Leader"`, saved as `<scratch>/daily/2026-11/18/handover-board-leader-18-11.md`. This file is constructed from the skill, not taken from a real run. Fictional day.*

# Handover: Board Leader, 18-11-2026 17:15

Written 18-11-2026 17:15 by the Board Leader for its successor. The transcript has grown long after five lanes; the role moves to a fresh session.

## Suggested skills
- `lgtm` (to read lane blocks), `handoff` (for any new lane), and the [Board Leader role](../roles/board-leader.md).

## Parent
**Orchestrator** (role title). It receives one status line per lane when a lane closes and at the end of the day. Fallback session id: `local_7f3a…`.

## Role title
**Board Leader**

## Predecessor
"Board Leader" · session local_d15b… · cwd <workspace>

## Role
- Parent of every lane below. Starts lanes only on your own words in this session.
- Owns the shared resources: RAM, the local test site port, the shared browser, the database server, every database clone.
- Relays each lane's done, `CHECK`, `GATE` and `CLOUD` to you in one line.
- Latest state: the lane blocks in `<scratch>/daily/2026-11/18/day.md` (newest 17:40, 1234 export fix). Not copied here.

## Contacts
| Title | Session | State |
|---|---|---|
| Orchestrator | local_7f3a… | running |
| GATE · 1204 image-gallery · P10 · PR 1321/1322 | local_b41d… | running, waits on your go for push |
| GATE · 1234 export fix · P12 · PR 1325/1326 | local_e3c8… | running, waits on your go for the close-out state |
| WAIT · 1235 date filter · P11 · PR 1327/1328 | local_9a62… | running, waits on the reviewer |
| 1240 memory leak · P2 | local_2c9e… | running, working (v5 code read) |
| DONE · 1206 price-rounding · P12 · PR 1317/1318 | local_5e07… | stopped, archived 11:50 |

**Pending handoffs** (written, not started):
- `<scratch>/daily/2026-11/17/handoff-1238-invoice-reminders.md`: written 17-11 by the Orchestrator. Not started: the PM put #1240 above it.

## Open lanes
1204 image-gallery, 1234 export fix, 1235 date filter, 1240 memory leak (rows above). They stay children of this role. Talk to them directly by session id; do not relay through the retired session.

## Shared resources at 17:15
- Shared browser: free (1234 released it 16:47).
- Local test site port: free.
- Database clones: `app_1204` (1204, until re-review), `app_1240` (1240, until the v5 check). Both reasons are in the lanes' blocks.
- RAM: 58 % (`<shared>/status/_board.json`, updated 17:14). Room for one more lane.

## Handshake (the successor's first actions)
1. Read the clock. Keep the temporary title the app gave you.
2. Message the predecessor: your title, session id, working directory. Use its title first; fall back to `local_d15b…`.
3. Wait for its reply "renamed".
4. Rename yourself to "Board Leader".
5. Reply "role taken".
6. Read the sections above and the newest block in `day.md`, then continue.

You open the successor with: read `<scratch>/daily/2026-11/18/handover-board-leader-18-11.md` and follow it.

---

## Notes added after the handshake (17:31)
- Successor: session local_4a8c…, handshake 17:24. Renamed this session to "Board Leader (retired 18-11 → local_4a8c)", replied "renamed"; "role taken" received 17:29.
- Running contacts told at 17:30: "Board Leader is now session local_4a8c…. Send further messages to Board Leader." Stopped contact: 1206 price-rounding (archived, nothing owed).
- Pending handoff `handoff-1238-invoice-reminders.md`: parent line now names "Board Leader" (dated note appended, document not rewritten).
- `who` line appended to `<shared>/orchestrator-sync.md`: Board Leader → local_4a8c…, parent of 1204, 1234, 1235, 1240.
- Final `## Session close — 17:33 (18-11) — Board Leader handover` block appended to `day.md`, naming the successor.

### Redirect rule
> Retired. Take no new work. For any inbound cross-session message: forward it verbatim to Board Leader, and reply to the sender: "This session has retired; Board Leader is now session local_4a8c…. Resend to Board Leader."
