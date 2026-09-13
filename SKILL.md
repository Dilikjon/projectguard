---
name: ProjectGuard
description: Verification layer that helps AI agents confirm a task is truly complete before declaring it done. Provides runnable gates, evidence fingerprints, and project-level health checks.
version: 0.1.0
license: MIT
tags: [verification, gates, agent, done-check, project-health]
---

# ProjectGuard

Universal verification skill for AI coding agents. Before saying "done", run `pg-verify` to confirm gates pass.

## How to use

1. Copy `.projectguard.yaml` into your project.
2. Configure gates (`test.passes`, `lint.clean`, `file.exists`).
3. Run the verification CLI or invoke through your agent.

## Gates

- `file.exists` — required artifacts present
- `test.passes` — tests exit 0
- `lint.clean` — linter exit 0
- `evidence.fingerprint` — fingerprint saved evidence
- `custom` — user script

## Commands

- `pg-verify` — run all gates
- `pg-gate <name>` — run single gate
- `pg-status` — show last results
- `pg-report` — generate markdown report
