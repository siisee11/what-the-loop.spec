# Loop State Machine Spec

This document aims to define and implement the Loop State Machine (LSM) interface,
and to implement the LSM CLI as its minimal working implementation.

LSM ("Loop State Machine") is a proposed shared loop interface for agent execution.

This document is intentionally language- and runtime-agnostic. It defines only
the **behavioral contract** that an implementation must satisfy, without
prescribing classes, interfaces, method names, or language-specific mechanics.

The Quint models in this directory are reference artifacts for the design.
They have already been typechecked, simulated, and bounded-verified.
Implementers are not required to repeat these steps.

---

## Overview

LSM defines "how to run the loop" when executing a single agent task.
Three roles collaborate:

```
┌─────────────────────────────────────────────────────┐
│                      Run                            │
│                                                     │
│   ┌──────────┐   directive   ┌──────────┐           │
│   │  Engine  │ ◄──────────── │  Policy  │           │
│   │          │ ────────────► │          │           │
│   │loop ctrl │  turn outcome │ meaning  │           │
│   └────┬─────┘               └──────────┘           │
│        │ lifecycle events                           │
│        ▼                                            │
│   ┌──────────┐                                      │
│   │ Observer │  (logs, metrics, UI — read-only)     │
│   └──────────┘                                      │
└─────────────────────────────────────────────────────┘
```

- **Engine**: runs the loop. starts turns, enforces limits, terminates.
- **Policy**: decides meaning. interprets turn results and issues the next directive.
- **Observer**: notifies the outside world of state changes. does not affect execution.

The goal is to let different workflows share one engine while each using a different policy.

---

## Glossary

| Term | Description |
|------|-------------|
| **Run** | One LSM execution, from initialization to termination |
| **Turn** | One invocation of the agent runtime by the engine |
| **Directive** | The next action instruction issued by the policy to the engine |
| **Phase** | A semantically distinct stage within a run |
| **Terminal outcome** | The final result of a run: `completed` or `exhausted` |
| **Phase-scoped thread reuse** | A policy may either reuse the current logical thread for a phase or start a new one when entering a phase |
| **Compaction** | Context compression performed by the engine when context grows too large |
| **External wait** | A paused state while waiting for external input such as user action |
| **Hook** | An implementation-defined callback or equivalent mechanism derived from observer events to trigger host-side side effects |

---

## Three Roles

### Engine

The engine is responsible for **loop mechanics**.

Must do:
- Initialize the run and logical thread state
- Start turns and detect their completion
- Enforce iteration and retry limits
- Perform compaction when needed
- Create, reuse, or replace the active logical thread according to the policy's execution plan
- Terminate in a terminal state
- Notify observers of lifecycle events

Must not do:
- **Decide on its own** what a turn result means. That decision belongs to the policy.

### Policy

The policy is responsible for **workflow meaning**.

Must do:
- Define its own internal state
- Receive turn outcomes and decide the next directive
- Determine the current run state (continue, wait, retry, complete, etc.)
- Provide the execution plan for the next turn, including phase identity, prompt or instruction, and thread reuse mode
- Validate whether completion is allowed

Must not do:
- **Directly control execution mechanics** such as dispatching turns or invoking observers. The policy specifies intent; the engine performs the mechanics.

### Observer

The observer is a **passive listener**.

May receive notifications for:
- run start
- phase change
- thread started / reused
- turn start / finish
- wait entry
- terminal completion / exhaustion

May do: log, record metrics, update UI, write audit records, emit traces

An implementation may expose observer notifications through a hook system, but
such hooks remain observational and do not become a separate control role.

Must not do: control the execution flow. An observer's behavior must not be a
correctness dependency for the loop.

---

## Directives

Instructions issued by the policy to the engine. The engine treats them as authoritative.

| Directive | Meaning | When it occurs |
|-----------|---------|----------------|
| `continue` | Proceed to the next turn in the current phase | Turn completed normally and work can continue |
| `wait` | Wait for external input. No new turns may start | An external event such as user approval or input is needed |
| `retry` | Retry the last turn in the same phase | The turn failed but the error is recoverable |
| `compact` | Compress context before continuing | Context is too large to proceed as-is |
| `advance_phase` | Move to the next phase and install a new execution plan | The current phase goal is achieved and the next stage begins |
| `complete` | Terminate the run successfully | The policy has explicitly approved completion |

---

## Lifecycle

The full flow of a single run:

```
[Init]
  initialize engine state
  initialize policy state
  → emit run-start event

[Loop]
  is policy runnable?
  ├── no (waiting) → wait for external input → deliver input to policy → re-enter loop
  └── yes → start turn
               turn completes
               deliver result to policy
               receive directive
               ├── continue       → next turn (repeat loop)
               ├── wait           → enter waiting state
               ├── retry          → retry in same phase
               ├── compact        → compact then continue
               ├── advance_phase  → move to next phase, update prompt and thread plan, repeat loop
               └── complete       → [terminate: completed]

  iteration/retry limit reached → [terminate: exhausted]
```

An observer event is emitted on every transition.

---

## Engine-Policy Contract

### On Initialization

Before the first turn, the engine requests the initial state from the policy.
The initial policy state must define:

- Whether the run is immediately executable or requires phase initialization first
- Initial completion / wait / planning state
- The initial execution plan for the first turn

### Execution Plan

The policy must provide an execution plan for every runnable turn. The plan must
include at least:

- phase identity
- prompt or instruction content for the next turn
- thread mode: reuse current thread or start a new thread
- any optional execution metadata the host needs to interpret, such as prompt kind or sandbox class

The engine owns the actual thread lifecycle, but must honor the plan's thread mode.

### Before Each Turn

The engine checks the current execution context from the policy state:

- Can a turn start?
- Is the run in a waiting state?
- Is the run already terminal?
- What prompt or instruction should be sent for this turn?
- Should the current phase reuse the existing thread or start a new one?

### After Each Turn

The engine delivers the turn outcome to the policy. The policy responds with one of the directives above and, when needed, an updated execution plan for the next turn or phase.

### On Wait Resolution

When external input arrives after a `wait` directive, the engine delivers it to
the policy. The policy may return to a runnable state or remain blocked.

### Completion Validation

A run must not terminate as `completed` unless the policy explicitly issues `complete`.
If the policy rejects completion, the engine must continue or wait per the returned directive.

---

## Engine State Model

An implementation must represent the following states or their semantic equivalents:

```
idle → ready → turn started → turn running
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
          waiting              compacting          (directive handling)
              │                     │                     │
              └──────────────────── ┴──────────────────── ┘
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
                    completed               exhausted
```

Required invariants:

- iteration count must never exceed the configured maximum
- if the policy selects thread reuse for the current phase, thread identity must remain stable until the policy changes phase or requests a new thread
- prompt or instruction identity may change between turns; it must not be assumed constant across a whole run
- in waiting state, the current directive must be `wait`
- in completed state, the current directive must be `complete`

---

## Policy State Model

LSM does not restrict how policies are implemented. Any policy that satisfies
the directive contract may be freely defined.

The example policies in this repository are specified in Quint reference files.
Their detailed state machines, transitions, and invariants belong there rather
than in this document. Use the files below when you want the precise model:

- Interactive completion example — [lsm_policy_interactive.qnt](./lsm_policy_interactive.qnt)
- Ralph Wigum example — [lsm_policy_ralph_wigum.qnt](./lsm_policy_ralph_wigum.qnt)
- GAN-inspired planner / generator / evaluator example, inspired by Anthropic's March 24, 2026 article [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — [lsm_policy_gan.qnt](./lsm_policy_gan.qnt)
- Autoresearch example, inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch) — [lsm_policy_autoresearch.qnt](./lsm_policy_autoresearch.qnt)
- Ralph example inspiration source — [ghuntley.com/ralph](https://ghuntley.com/ralph/)

### Interactive Completion Policy (example)

Suitable for tasks that require waiting for user input or approval. See
[lsm_policy_interactive.qnt](./lsm_policy_interactive.qnt).

### Ralph Wigum Policy (example)

Suitable for tasks that must progress through ordered stages. See
[lsm_policy_ralph_wigum.qnt](./lsm_policy_ralph_wigum.qnt). Inspiration
source: [ghuntley.com/ralph](https://ghuntley.com/ralph/).

### GAN Policy (example)

Suitable for planner / generator / evaluator workflows that require an agreed
acceptance contract before generation starts. See
[lsm_policy_gan.qnt](./lsm_policy_gan.qnt). Inspiration source: Anthropic's
March 24, 2026 article [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps).

### Autoresearch Policy (example)

Suitable for autonomous experiment loops that prepare an environment, record a
baseline, propose one experiment, run it, and adjudicate the result before
continuing. See [lsm_policy_autoresearch.qnt](./lsm_policy_autoresearch.qnt).
Inspiration source: [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

---

## Observer Contract

Observers consume lifecycle events emitted by the engine.

Required guarantees:

- `run-start` must occur before any other event
- `turn-finished` count must never exceed `turn-started` count
- no non-terminal events may be emitted after a terminal event
- `completed` and `exhausted` are mutually exclusive within a single run

Each event payload is implementation-defined, but must carry enough information
for downstream consumers to correlate:

- run identity
- phase identity (if applicable)
- turn identity (if applicable)
- terminal outcome (if applicable)
- wait reason (if applicable)

---

## Hook Layer (Optional)

An implementation may expose observer events through a host-facing hook system.
This hook layer is optional and is not a fourth core role in LSM. It is a
projection of observer notifications into implementation-defined callbacks,
subscribers, handlers, or equivalent extension points.

The purpose of hooks is to trigger host-side side effects such as:

- logging
- metrics
- notifications
- UI refresh
- audit recording
- cleanup work

Required properties:

- hooks must be derived only from observer events or their semantic equivalents
- hook inputs must be observational snapshots of run state at the time of the event
- hooks must not choose directives, mutate policy meaning, or determine terminal validity
- hook failure, timeout, cancellation, or absence must not affect loop correctness
- implementations may execute hooks synchronously or asynchronously, but run correctness must not depend on hook completion
- if multiple hooks are bound to the same event, the dispatch order may be implementation-defined, but the implementation must document its behavior
- if an implementation exposes hook registration, unregistration, filtering, or fan-out semantics, those mechanisms are implementation-defined

Recommended event correspondences:

- run start → hook such as `onRunStarted`
- phase change → hook such as `onPhaseChanged`
- turn start / finish → hook such as `onTurnStarted` / `onTurnFinished`
- wait entry → hook such as `onWaitEntered`
- terminal completion / exhaustion → hook such as `onRunCompleted` / `onRunExhausted`

LSM does not prescribe API shapes, type systems, method names, callback
signatures, or delivery transports for hooks.

---

## Error Model

A run does not give up early. The engine and policy must keep finding ways to
proceed until a limit is reached.

LSM distinguishes two outcomes:

| Kind | Description | Engine behavior |
|------|-------------|-----------------|
| **Recoverable failure** | A turn failure that can be retried | Retry if policy issues `retry` |
| **Exhaustion** | Iteration or retry limit reached | Terminate as `exhausted` |

Even if they share the same internal exception mechanism, these two must be
distinguishable in external reporting.

---

## State Ownership

LSM does not require a specific persistence mechanism, but ownership must be clear:

| Owner | Owns |
|-------|------|
| **Engine** | loop control, iteration count, active thread lifecycle, retry/wait mechanics |
| **Policy** | workflow meaning, completion gating, phase ordering, prompt selection, and thread reuse boundaries |
| **Observer** | logs, metrics, UI, traces, audit records |
| **Hook layer (optional)** | implementation-defined callback registration and dispatch derived from observer events |

The engine must not depend on observer behavior. The policy may request
persistence through the host application.

---

## Model Scope

Properties verified by the current Quint models:

- iteration does not exceed the configured limit
- when a phase requests thread reuse, the active thread remains stable
- a phase transition may either reuse the current thread or start a new one
- completion requires explicit approval
- completion is not possible while waiting
- phase ordering is enforced (review only after delivery)
- no non-terminal events after a terminal event
- `turn-finished` count does not exceed `turn-started` count

Properties not verified by the current models:

- artifact contents
- SQL/query correctness
- git commit materialization
- browser/MFA interactions
- CLI rendering or log formatting
- hook delivery ordering, deduplication, or exactly-once behavior
- side effects triggered by implementation-defined hooks

---

## Files

- [lsm_engine.qnt](./lsm_engine.qnt)
- [lsm_policy_interactive.qnt](./lsm_policy_interactive.qnt)
- [lsm_policy_ralph_wigum.qnt](./lsm_policy_ralph_wigum.qnt)
- [lsm_policy_gan.qnt](./lsm_policy_gan.qnt)
- [lsm_policy_autoresearch.qnt](./lsm_policy_autoresearch.qnt)
- [lsm_observer.qnt](./lsm_observer.qnt)

---

# LSM CLI

The minimal implementation of the LSM interface. The goal is to implement the
LSM interface as a working CLI tool.

---

## Pre-Implementation Requirements

> **[Must ask the user before starting implementation]**
>
> The coding agent implementing this spec must ask the user the following two
> questions before beginning, while recommending the default choices below:
>
> 1. **"Which programming language would you like to use?"**
>    Recommended default: **Go**
>
> 2. **"Which agent runtime would you like to use?"**
>    Recommended default: **Codex App Server**
>    The answer determines the `TurnRunner` implementation and log output behavior.
>
> Begin implementation only after receiving answers to both questions.

---

## User Interface

### Running the CLI

```
lsm run
```

Flags:

| Flag | Description | Default |
|------|-------------|---------|
| `--max-iter` | Maximum number of iterations | 20 |
| `--max-retry` | Maximum retries per turn | 3 |

### Execution Flow

```
$ lsm run
> Enter your request: [user input]

[turn 1] running...
<agent runtime output>

[turn 2] running...
<agent runtime output>

Done: your request was completed successfully.
```

### Input

- The prompt is read from stdin at startup
- The initial user request is held constant as the root task for the entire run in the minimal CLI
- If the policy issues `wait`, the CLI must prompt for additional external input and deliver that input back to the policy before resuming
- Policies may still derive a different per-turn instruction or prompt wrapper from the root request plus any wait-resolution input that arrived later

### Log Output

- Print `[turn N] running...` at the start of each turn
- Stream agent runtime responses to stdout as they arrive
- Log verbosity may vary depending on the agent runtime implementation

### Exit

| Condition | Output | Exit code |
|-----------|--------|-----------|
| Completion detected | `Done: your request was completed successfully.` | 0 |
| Limit reached | `Stopped: maximum iterations reached.` | 1 |
| Interrupt (Ctrl+C) | `Stopped: user interrupt.` | 130 |

## Control Marker Protocol

### Overview

The policy detects control markers in the agent runtime's response to issue
directives. The agent runtime must include a marker when it determines that the
run should complete, wait for external input, or compact context before
continuing.

### Marker Formats

```
##LSM_DONE##
##LSM_WAIT##
##LSM_COMPACT##
```

- Position within the response does not matter (beginning, middle, or end)
- Case-sensitive
- At most one control marker may appear in a single turn response
- When detected, the remainder of the turn's response is still printed normally

Marker meanings:

| Marker | Directive |
|--------|-----------|
| `##LSM_DONE##` | `complete` |
| `##LSM_WAIT##` | `wait` |
| `##LSM_COMPACT##` | `compact` |

### Agent Runtime Instruction Requirement

The system prompt or instruction passed to the agent runtime must include:

```
When you determine that the task is fully complete, include ##LSM_DONE## at the
end of your response.

If you cannot continue until new external input arrives, include ##LSM_WAIT##.

If context should be compacted before the next turn, include ##LSM_COMPACT##.

Do not emit more than one control marker in the same response.
```

---

## SimpleLoopPolicy

The policy used by this CLI. Operates as a single loop with no phase distinction.

| Condition | Directive |
|-----------|-----------|
| Response contains `##LSM_DONE##` | `complete` |
| Response contains `##LSM_WAIT##` | `wait` |
| Response contains `##LSM_COMPACT##` | `compact` |
| Response contains multiple control markers | `retry` |
| Turn failed (error occurred) | `retry` |
| Otherwise | `continue` |

---

## Observer

The CLI registers an observer that handles the following events:

| Event | Action |
|-------|--------|
| `TurnStarted` | Print `[turn N] running...` |
| `TurnFinished` | Print agent response |
| `WaitEntered` | Print wait message, prompt for additional input, deliver input to policy |
| `CompactionStarted` | Print compaction message |
| `CompactionFinished` | Continue the run with compacted context |
| `RunCompleted` | Print completion message, exit 0 |
| `RunExhausted` | Print limit-reached message, exit 1 |

---

## Out of Scope

Items not covered by this CLI implementation:

- phase-based execution — future extension
- phase-scoped thread reuse — future extension
- rich multi-turn conversation UI/history presentation — delegated to agent runtime implementation
- authentication, config files — delegated to agent runtime implementation
