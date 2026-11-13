---
name: handover
description: Replace a coordinating session (the Orchestrator or the Board Leader) with a fresh one under a stable role title, so every session that talks to it keeps reaching it. Writes the succession handoff, handshakes with the successor, renames this session as retired, tells all contacts, fixes pending handoffs, then redirects stray messages. Only for coordinating roles; for lanes and ordinary switches use /handoff.
argument-hint: "[role title], e.g. \"Board Leader\". Omit it to keep this session's current title."
disable-model-invocation: true
---

Hand this session's role to a fresh session. The role keeps one **stable title** (the *role title*), so lanes, other coordinating sessions and pending handoffs keep reaching whoever holds it. Use it when the transcript gets long ([topology](../../docs/pattern/topology.md)). Example (constructed): [examples/handover.md](../../examples/handover.md).

**Coordinating session:** a session that dispatches sessions and receives their reports. In this repo that is the [Orchestrator](../../roles/orchestrator.md) or the [Board Leader](../../roles/board-leader.md). It is a role, not a title.

## 0. Resolve the role title
- With an argument: that is the role title (for example `/handover "Board Leader"`). Use it the first time a role gets a stable title.
- Without an argument: use this session's current title.
  - **Ask the user instead** if that title looks app-generated (a folder name with a number, a random slug) or contains `retired`.
- Read the clock (`date "+%d-%m-%Y %H:%M"`). Note this session's title, session id, working directory and model.

## 1. Write the succession handoff
Write the document following the [/handoff](../handoff/SKILL.md) rules: location, "Suggested skills", reference-don't-duplicate, the "Parent" section, redaction. Name it `handover-{role-slug}-{DD-MM}.md` in today's day folder. Add these sections:
- **Role title:** the title the successor takes.
- **Predecessor:** this session's title and session id.
- **Role:** what this session owns (lanes, resources, rules it enforces), with a pointer to the latest block in the day file rather than a copy.
- **Contacts:** every session this one dispatched or talks to. For each: title or role title, session id, and state (running, stopped, not started). Include **pending handoffs** (written, not yet started) with their paths.
- **Open lanes** (Board Leader only): every open lane with title, session id and state. Open lanes stay children of this session; the successor talks to them directly by id ([contract §6](../../roles/contract.md#6-lanes-that-span-several-days)).
- **Handshake (the successor's first actions):**
  1. Read the clock. Keep the temporary title the app gave you.
  2. Message the predecessor: title, session id, working directory. Use its title first; fall back to its session id.
  3. Wait for its reply "renamed".
  4. Rename yourself to the role title.
  5. Reply "role taken".
  6. Read the handoff's state sections and the latest day-file block, then continue.

Tell the user the path, and that they open the successor with: read `<path>` and follow it.

## 2. When the successor's handshake arrives
Do these in order, and report each to the user in one short line:
1. **Rename this session** to `<role title> (retired DD-MM → <successor session id, first 8 chars>)`. If the app asks the user to approve, say why. Then reply **"renamed"** to the successor.
2. When the successor replies "role taken", **message every running contact**: "<role title> is now session `<session id>`. Send further messages to <role title>." Stopped contacts cannot be reached now; list them for the user.
3. **Tell the user** which contacts are stopped, or may hold the message for approval (for example a session in a different permission mode), so the user can approve or reopen them.
4. **Fix pending handoffs:** in each not-yet-started handoff this session wrote, make the parent line name the **role title**. Append a short dated note instead of rewriting the document.
5. **Shared status file:** if several lanes run, append a `who` line to `<shared>/orchestrator-sync.md` naming the role, the successor's session id and the lanes it now parents ([format](../../docs/pattern/status-files.md#board-leader-lines-who)). The day-close guard in [/office-end](../office-end/SKILL.md) reads it.
6. **Enter redirect mode.** Write this rule into the handoff document as well, so it survives compaction:
   > Retired. Take no new work. For any inbound cross-session message: forward it verbatim to <role title>, and reply to the sender: "This session has retired; <role title> is now session <id>. Resend to <role title>."

   Answer the user normally, but point new work to the successor.
7. Append a final `## Session close — HH:mm — label` block to today's day file (the `Session:` line and the Status block; [rules](../lgtm/day-file-rules.md)) that records the handover and the successor.

## Rules
- Read the clock for every timestamp you write. Do not estimate times.
- Address sessions by title, with the session id as fallback. Never write a process-level reference that changes when the app restarts.
- Do not change permission modes or settings for other sessions; that is the user's call.
- If the successor never handshakes, stay in charge. Do not rename or redirect until it does.
