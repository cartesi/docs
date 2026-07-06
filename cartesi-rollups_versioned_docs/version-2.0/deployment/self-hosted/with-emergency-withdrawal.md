---
id: with-emergency-withdrawal
title: Self-hosted with Emergency Withdrawal
---

This guide builds on the [standard self-hosted deployment](./standard.md) and adds what is needed to support [emergency withdrawal](../../foreclosure/overview.md): deploying the application with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md), and adding the machine tool to your compose so you can generate withdrawal proofs later.

Follow the standard guide for the base setup (prerequisites, the `.env` file, downloading the compose file, and running the node). Only the differences are described here.

:::warning Production Warning
Like the standard setup, this is for development and testing on **testnet**, not production.
:::

## What is different

1. Your application must maintain an **accounts drive** so balances are provable from the machine state. See [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md).
2. You deploy the application with a **withdrawal config** instead of a plain deploy.
3. You add a **machine-tool** service to the same compose file, used to generate proofs during recovery.

## Extra prerequisites

- A **guardian** address. This account, and only this account, can foreclose the application.
- A **withdrawal output builder** for your token. For a single ERC-20, deploy one with the [`UsdWithdrawalOutputBuilderFactory`](../../api-reference/contracts/withdrawal/usd-withdrawal-output-builder-factory.md), or reuse an existing one for the same token. Note its address.
- An application whose guest maintains the accounts drive in a known layout.

## Step 1: Prepare the withdrawal config

Create a `withdrawal.json` describing the guardian and the accounts-drive layout. These values must match what your guest application actually writes (see [WithdrawalConfig](../../api-reference/contracts/withdrawal/withdrawal-config.md#drive-geometry)):

```json
{
  "guardian": "<guardian-address>",
  "log2_leaves_per_account": 0,
  "log2_max_num_of_accounts": 12,
  "accounts_drive_start_index": 309237645312,
  "withdrawal_output_builder": "<withdrawal-output-builder-address>"
}
```

## Step 2: Deploy with the withdrawal config

Deploy and register the application as in the standard guide, adding `--withdrawal-config-file`:

```shell
docker compose --project-name cartesi-rollups-node \
   exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
   --epoch-length 10 \
   --withdrawal-config-file withdrawal.json \
   --salt <salt> \
   --register
```

The deployment is rejected if the config is invalid (its accounts-drive layout does not fit the machine memory). A zero-valued config would deploy an application without emergency withdrawal, which is the standard case.

## Step 3: Add the machine tool to your compose

Recovery uses `cartesi-rollups-machine-tool` to reproduce the settled machine state and generate proofs. Add it as an extra service in the **same** `compose.local.yaml`, sharing the node's database and snapshot volumes, and run it on demand rather than keeping it up:

```yaml
  machine-tool:
    image: <same-runtime-image-as-the-node>
    entrypoint: ["cartesi-rollups-machine-tool"]
    depends_on:
      database:
        condition: service_healthy
    volumes:
      # share the node's snapshots and an output directory for the proofs
      - ./node-snapshots:/var/lib/cartesi-rollups-node/snapshot
      - ./artifacts:/artifacts
    environment:
      CARTESI_DATABASE_CONNECTION: <same-as-the-node>
```

You then invoke it with `docker compose ... run --rm machine-tool replay ...` and `... prove accounts-drive ...` during recovery.

## Step 4: Recovery

When the operator is gone, the guardian forecloses and users withdraw directly from the contracts. The full procedure (foreclose, replay, prove the accounts drive, anchor the root, withdraw, and verify) is in the [Emergency Withdrawal Recovery Guide](../../foreclosure/recovery-guide.md).
