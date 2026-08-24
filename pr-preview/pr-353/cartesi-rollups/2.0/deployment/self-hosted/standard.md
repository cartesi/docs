> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: standard
title: Self-hosted deployment (standard)
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing on **testnet**.

:::warning Production Warning
**Do not use this compose file as a production deployment.**

It is a testnet-oriented starting point. It does not include public snapshot verification, production-grade secrets, high availability, or hardened Postgres.
:::

## Prerequisites

- Cartesi CLI 2.0
- Docker Desktop 4.x (Compose and Buildx)

See [installation](../../development/installation.md).

## Configuration

Create a `.env` file in the project root:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND=private_key
CARTESI_AUTH_PRIVATE_KEY=<funded-private-key>
BLOCKCHAIN_HTTP_ENDPOINT=<http-endpoint>
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK=latest
```

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Chain ID of the target network                                       |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | HTTP JSON-RPC endpoint for the base layer                            |
| `AUTH_KIND`                        | `private_key` for local and testnet experiments                      |
| `CARTESI_AUTH_PRIVATE_KEY`         | Funded private key for the selected chain                            |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | `latest` for testnet tip-tracking; `finalized` for reorg-safe reads  |

The EVM reader polls HTTP only. Do **not** set `BLOCKCHAIN_WS_ENDPOINT` or `CARTESI_BLOCKCHAIN_WS_ENDPOINT` with alpha.12: a blank or missing WS value crashes `evm-reader`.

Factory addresses default to cartesi-rollups 3.0.0-alpha.6 in the compose file. Override them in `.env` only if you are not using that suite.

:::danger Security
Do not commit private keys. Use Docker secrets or a file-backed key in any environment that is not a throwaway testnet.
:::

## Setting up the local node

1. **Download the compose file into the project root** (alongside `.cartesi/`):

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/main/compose.local.yaml -o compose.local.yaml
   ```

2. **Build the application snapshot:**

   ```shell
   cartesi build
   cartesi hash
   ```

   `cartesi build` writes the machine to `.cartesi/image/`. `cartesi hash` prints the template hash (`0x…`). Current CLI snapshots do not write `.cartesi/image/hash`, which `cartesi-rollups-cli` still reads by default, so pass `--template-hash` in the deploy step.

3. **Start the stack:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   docker compose -f compose.local.yaml exec advancer cartesi-rollups-node --version
   ```

   Expect `cartesi-rollups-node version 2.0.0-alpha.12`. All six services should be running.

4. **Deploy and register the application:**

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length 10 \
      --salt <salt> \
      --template-hash <template-hash> \
      --register
   ```

   Replace `<app-name>` with the application name and `<template-hash>` with the value from `cartesi hash`. The salt must be unique. Generate one with:

   ```shell
   cast keccak256 "your-unique-string"
   ```

   On success the command prints the application contract address and registers the app on the node.

   If the combined self-hosted factory deploy fails with `execution reverted`, fall back to deploying authority and application separately (see below). Emergency-withdrawal apps should use that two-step path from the start; see [Deployment with emergency withdrawal](./with-emergency-withdrawal.md).

   ### Manual deployment fallback

   1. Deploy an authority with the CLI (preferred) or with `cast`. With the CLI:

      ```shell
      docker compose -f compose.local.yaml exec advancer \
         cartesi-rollups-cli deploy authority --claim-staging-period <blocks>
      ```

      Or with `cast` (capture the returned address; the `sed` call normalizes it):

      ```shell
      cast send <AuthorityFactory-Address> "newAuthority(address,uint256,uint256)" <Application-Owner-Address> \
      10 <claimStagingPeriod> --private-key <PRIVATE-KEY> --rpc-url <RPC-URL> \
      --json | jq -r '.logs[-1].data' | sed 's/^0x000000000000000000000000/0x/'
      ```

      `claimStagingPeriod` is the number of base-layer blocks that must elapse after a claim is staged before it can be accepted. Factory addresses are listed under **Deployed contracts** below.

   2. Deploy the application against that authority:

      ```shell
      docker compose -f compose.local.yaml exec advancer \
         cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
         --epoch-length 10 \
         --consensus <Authority-contract> \
         --salt <salt> \
         --template-hash <template-hash> \
         --register
      ```

      On success the command returns the application contract address.

## Deployed contracts

This node version uses **cartesi-rollups 3.0.0-alpha.6**. Infrastructure addresses are identical on Ethereum, Optimism, Arbitrum, and Base (mainnet and Sepolia). Only `BLOCKCHAIN_ID` and the HTTP RPC URL change per chain.

| Contract | Address |
| :-- | :-- |
| InputBox | `0x346B3df038FE9f8380071eC6514D5a83aD143939` |
| AuthorityFactory | `0x3C1FE01c542a88A523FF6847eD1E26176c8C4ED0` |
| ApplicationFactory | `0xC549F89cF1ca43eDDECC64Ac2208F4b283B1c483` |
| SelfHostedApplicationFactory | `0x6145C5996a71a379E030aEb0440df79D60833418` |
| QuorumFactory | `0x1f94009389F408B8D0ADfFcF8BBDCe5552BaCa5F` |
| ERC20Portal | `0x22E57511C30CcE6CDaa742E13CE3b774fDC663b1` |

Rollups contract deployment addresses are also published with each [rollups-contracts release](https://github.com/cartesi/rollups-contracts/releases) as `cartesi-rollups-contracts-<version>-deployment-addresses.tar.gz`. Use the suite that matches the node you run; API reference pages may track a newer contracts alpha than this compose pin.

## Accessing the node

Once running, your local Cartesi Rollups Node will be accessible through the standard APIs:

- Inspect endpoint: `http://localhost:10012/inspect/<application-address-or-name>`

```shell
curl -s -X POST "http://localhost:10012/inspect/<application-address-or-name>" \
  -H "Content-Type: application/json" \
  -d '{"payload":"0x"}'
```

- JSON-RPC is `http://localhost:10011/rpc`:

```shell
curl -s -X POST http://localhost:10011/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cartesi_listInputs","params":["<app-name>"],"id":1}'
```
