<p align="center">
  <img src="assets/logo.png" alt="Loop State Machine logo" width="420" />
</p>

# loop-state-machine.spec

Standalone specification repository for Loop State Machine (LSM), a proposed shared
loop interface for agent execution.

## Contents

- `SPEC.md` — primary behavioral specification and minimal CLI contract
- `lsm_engine.qnt` — Quint reference model for engine mechanics
- `lsm_policy_interactive.qnt` — Quint reference model for interactive completion
- `lsm_policy_ralph_wigum.qnt` — Quint reference model for staged delivery
- `lsm_policy_gan.qnt` — Quint reference model for adversarial generation with contract gating
- `lsm_policy_autoresearch.qnt` — Quint reference model for autonomous experiment loops
- `lsm_observer.qnt` — Quint reference model for observer events
- `references/` — LLM-friendly reference material for example agent runtimes

## Notes

- This repository contains the specification and reference artifacts only.
- The Quint models are reference design artifacts; consumers do not need to
  re-run verification unless they want to extend the models.
