---
title: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

AI coding assistants can scaffold, implement, and debug Cartesi applications quickly, but without Cartesi-specific context they often guess CLI flags, mix up v1 and v2 APIs, or invent workflows.

Using the right tools, you get faster iteration-handlers, contracts, and frontends from natural-language prompts-and less context switching, with version-aware CLI commands and doc links inline instead of hunting through tabs. This section gives your assistant structured knowledge and tools to build and ship applications quickly and reliably.

## How it works

Multiple pieces work together to learn and build with AIs:

1. **[Documentaion](#documentation-indexing-and-usage)**: Usage of [llms.txt](https://docs.cartesi.io/llms.txt) gives your assistant a machine-readable index of all Cartesi docs.
2. **[MCP server](./mcp-server.mdx)**: Connects your editor to curated Cartesi docs, repos, articles, and skills.
3. **[Skills](./skills.md)**: Loads focused instructions (scaffold, backend, frontend, deploy, debug)
4. **[Prompting](./prompting.md)**: Interactive way to put the knowledge and skills of the AI assistant in practice.

## Documentation indexing and usage

Cartesi docs publish machine-readable indexes so AI assistants can discover pages and fetch raw Markdown without scraping HTML. Use these files when your client does not have MCP connected, or when you want a lightweight doc dump in context.

### Documentation index

Fetch the complete documentation index at: [https://docs.cartesi.io/llms.txt](https://docs.cartesi.io/llms.txt)

`llms.txt` lists every indexed page with links to raw Markdown sources, version-priority notes (default to Rollups v2.0), and a documentation map. Agents should read this file first to discover which pages to fetch for a given task.

### Per-page Markdown

Any docs page can be fetched as Markdown by appending `.md` to its URL. For example:

- Page: `https://docs.cartesi.io/cartesi-rollups/2.0/build-with-ai/overview`
- Source: `https://docs.cartesi.io/cartesi-rollups/2.0/build-with-ai/overview.md`

On any docs page, use the **Copy page** widget in the table of contents sidebar to copy the page as Markdown, open the `.md` URL directly, or send the link to ChatGPT, Claude, or Gemini. Use this when you need a single page in context instead of the full corpus.

### Full documentation file

If your AI tool does not support MCP yet, you can use a static documentation file instead. This gives your assistant the entire Cartesi documentation corpus as one text file.

Download or reference: [https://docs.cartesi.io/llms-full.txt](https://docs.cartesi.io/llms-full.txt)

### Setup Static Documentation

<Tabs groupId="static-docs-client" values={[
  { label: 'Cursor', value: 'cursor' },
  { label: 'Claude Code', value: 'claude' },
  { label: 'Codex', value: 'codex' },
  { label: 'Claude Desktop', value: 'claude-desktop' },
  { label: 'VS Code Copilot', value: 'vscode' },
]} defaultValue="cursor">

<TabItem value="cursor">

[Cursor](https://cursor.com/) can index external documentation for `@docs` references in chat.

1. Open **Cursor Settings** → **Indexing & Docs** → **Docs**.
2. Click **Add new doc** and paste: `https://docs.cartesi.io/llms-full.txt`
3. In chat, reference the docs source (for example `@docs` → your Cartesi entry) when you want the assistant to ground answers in official documentation.

For live Cartesi-specific tools (CLI commands, skills, repo search), also connect the [MCP server](./mcp-server.mdx).

</TabItem>

<TabItem value="claude">

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) can include static doc files in a session.

1. Download the static documentation file from [https://docs.cartesi.io/llms-full.txt](https://docs.cartesi.io/llms-full.txt), or fetch the index at [https://docs.cartesi.io/llms.txt](https://docs.cartesi.io/llms.txt) and pull individual `.md` pages as needed.
2. Save the file in your project directory or another known location.
3. Reference it in chat with `/read` or by attaching the file path so Claude Code has Cartesi documentation for that session.

For ongoing work, add the Cartesi MCP server to your project's `.mcp.json` (see [MCP server](./mcp-server.mdx)) so lookups stay current without re-downloading `llms-full.txt`.

</TabItem>

<TabItem value="codex">

[Codex CLI](https://github.com/openai/codex) loads an `AGENTS.md` file from your project root into context for every session.

1. Download the static documentation file to your project:

   ```shell
   curl -fSL https://docs.cartesi.io/llms-full.txt -o docs/cartesi-llms-full.txt
   ```

2. Add a pointer in `AGENTS.md` at the repo root so Codex grounds answers in Cartesi docs:

   ```md
   # Cartesi context

   This project targets **Cartesi Rollups v2**. When answering questions or
   generating code:

   - Read `docs/cartesi-llms-full.txt` for the full Cartesi documentation corpus.
   - Default to `/cartesi-rollups/2.0/` routes; do not surface v1.x APIs unless asked.
   - Prefer fetching individual pages from `https://docs.cartesi.io/<path>.md` when
     you need fresh, focused context.
   ```

3. In a session, reference the file directly with `@docs/cartesi-llms-full.txt` when you want the assistant to ground a specific answer in docs.

For live tooling, also connect the [MCP server](./mcp-server.mdx).

</TabItem>

<TabItem value="claude-desktop">

[Claude Desktop](https://claude.ai/download) supports **Projects** with persistent knowledge files.

1. Download the static documentation file: [https://docs.cartesi.io/llms-full.txt](https://docs.cartesi.io/llms-full.txt)
2. In Claude Desktop, create a new **Project** (for example, "Cartesi Rollups v2").
3. Open **Project knowledge** and upload `llms-full.txt` (rename to `cartesi-llms-full.txt` if you keep multiple sources).
4. Add a short **Project instructions** entry such as:

   > Default to Cartesi Rollups v2.0. Use the attached `cartesi-llms-full.txt` as the source of truth. Do not surface v1.x APIs unless explicitly asked.

5. Start a new chat inside the project; Claude will ground answers in the uploaded docs.

For live tools (CLI commands, skills, repo search), connect the [MCP server](./mcp-server.mdx) in Claude Desktop's MCP config.

</TabItem>

<TabItem value="vscode">

[GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview) reads custom instructions from `.github/copilot-instructions.md` and lets you attach files to chat with `#file:`.

1. Download the static documentation file into your repo:

   ```shell
   curl -fSL https://docs.cartesi.io/llms-full.txt -o docs/cartesi-llms-full.txt
   ```

2. Create `.github/copilot-instructions.md` (or extend the existing one) with a Cartesi grounding block:

   ```md
   This repository builds on **Cartesi Rollups v2**.

   - Use `docs/cartesi-llms-full.txt` as the source of truth for Cartesi APIs,
     CLI commands, and deployment.
   - Default to `/cartesi-rollups/2.0/` routes; ignore v1.x guidance unless asked.
   - When generating CLI steps, prepare commands for the user to run locally.
   ```

3. In Copilot Chat, attach the file on demand with `#file:docs/cartesi-llms-full.txt` when you want the assistant to cite specific Cartesi docs.

For live, version-aware tooling, also connect the [MCP server](./mcp-server.mdx) via VS Code's MCP support.

</TabItem>

</Tabs>

Alternatively, you can use the [Cartesi MCP server](./mcp-server.mdx) to get the latest documentation and skills.

## Best Practices

AI-assisted development is powerful, but it is not a substitute for good engineering judgment. Treat every generated command, dependency, and deployment step as untrusted until you understand and verify it.

### Security

- **Never paste private keys, mnemonics, or production secrets into prompts.** Use testnet keys, local dev accounts, and environment variables your assistant never sees.
- **Review before you run.** Agents can propose shell commands, config changes, or contract deployments that look correct but are wrong or harmful. Read diffs and commands before approving them.
- **Audit generated code.** Especially for Solidity, wallet flows, and anything that moves funds. AI can miss edge cases, use deprecated APIs, or introduce subtle bugs.
- **Trust your toolchain.** Only install MCP servers, skills, and editor plugins from sources you recognize. A malicious plugin or MCP server could exfiltrate files, env vars, or keys from your machine.
- **Limit blast radius.** Prefer testnets and disposable wallets for AI-assisted deployment. Do not point agents at mainnet credentials or production infrastructure.

### Costs and model quality

- **Free or lightweight models** are fine for boilerplate and docs lookup, but they hallucinate more often and struggle with multi-step Cartesi workflows.
- **Frontier models** (paid tiers) are usually better at following skills, chaining CLI steps, and debugging but usage-based billing adds up quickly on long agent sessions.
- **Token usage grows fast** when you attach large repos, full doc dumps, or long chat histories. Scope context to what the task needs.

### Agent access and sandboxing

- **Agents may read and write files, run terminals, and call MCP tools** depending on your client settings. Understand what your editor allows before enabling auto-run or broad file access.
- **Use sandboxing where your client supports it**: restrict network access, require approval for terminal commands, and avoid giving an agent unrestricted access to your home directory or `.env` files.
- **The Cartesi MCP server is read-only**, but other MCP servers or built-in tools in your client may not be. Review every MCP server you connect.
- **Separate dev from production.** Do not run AI agents in directories that contain production keys, customer data, or unreleased IP you cannot afford to leak.

### Other limitations

- **Models can still guess.** Even with the Cartesi MCP server and skills, assistants may mix API versions, invent flags, or skip steps. Cross-check against official docs.
- **Early-release tooling.** Cartesi Skills and the MCP server are evolving; expect gaps, breaking changes, and incomplete coverage.
- **You own the outcome.** AI speeds up scaffolding and iteration; shipping safely still requires tests, manual review, and your own deployment discipline.