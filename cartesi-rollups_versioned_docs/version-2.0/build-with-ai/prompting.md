---
title: Prompting
---

Effective prompting helps your AI assistant use Cartesi docs, skills, and the MCP server reliably. Clear prompts tell the assistant what to generate and which skill or doc source to follow.

## Anatomy of a strong prompt

The best prompts are as specific as possible. They pin the version, name the stack, define module boundaries, list deliverables, and state constraints. Your prompts should mirror that shape. Vague prompts make the assistant guess while risky prompts let it guess in places where guesses cost money, leak keys, or push bad code.

Use these three tiers as a quick check before sending a prompt.

### Effective: specific, scoped, version-aware

An effective prompt typically:

- Pins **Cartesi Rollups v2** and any relevant chain or network.
- Names the **skill(s)** to load and the **stack** (language, framework, package versions).
- Lists **deliverables** (folder structure, CLI commands, tests, inspect routes).
- States **constraints** (deterministic execution, module boundaries, reproducible simulation seeds where needed).
- Tells the assistant to **prepare commands for you to run**, not to execute them.

```text
Build a Cartesi Rollups v2 JavaScript app called "order-book".

Use cartesi-scaffold, cartesi-backend-core, cartesi-backend-js-ts, and
cartesi-contracts. Stack: JS template, Foundry for any L1 contracts, vanilla CSS
for any harness. Pin Cartesi alpha packages explicitly.

Deliverables:
- Folder structure: handlers/, validation/, inspect/, assets/.
- advance_state for new/cancel order; inspect routes for /book and /trades.
- README with exact cartesi build / run / send commands.
- Unit tests for handler validation and double-cancel prevention.

Constraints:
- Do not execute commands; print them for me to run.
- Use only v2 APIs (/cartesi-rollups/2.0/...).
- Reject malformed advances; never silently accept.
```

### Vague: missing version, stack, or deliverables

Vague prompts force the assistant to guess. It will often pick the wrong API version, the wrong template, or invent CLI flags.

Common symptoms: no v2 pin, no skill name, no stack, no description of what the answer should look like.

```text
Make me a Cartesi app for an order book. Add a frontend too.
```

Likely failure modes:

- Mixes v1 and v2 CLI commands.
- Picks a random template (Python? Rust? JS?) without asking.
- Skips inspect routes, validation, or tests.
- Ships a frontend pointed at the wrong port or chain ID.

### Risky: invites the agent into places it shouldn't go

A prompt is risky when it grants the agent power, secrets, or production scope without guardrails. These prompts can produce code or commands that move funds, leak keys, or silently deploy to the wrong network.

Watch for:

- Asking the agent to **execute** rather than **prepare** commands.
- Pasting **private keys**, **mnemonics**, or `.env` contents into the chat.
- Pointing at **mainnet** RPCs or keys "just for a quick test".
- Skipping **review** ("just commit and push it").
- Asking for **production deployment** from skills that are explicitly testnet-style.

```text
Deploy my Cartesi app to mainnet now. Here's my private key: 0xabc...
Use forge script and broadcast everything. Don't ask me to confirm anything.
Also commit and push to main when you're done.
```

What to do instead:

- Stay on **testnets** with **dev keys** while iterating.
- Ask the assistant to **print** CLI / `cast` / `forge` commands; you run them.
- Have it **diff and explain** changes before any commit.
- Read [Overview → Exercise caution](./overview.md#exercise-caution) before widening the agent's access.

## Prompt patterns

### Scaffold a new app

```text
Build a Cartesi Rollups v2 JavaScript app called "echo-app".

Use the cartesi-scaffold and cartesi-backend-js-ts skills. Scaffold with
cartesi create, implement advance/inspect handlers, and give me the exact
commands to build and run locally.
```

### Debug an issue

```text
My Cartesi advance handler rejects every input with status reject.
Use the cartesi-debug skill and Cartesi MCP to find relevant docs.
Show me what to check in my /finish loop and handler validation.
```

### Add a frontend

```text
Add a React frontend to my Cartesi Rollups v2 app using cartesi-frontend.
Wire wallet connect, send inputs via InputBox, and read state via JSON-RPC.
Use @cartesi/wagmi and @cartesi/viem.
```

### Deploy

```text
Walk me through self-hosted deployment for this Cartesi Rollups v2 app.
Use the cartesi-deploy skill and point me to the exact CLI and Docker steps.
```

## Application prompts

Use these prompts when you want practical, production-oriented building blocks instead of toy examples.

### Build a simple Cartesi wallet (multi-asset)

```text
Build a Cartesi Rollups v2 app called "cartesi-wallet" that behaves like a simple
custodial wallet inside the Cartesi machine.

Use cartesi-scaffold, cartesi-backend-core, and cartesi-backend-js-ts. Follow
Cartesi Rollups v2 asset handling for ETH, ERC-721, and ERC-1155 (single and
batch) portal deposits and withdrawals.

Requirements:
- Support deposits, internal balances, transfers, and withdrawals for:
  1) ETH
  2) ERC-721
  3) ERC-1155 single transfer
  4) ERC-1155 batch transfer
- Define canonical payload schemas for every action (deposit, transfer, withdraw).
- Implement advance handlers with strict validation and deterministic state updates.
- Expose inspect endpoints to query balances, owned NFTs, and transfer history.
- Include replay-safe idempotency rules for repeated messages.
- Add tests for happy path + invalid payloads + double-withdraw prevention.

Implementation guidance:
- Use Cartesi Rollups v2 docs only.
- Scaffold with Cartesi CLI and show exact commands.
- Keep code modular: assets/, ledger/, handlers/, validation/, serialization/.
- For token standards, follow OpenZeppelin interface semantics.
- Return a final checklist: local run, test execution, and next hardening steps.
```

### Build bonding curve math in Cartesi

```text
Create a Cartesi Rollups v2 module named "bonding-curve-engine" for pricing and
mint/burn settlement.

Use cartesi-scaffold, cartesi-backend-core, cartesi-backend-js-ts, and
cartesi-local-dev.

Requirements:
- Implement at least two curve types:
  1) Linear: P(s) = a + b*s (closed-form integral for buy/sell quotes)
  2) Non-linear (e.g. exponential): approximate buy/sell cost with Monte Carlo
     simulation inside the Cartesi machine (sample price paths or Riemann sums;
     document sample count, integration bounds, and convergence tolerance)
- Add quoteBuy(amount), quoteSell(amount), executeBuy, executeSell.
- Floating-point math is acceptable inside the Cartesi machine for simulation and
  curve evaluation; use a fixed RNG seed per input so results are reproducible
  across runs. Serialize on-chain-facing amounts (notices, vouchers, reports) in
  a deterministic integer encoding and document rounding toward the protocol.
- Define rounding policy (always round against trader) and document it.
- Enforce invariants: reserve solvency, monotonic price, non-negative supply.
- Add tests: closed-form checks for linear curves, Monte Carlo stability tests
  (same seed => same quote), and edge cases (zero amount, max supply).

Cartesi-specific constraints:
- Deterministic execution across nodes for a given input payload and machine state.
- Explicit serialization format for inputs/outputs.
- Inspect endpoints for quotes, reserves, supply, curve parameters, and last
  simulation metadata (samples used, seed, tolerance).

Output:
- Folder structure, implementation plan, and complete code.
- CLI commands to build, run, send sample inputs, and inspect state.
```

### Other DeFi essentials to prompt next

- **AMM core (x*y=k)**: swaps, LP mint/burn math, fee accounting, slippage checks
- **Lending risk engine**: collateral factors, health factor, liquidation thresholds
- **Perps/funding module**: mark/index price handling, funding-rate accrual, margin checks
- **Staking + rewards distributor**: epoch accounting, reward debt math, emergency withdraw
- **Treasury + timelock governance**: queued actions, execution delays, role-based controls 
