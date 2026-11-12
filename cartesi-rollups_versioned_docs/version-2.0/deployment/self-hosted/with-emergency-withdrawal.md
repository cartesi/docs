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

For an application to support emergency withdrawal, its Cartesi Machine must include a dedicated **accounts drive**: a raw, unmounted flash drive that holds the balance ledger. You declare it in `cartesi.toml` alongside the root drive and size it to fit the account tree. `cartesi build` stores the machine with its final hash, which deployment needs. The guest then writes balances into that drive using a ledger library, in a layout that matches the application's `WithdrawalConfig`.

Because those choices (the drive declaration, its size and position, and the record layout) belong to the guest application, they are documented once, in full, on the guest-requirements page. Set the drive up as described in [Creating the accounts drive](../../api-reference/backend/emergency-withdrawal.md#creating-the-accounts-drive) before continuing, and see [Keeping the balances](../../api-reference/backend/emergency-withdrawal.md#keeping-the-balances) for the ledger library.

## Configuration

Configure your `.env` file exactly as in the standard flow. This guide assumes the same versions: rollups-node v2.0.0-alpha.14 and rollups-contracts v3.0.0-alpha.10.

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key"
CARTESI_AUTH_PRIVATE_KEY="<funded-private-key>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK="finalized"
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS="<InputBox-address>"
CARTESI_CONTRACTS_AUTHORITY_FACTORY_ADDRESS="<AuthorityFactory-address>"
CARTESI_CONTRACTS_QUORUM_FACTORY_ADDRESS="<QuorumFactory-address>"
CARTESI_CONTRACTS_APPLICATION_FACTORY_ADDRESS="<ApplicationFactory-address>"
CARTESI_CONTRACTS_SELF_HOSTED_APPLICATION_FACTORY_ADDRESS="<SelfHostedApplicationFactory-address>"
```

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Your blockchain network ID                                           |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | Your HTTP endpoint                                                   |
| `AUTH_KIND`                        | Set to `private_key` for local development                           |
| `CARTESI_AUTH_PRIVATE_KEY`         | A funded private key for the selected chain. It deploys the application and pays for every claim, so it must stay funded |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | Use `finalized` (the node's default). See [Block policy](./standard.md#configuration) in the standard flow |
| `CARTESI_CONTRACTS_*`              | Addresses of the rollups-contracts v3.0.0-alpha.10 contracts on your chain, see [Deployed Contracts](./standard.md#deployed-contracts) |

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

:::warning Check the config against your machine
Nothing on chain or in the node CLI checks that this config points at your template's accounts drive: deployment only checks that the drive fits in the machine's memory. A wrong value can make every withdrawal and refund fail, or make withdrawals pay out balances that are not your application's ledger.

After `cartesi build` (step 2 below), check the config against the stored machine configuration in `.cartesi/image/config.json`. One of the drives listed under `config.flash_drive` must have:

- `start` equal to `accounts_drive_start_index × 2^(5 + log2_max_num_of_accounts + log2_leaves_per_account)`. For the example above, that is `0x90000000000000` (`40532396646334464`).
- `length` of at least `2^(5 + log2_max_num_of_accounts + log2_leaves_per_account)`. For the example above, that is `131072` bytes.

The recovery tool, `cartesi-rollups-machine-tool`, locates the accounts drive the same way.
:::

## Setting up the local node

1. **Download the Cartesi Rollups Node docker compose file in your project root:**

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/98847c19660b46cd9f1b1c8ff9f8cf7f88039f98/compose.local.yaml -o compose.local.yaml
   ```

   This is the same compose file used by the standard flow. Update its image tags as described in the standard flow ([Setting up the local node](./standard.md#setting-up-the-local-node)) before you start it. The compose file has no separate service for the recovery tools; see the [Emergency Withdrawal Recovery Guide](../../development/emergency-withdrawal/recovery-guide.md) for what recovery needs.

2. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This compiles your application into RISC-V and creates a Cartesi machine snapshot locally. Make sure your application maintains its accounts drive in the layout described by `withdrawal.json`, and that the snapshot is built with the emulator version of your node release (see step 2 of the [standard flow](./standard.md#setting-up-the-local-node)).

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
      --epoch-length <epoch-length> \
      --claim-staging-period <claim-staging-period> \
      --withdrawal-config-file /tmp/withdrawal.json \
      --salt <salt> \
      --register
   ```

   Replace `<app-name>` with your application name and `<salt>` with a unique identifier (generate one with `cast keccak256 "your-unique-string"`). The CLI rejects the config if a key is missing, if the guardian or the withdrawal output builder is the zero address, or if the accounts drive does not fit the machine memory. It does not check that the config matches your machine (see the warning above). To deploy without emergency withdrawal, omit `--withdrawal-config-file`, as in the standard flow.

   `--claim-staging-period` is the number of blocks between a claim being staged and the earliest block it can be accepted, and it is the guardian's window to foreclose the application before a claim takes effect. Set it above the time your guardian needs to notice a problem and get the foreclosure transaction included. The default, 0, allows a claim to be accepted as soon as it is staged, which leaves the guardian no window. The value is fixed when the consensus is deployed. For `--epoch-length` and the effect of both values on when outputs become executable, see step 4 of the [standard flow](./standard.md#setting-up-the-local-node).

   After this, your application is deployed and registered, and a guardian can foreclose it when needed.

   The guidance in [Operating the node](./standard.md#operating-the-node) also applies to this deployment.

## Recovery

When the operator is gone, the guardian forecloses and users withdraw directly from the contracts. The full procedure (foreclose, replay, prove the accounts drive, anchor the root, withdraw, and verify) is in the [Emergency Withdrawal Recovery Guide](../../development/emergency-withdrawal/recovery-guide.md).
