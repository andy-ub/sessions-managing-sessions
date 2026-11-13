---
name: handoff
description: Compact the current conversation into a handoff document so a fresh session can continue the work. Use for deliberate session switches (opening a new line of work, dispatching a lane, or replacing a lane session), not as a replacement for durable notes and not for every session.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document that summarises the current conversation so a fresh agent can continue the work.

## Where to save it
- Default: the day folder `<scratch>/daily/{YYYY-MM}/{DD}/handoff-{slug}.md`, where `<scratch>` is a git-ignored work folder in your workspace (create the folders if missing). One folder per working day lets the end-of-day close find every handoff in one place.
- If the handoff belongs to one work item, save it in that item's scratch folder instead.
- Never write it to a tracked path. With no scratch folder, use the OS temp directory.

## What goes in it
- **Suggested skills:** the skills the next agent should load first (for example `dev-flow`, a TDD skill, a worktree skill), so it ramps up fast.
- **Only what is not written down elsewhere.** Reference durable notes, implementation notes, plans, tracker items, commits, PRs and diffs by path, id or URL. The handoff carries (a) the framing and ordered first steps for the next session, and (b) live state not yet saved anywhere: uncommitted edits, half-applied decisions, open gotchas.
- If the user passed an argument, treat it as the next session's focus and tailor the document to it.
- Redact secrets and personal data (keys, connection strings, passwords). Say where to get them instead.

## Parent and first actions
The **parent** is the session the next session reports to: it starts lanes and receives their reports. It is a role, not a title. In the three-layer form the parent of a lane is the **Board Leader**, even when the Orchestrator wrote the handoff; with two layers it is the Orchestrator. See [topology](../../docs/pattern/topology.md).

Every handoff has a **Parent** section naming it:
- If this session will start the lane itself, it is this session.
- If this session is a lane handing its own work to a new session, it is this session's parent.
- If the handoff is written for another session to start (for example the Orchestrator writes it and the Board Leader starts the lane), it is the session that will start it.
- If none is known, ask the user once.

Name it by its **role title**, a stable session title that passes from one session in that role to its successor (for example "Board Leader"). Add its session id as a fallback. Do not write a process-level reference that changes when the app restarts.

The next session's **first actions** are always:
1. Read the clock with a command (`date "+%d-%m-%Y %H:%M"`).
2. Announce itself to the parent: session title, session id, working directory, which handoff it takes over (and which session it replaces, if any). Do not wait for a reply.

**When a lane replaces itself:** before you stop, message the parent once: "Handing over to a new session; handoff at `<path>`. Please don't send me new work." The new session's announcement reconnects the lane.

**When the session being replaced is the Orchestrator or the Board Leader itself:** use [/handover](../handover/SKILL.md) instead, so the role title, the open lanes and the shared status file move to the successor in one step.
