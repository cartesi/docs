---
title: Skills
resources:
  - url: https://agentskills.io/home
    title: Agent Skills standard
  - url: https://skills.mugen.builders/
    title: Browse and copy Cartesi skills
  - url: https://youtu.be/wep_ZEPKt8s
    title: Cartesi skills setup walkthrough
---

**Cartesi Skills** are lightweight, specialized instructions for AI agents. Each skill covers a focused task: scaffolding a new app, building backend logic, wiring a frontend, interacting with L1 contracts, or deploying to a self-hosted node.

Cartesi Skills follow the open [Agent Skills](https://agentskills.io/home) format. For a similar pattern in the broader Ethereum ecosystem, see [eth-skills](https://www.ethskills.com/).

## What's included

The current release ships **10 skills plus a workflow skill** that routes you to the right skill for each phase:

- **`cartesi-workflow`**: map a full-stack application build and pick the next skill
- **`cartesi-scaffold`**: create a new Rollups v2 app with `cartesi create`
- **`cartesi-backend-core`**: implement advance/inspect handlers and the `/finish` loop
- **`cartesi-backend-js-ts`**: build a JavaScript or TypeScript backend
- **`cartesi-backend-py`**: build a Python backend
- **`cartesi-frontend`**: wire wallet, InputBox, JSON-RPC, and inspect in a UI
- **`cartesi-contracts`**: write Solidity/Foundry contracts that call InputBox and portals
- **`cartesi-local-dev`**: run `cartesi build` / `cartesi run`, test locally or on a fork
- **`cartesi-jsonrpc`**: query a running node over JSON-RPC
- **`cartesi-deploy`**: deploy and operate a self-hosted rollups node
- **`cartesi-debug`**: diagnose errors across the stack

## Get started

### Install into your project

The recommended way to use Cartesi Skills is to install them into your project so your assistant loads them from `.agents/skills/` automatically.

From your project root, add the Cartesi skills package:

```shell
npx skills add Mugen-Builders/cartesi-skills
```

Confirm the skills appear under `.agents/skills/` (one folder per skill, each with a `SKILL.md`). Restart your editor or start a new agent session so the client picks up the new files. In your next prompt, name the skill you need (for example `cartesi-scaffold` or `cartesi-backend-js-ts`); see [Prompting](./prompting.md) for examples.

Watch the **[skills setup walkthrough](https://youtu.be/wep_ZEPKt8s)** for a full install-and-verify flow in Cursor or another Agent Skills-compatible client.

### Use skills with MCP or on their own

Once installed, you can still use skills in two ways:

- **Through the [Cartesi MCP server](./mcp-server.mdx)**: skills are bundled in the knowledge base and returned inline when your assistant queries the server, so you do not have to paste skill text into every chat.
- **On their own**: your assistant reads skill files directly from `.agents/skills/` when you name them in a prompt. You do not need to connect to the MCP server in this case.

### Browse and copy (optional)

If you prefer to inspect or copy a single skill without installing the full set, use [skills.mugen.builders](https://skills.mugen.builders/) to browse each skill and paste the content into your agent context.

### Source and contributions

The canonical source lives in the [cartesi-skills](https://github.com/Mugen-Builders/cartesi-skills) repository on GitHub. Open an issue or pull request there if you spot gaps, want a new skill, or have fixes to existing instructions. Contributions are welcome.

:::caution Early release
Cartesi Skills v0.1.0 is an early release for testing and feedback. Be cautious when using private keys or mainnet credentials with AI-assisted workflows.
:::
