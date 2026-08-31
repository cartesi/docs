> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: with-emergency-withdrawal
title: Self-hosted with Emergency Withdrawal
---

This guide runs a self-hosted node and deploys an application that supports [emergency withdrawal](../../development/emergency-withdrawal/overview.md): a guardian can foreclose it, and users can then recover their funds directly from the contracts. It follows the same flow as the [standard deployment](./standard.md), with a few additions. Read the [Foreclosure & Emergency Withdrawal overview](../../development/emergency-withdrawal/overview.md) first for the concept.

:::warning Production Warning
Like the standard setup, this is for development and testing on **testnet**, not production.
:::

## Prerequisites

In addition to the [standard prerequisites](./standard.md#prerequisites) (Cartesi CLI and Docker Desktop), you need:

- A **guardian** address. This account, and only this account, can foreclose the application.
- A **withdrawal output builder** for your token. For a single ERC-20, deploy one with the [`UsdWithdrawalOutputBuilderFactory`](../../api-reference/contracts/withdrawal/usd-withdrawal-output-builder-factory.md), or reuse an existing one for the same token. Note its address.
- An application whose guest maintains an **accounts drive** in a known layout. See [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md).

## Configure the machine and ledger (`cartesi.toml`)

For an application to support emergency withdrawal, its Cartesi Machine must include a dedicated **accounts drive**: a raw, unmounted flash drive that holds the balance ledger. You declare it in `cartesi.toml` alongside the root drive and size it to fit the account tree. `cartesi build` produces the final machine hash automatically. The guest writes balances into the drive using a ledger library, in a layout that matches the application's `WithdrawalConfig`.

Because those choices (the drive declaration, its size and position, and the record layout) belong to the guest application, they are documented once, in full, on the guest-requirements page. Set the drive up as described in [Creating the accounts drive](../../api-reference/backend/emergency-withdrawal.md#creating-the-accounts-drive) before continuing, and see [Keeping the balances](../../api-reference/backend/emergency-withdrawal.md#keeping-the-balances) for the ledger library.

## Configuration

Configure your `.env` file exactly as in the standard flow:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key"
CARTESI_AUTH_PRIVATE_KEY="<funded-private-key>"
BLOCKCHAIN_WS_ENDPOINT="<ws-endpoint>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK="<latest or finalized>"
```

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Your blockchain network ID                                           |
| `BLOCKCHAIN_WS_ENDPOINT`           | Your WebSocket endpoint                                              |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | Your HTTP endpoint                                                   |
| `AUTH_KIND`                        | Set to `private_key` for local development                           |
| `CARTESI_AUTH_PRIVATE_KEY`         | A funded private key for the selected chain                          |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | Set to either `latest` or `finalized`                               |

:::danger Security
Follow best practices when handling private keys during local development and deployment.
:::

## Prepare the withdrawal config

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

## Setting up the local node

1. **Download the Cartesi Rollups Node docker compose file in your project root:**

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/main/compose.local.yaml -o compose.local.yaml
   ```

   This is the same compose file used by the standard flow. It already includes the machine-tool service used later for recovery, so there is nothing extra to add.

2. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This compiles your application into RISC-V and creates a Cartesi machine snapshot locally. Make sure your application maintains its accounts drive in the layout described by `withdrawal.json`.

3. **Run the Cartesi Rollups Node with the application's initial snapshot attached:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

4. **Deploy and register the application with its withdrawal config:**

   Make the config file readable inside the `advancer` container, then deploy with `--withdrawal-config-file`:

   ```shell
   docker compose --project-name cartesi-rollups-node cp withdrawal.json advancer:/tmp/withdrawal.json

   docker compose --project-name cartesi-rollups-node \
      exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length 10 \
      --claim-staging-period <blocks> \
      --withdrawal-config-file /tmp/withdrawal.json \
      --salt <salt> \
      --register
   ```

   Replace `<app-name>` with your application name, `<blocks>` with the required claim-staging period, and `<salt>` with a unique identifier. You can generate a salt with `cast keccak256 "your-unique-string"`. The deployment is rejected if the config is invalid, meaning its accounts-drive layout does not fit the machine memory. A zero-valued config deploys an Application without emergency withdrawal.

   After this, your application is deployed and registered, and a guardian can foreclose it when needed.

## Recovery

When the operator is gone, the guardian forecloses and users withdraw directly from the contracts. The full procedure (foreclose, replay, prove the accounts drive, anchor the root, withdraw, and verify) is in the [Emergency Withdrawal Recovery Guide](../../development/emergency-withdrawal/recovery-guide.md).
