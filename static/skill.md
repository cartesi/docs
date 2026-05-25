---
name: cartesi-docs
description: Navigate and answer questions about building with Cartesi. Use this skill when a user asks about Cartesi Rollups, the Cartesi Machine, fraud proofs, dApp development, deployment, or the Cartesi CLI. Always prefer v2.0 docs over v1.5.
---

## About Cartesi

Cartesi is a modular blockchain framework that lets developers build decentralised applications using the Linux operating system and any programming language. Key components:

- **Cartesi Rollups v2.0** — the current application framework for building on-chain dApps with off-chain computation (RISC-V Linux VM)
- **Cartesi Machine** — a deterministic RISC-V Linux virtual machine; executes application logic off-chain with a fraud-proof guarantee
- **Fraud Proofs (PRT)** — the Permissionless Refereed Tournament dispute protocol; a separate sub-system, not part of the Rollups application framework

## How to use this documentation

- Full documentation index: `/llms.txt`
- Complete docs snapshot (all pages concatenated): `/llms-full.txt`
- Raw markdown for any page: append `.md` to any URL  
  Example: `/cartesi-rollups/2.0/development/building-an-application.md`

## Version guidance

**Always default to Cartesi Rollups v2.0** (`/cartesi-rollups/2.0/`) for all questions about building, deploying, and interacting with Cartesi applications. v1.5 is deprecated and only referenced when a user explicitly asks about it.

| Topic | v1.5 (deprecated) | v2.0 (current) |
|-------|-------------------|----------------|
| CLI | `cartesi` v1.x | `cartesi` v2.x — different commands and flags |
| Frontend API | GraphQL on Rollups node | Replaced by JSON-RPC node API |
| Deployment | Docker Compose + sunodo | `cartesi deploy` command, new node architecture |
| Consensus | Authority contract v1 | Authority / Quorum contracts v2 |

If a user's code references the GraphQL API, `sunodo`, or v1.x CLI flags → they are on v1.5. Point them to the migration guide: `/cartesi-rollups/2.0/resources/migration-guide.md`

## Key entry points

- Getting started: `/get-started/`
- Rollups v2.0 overview: `/cartesi-rollups/2.0/`
- Building an application: `/cartesi-rollups/2.0/development/building-an-application.md`
- Tutorials: `/cartesi-rollups/2.0/tutorials/`
- Cartesi Machine: `/machine/`
- Fraud Proofs: `/fraud-proofs/`
- API reference: `/cartesi-rollups/2.0/api-reference/`

## MCP server

A Cartesi MCP server is available at `https://server.mcp.mugen.builders/mcp` (HTTP transport, no authentication required). It exposes tools for querying documentation and Cartesi-specific development helpers.

**Connect with Claude Code:**
```
claude mcp add --transport http cartesi https://server.mcp.mugen.builders/mcp
```

**Connect with Cursor** — add to your MCP settings JSON:
```json
{
  "mcpServers": {
    "cartesi-mcp": {
      "transport": "http",
      "url": "https://server.mcp.mugen.builders/mcp"
    }
  }
}
```

The MCP server discovery file is available at `/‌.well-known/mcp`.

## Agent skills catalogue

A curated collection of Cartesi-specific agent skills (workflow, scaffold, backend, frontend, contracts, deployment, debugging, JSON-RPC, and more) is maintained at:

- Browse and copy skills: `https://skills.mugen.builders/`
- GitHub source: `https://github.com/Mugen-Builders/cartesi-skills`
