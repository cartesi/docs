---
id: with-emergency-withdrawal
title: Self-hosted with Emergency Withdrawal
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

This guide runs a self-hosted node and deploys an application that supports [emergency withdrawal](../../development/emergency-withdrawal/overview.md): a guardian can foreclose it, and users can then recover their funds directly from the contracts. It follows the same flow as the [standard deployment](./standard.md), with a few additions. Read the [Foreclosure & Emergency Withdrawal overview](../../development/emergency-withdrawal/overview.md) first for the concept.

:::warning Production Warning
Like the standard setup, this is for development and testing on **testnet**, not production.
:::

## Prerequisites

In addition to the [standard prerequisites](./standard.md#prerequisites) (Cartesi CLI and Docker Desktop), you need:

- A **guardian** address. This account, and only this account, can foreclose the application.
- A **withdrawal output builder** for your token. For a single ERC-20, deploy one with the [`UsdWithdrawalOutputBuilderFactory`](../../api-reference/contracts/withdrawal/usd-withdrawal-output-builder-factory.md), or reuse an existing one for the same token. Note its address.
- An application whose guest maintains an **accounts drive** in a known layout. A generic echo application cannot be withdrawal-enabled. See [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md).

## Configure the machine and ledger (`cartesi.toml`)

For an application to support emergency withdrawal, its Cartesi Machine must include a dedicated **accounts drive**: a raw, unmounted flash drive that holds the balance ledger. You declare it in `cartesi.toml` alongside the root drive, size it to fit the account tree, and enable `final_hash` so the machine hash is produced for deployment. The guest then writes balances into that drive using a ledger library, in a layout that matches the application's `WithdrawalConfig`.

Because those choices (the drive declaration, its size and position, and the record layout) belong to the guest application, they are documented once, in full, on the guest-requirements page. Set the drive up as described in [Creating the accounts drive](../../api-reference/backend/emergency-withdrawal.md#creating-the-accounts-drive) before continuing, and see [Keeping the balances](../../api-reference/backend/emergency-withdrawal.md#keeping-the-balances) for the ledger library.

Build the machine against the portal and token you will deposit on that chain. A template compiled for a different portal will reject deposits.

## Configuration

Configure your `.env` file exactly as in the [standard flow](./standard.md#configuration). Do **not** set a WebSocket endpoint with node alpha.12:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND=private_key
CARTESI_AUTH_PRIVATE_KEY=<funded-private-key>
BLOCKCHAIN_HTTP_ENDPOINT=<http-endpoint>
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK=latest
```

:::danger Security
Do not commit private keys. The guardian key used later for foreclosure can differ from `CARTESI_AUTH_PRIVATE_KEY`; keep both out of source control.
:::

## Prepare the withdrawal config

Create a `withdrawal.json` describing the guardian and the accounts-drive layout. All fields are required when withdrawal config is supplied. These values must match what your guest application actually writes (see [WithdrawalConfig](../../api-reference/contracts/withdrawal/withdrawal-config.md#drive-geometry)):

```json
{
  "guardian": "<guardian-address>",
  "log2_leaves_per_account": 0,
  "log2_max_num_of_accounts": 17,
  "accounts_drive_start_index": 0,
  "withdrawal_output_builder": "<withdrawal-output-builder-address>"
}
```

Derive `accounts_drive_start_index` from the stored machine. For a 4 MiB accounts drive:

```shell
jq -r '.config.flash_drive[] | select(.length == 4194304) | (.start / 4194304 | floor)' \
  .cartesi/image/config.json
```

Do not leave the index as a placeholder `0` unless that is the real value from `config.json`.

## Setting up the local node

1. **Download the compose file into the project root** (alongside `.cartesi/`):

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/main/compose.local.yaml -o compose.local.yaml
   ```

   This is the same compose file used by the standard flow. There is no separate machine-tool service: `cartesi-rollups-machine-tool` ships inside `cartesi/rollups-runtime` and is invoked with `docker compose … exec advancer` during recovery.

2. **Build the application snapshot:**

   ```shell
   cartesi build
   cartesi hash
   ```

   Make sure your application maintains its accounts drive in the layout described by `withdrawal.json`. Pass the printed template hash to deploy.

3. **Start the stack:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

4. **Deploy authority, then the application with its withdrawal config:**

   The combined self-hosted factory call (`deploy application` with no `--consensus`) currently reverts on alpha.12, with or without withdrawal config. Deploy the authority first, then the application against that consensus.

   Copy the config into the `advancer` container, then deploy:

   ```shell
   docker compose -f compose.local.yaml cp withdrawal.json advancer:/tmp/withdrawal.json

   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy authority --claim-staging-period <blocks>

   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --consensus <authority-address> \
      --epoch-length 10 \
      --salt <salt> \
      --template-hash <template-hash> \
      --withdrawal-config-file /tmp/withdrawal.json \
      --register
   ```

   Replace `<app-name>` with your application name, `<authority-address>` with the address from `deploy authority`, `<template-hash>` with the value from `cartesi hash`, and `<salt>` with a unique identifier (generate one with `cast keccak256 "your-unique-string"`). The deployment is rejected if the config is invalid, meaning its accounts-drive layout does not fit the machine memory. Omit `--withdrawal-config-file` entirely to deploy without emergency withdrawal.

5. **Commit the accounts-drive root every epoch:**

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli app execution-parameters set <app-name> snapshot_policy EVERY_EPOCH
   ```

   After this, your application is deployed and registered, and a guardian can foreclose it when needed.

## Recovery

When the operator is gone, the guardian forecloses and users withdraw directly from the contracts. The full procedure (foreclose, replay, prove the accounts drive, anchor the root, withdraw, and verify) is in the [Emergency Withdrawal Recovery Guide](../../development/emergency-withdrawal/recovery-guide.md).
