<p align="center">
  <img src="assets/logo.png" alt="What The Loop logo" width="420" />
</p>

# what-the-loop.spec

Standalone specification repository for WhatTheLoop (WTL), a proposed shared
loop interface for agent execution.

## Contents

- `SPEC.md` — primary behavioral specification and minimal CLI contract
- `wtl_engine.qnt` — Quint reference model for engine mechanics
- `wtl_policy.qnt` — Quint reference model for policy behavior
- `wtl_observer.qnt` — Quint reference model for observer events
- `references/` — LLM-friendly reference material for example agent runtimes

## Notes

- This repository contains the specification and reference artifacts only.
- The Quint models are reference design artifacts; consumers do not need to
  re-run verification unless they want to extend the models.
