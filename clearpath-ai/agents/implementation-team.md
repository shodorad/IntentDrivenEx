# ClearPath AI — Implementation Team

## Team Overview

This is an automated agent team that implements the ClearPath AI demo based on the plan in `IMPLEMENTATION_PLAN.md`. The team operates in a loop: an orchestrator reads a shared task tracker, spawns the right agent for the next task, and monitors progress until all tasks are complete.

---

## Team Members

| Role | File | Responsibility |
|------|------|----------------|
| **Orchestrator** | `orchestrator.md` | Reads the task tracker. Spawns dev or QA agents as needed. Monitors progress. Loops until all tasks are done. |
| **Dev Agent** | `dev-agent.md` | Implements a single task: writes code, edits components, updates styles. Updates the task tracker when done. |
| **QA Agent** | `qa-agent.md` | Validates a completed dev task: runs build, checks acceptance criteria, reads code for correctness. Updates the task tracker with pass/fail. |

---

## Process Flow

```
┌─────────────────────────────────────────────────────┐
│                   ORCHESTRATOR                       │
│  1. Read task-tracker.md                            │
│  2. Find next task with status: pending             │
│  3. Check task type:                                │
│     - If type = "dev"  → Spawn Dev Agent            │
│     - If type = "qa"   → Spawn QA Agent             │
│  4. Wait for agent to complete                      │
│  5. Re-read task-tracker.md                         │
│  6. If failed QA → re-queue dev task                │
│  7. Repeat until all tasks = done                   │
│  8. If no tasks pending → check again in 30 min     │
└─────────────────────────────────────────────────────┘
        │                           │
        ▼                           ▼
┌──────────────┐           ┌──────────────┐
│  DEV AGENT   │           │  QA AGENT    │
│              │           │              │
│ - Read task  │           │ - Read task  │
│ - Read plan  │           │ - Run build  │
│ - Edit code  │           │ - Check code │
│ - Run build  │           │ - Test criteria│
│ - Update     │           │ - Update     │
│   tracker    │           │   tracker    │
│   → done     │           │   → pass/fail│
└──────────────┘           └──────────────┘
```

---

## Task Lifecycle

Each task goes through these states:

```
pending → in-progress → dev-complete → qa-in-progress → done
                                                      → qa-failed → pending (re-queued)
```

| Status | Meaning |
|--------|---------|
| `pending` | Ready to be picked up by the next available agent |
| `in-progress` | Dev agent is currently working on it |
| `dev-complete` | Dev work done, waiting for QA |
| `qa-in-progress` | QA agent is currently validating |
| `done` | QA passed, task is complete |
| `qa-failed` | QA found issues — task re-queues as pending with failure notes |

---

## File Locations

All paths relative to `clearpath-ai/`:

| File | Path |
|------|------|
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Task Tracker | `agents/task-tracker.md` |
| Orchestrator Prompt | `agents/orchestrator.md` |
| Dev Agent Prompt | `agents/dev-agent.md` |
| QA Agent Prompt | `agents/qa-agent.md` |
| Project Context | `../CLAUDE.md` |
| Feedback Reference | `FEEDBACK_REVIEW.md` |

---

## Rules

1. **One task at a time.** Only one dev or QA agent runs at a time. The orchestrator waits for completion before spawning the next.
2. **Dev before QA.** Every dev task gets a QA pass before the phase is considered done.
3. **QA failures re-queue.** If QA fails, the task goes back to `pending` with failure notes appended. The dev agent must address the notes.
4. **30-minute check interval.** If no tasks are pending or in-progress, the orchestrator checks again after 30 minutes.
5. **Phase ordering.** Tasks within a phase can run in any order. Phases run in sequence (Phase 1 before Phase 2, etc.).
6. **Tracker is the source of truth.** Agents MUST read the tracker before starting and update it when finishing. No work happens off-tracker.
7. **Build must pass.** Dev agent must verify `npm run build` succeeds before marking a task as `dev-complete`. If build fails, the task stays `in-progress`.
8. **No scope creep.** Agents only do what the task says. If they discover additional work needed, they add a note to the tracker but don't do the work.

---

## How to Start

Invoke the orchestrator by reading `orchestrator.md` and following its instructions. It will handle everything from there.

```
1. Read agents/orchestrator.md
2. Follow the orchestrator prompt
3. It will read the tracker and start spawning agents
```
