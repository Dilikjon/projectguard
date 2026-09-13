# ProjectGuard

Universal verification layer for AI coding agents — helps confirm a task is truly complete before declaring it done.

## What is ProjectGuard?

ProjectGuard is an open-source skill and CLI tool that runs verification gates (file checks, tests, lint) on your project before you say "done". It provides a standard, agent-agnostic way to verify task completion.

## Why ProjectGuard?

AI coding agents are increasingly capable, but they often skip verification steps. ProjectGuard gives them a uniform, configurable checklist to confirm all required work is finished before reporting success.

## Features

- **Runnables gates**: `file.exists`, `test.passes`, `lint.clean`
- **Agent-agnostic**: Works with Claude Code, Cursor, Roo Code, Goose, and any agent that runs Node.js commands
- **Zero dependencies**: Built on Node.js built-in modules only
- **Simple config**: Single `.projectguard.yaml` file
- **Evidence capture**: Timestamps and file lists for each gate

## Quick Start

```bash
# Run verification on current project
node src/cli/pg-verify.js

# Run unit tests
node tests/run.js
```

## Configuration

Create `.projectguard.yaml` in your project root:

```yaml
project: my-project
language: typescript
agent: generic
gates:
  - name: file.exists
    enabled: true
    files:
      - SKILL.md
      - README.md
      - src/index.js
  - name: test.passes
    enabled: true
    command: "npm test"
  - name: lint.clean
    enabled: true
    command: "npm run lint"
```

Or use the example config as a starting point: `.projectguard.yaml.example`

## Supported Agents

- Claude Code
- Cursor
- Roo Code
- Goose
- OpenHands
- Any agent that can run Node.js commands

## Project Structure

```
projectguard/
├── SKILL.md                  # Agent skill definition
├── README.md                 # This file
├── LICENSE                   # MIT License
├── .gitignore                # Git ignore rules
├── .projectguard.yaml        # Active config (create from .example)
├── .projectguard.yaml.example # Example config
├── src/
│   ├── cli/pg-verify.js      # Main CLI command
│   └── gates/                # Verification gates
│       ├── file.exists.js    # Check files exist
│       ├── test.passes.js    # Run tests
│       └── lint.clean.js     # Run linter
└── tests/
    ├── run.js                # Unit tests
    └── fixtures/demo-project/ # Demo project
```

## Running Tests

```bash
node tests/run.js
```

## Roadmap

- v0.1.0 — MVP with 3 core gates and CLI
- Future — additional gates (doc.covers, evidence.fingerprint), agent integrations, config schema validation

## License

MIT — see [LICENSE](LICENSE) for details.
