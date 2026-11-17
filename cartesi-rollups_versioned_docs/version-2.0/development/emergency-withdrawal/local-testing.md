---
id: local-testing
title: Testing emergency withdrawal locally with cartesi run
---

The [recovery guide](./recovery-guide.md) runs the node tools on your own machine, against any chain. To try the whole flow on a local devnet first, you do not need to install anything beyond the Cartesi CLI: `cartesi run` deploys the application with a withdrawal config derived from its accounts drive, and three CLI commands run the recovery for you inside the devnet's node container:

- `cartesi foreclose` forecloses the application, signing as its guardian;
- `cartesi withdraw` replays the application up to its last finalized epoch, generates the accounts-drive proofs, anchors the accounts-drive root on-chain the first time, and withdraws an account's balance;
- `cartesi refund <input-index>` refunds a portal deposit that was not finalized before the foreclosure.

You need Cartesi CLI 2.0.0-alpha.42 or later (it defaults to the SDK with Cartesi Rollups Node v2.0.0-alpha.14), and an application that keeps its balances in an accounts drive, in the layout described in [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md). The `cast` and `curl` commands used to check the results need [Foundry](https://getfoundry.sh) and `jq`.

The example on this page is a ledger application written in Python. It uses the single-asset ledger of [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools/tree/v0.1.0-alpha.11) v0.1.0-alpha.11 to credit ERC-20 deposits of the devnet `TestUsdc` token to its accounts drive. It opens the ledger on the whole 4 MiB drive (`/dev/pmem1`) with room for 4096 accounts:

```python
ACCOUNTS_DEVICE = environ.get("ACCOUNTS_DEVICE", "/dev/pmem1")
DRIVE_SIZE = 4 * 1024 * 1024  # [drives.accounts] size
N_ACCOUNTS = 1 << 12  # log2MaxNumOfAccounts = 12
...
check(
    lib.cma_ledger_init_single_file(
        ledger,
        ACCOUNTS_DEVICE.encode(),
        ctypes.c_size_t(0),
        ctypes.c_size_t(DRIVE_SIZE),
        ctypes.c_size_t(N_ACCOUNTS),
        ctypes.c_int(CMA_LEDGER_ASSET_TYPE_TOKEN_ADDRESS),
        token,  # the devnet TestUsdc address
    ),
    "cma_ledger_init_single_file",
)
```

The ledger writes the 4096 balance records, 32 bytes each, at the beginning of the drive (the first 128 KiB), and keeps its own bookkeeping after them. This matters for the configuration below.

## Configure the accounts drive

Mark the accounts drive in `cartesi.toml` with `accounts_drive = true`. The CLI then derives the application's [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md) from the built machine, so you never compute `accountsDriveStartIndex` or `log2MaxNumOfAccounts` yourself:

```toml
# SDK image for rollups-node v2.0.0-alpha.14 (Cartesi Machine emulator 0.22.0).
sdk = "cartesi/sdk:0.12.0-alpha.45"

# The application and OS, built from your Dockerfile.
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"

# The accounts drive: a raw, unformatted flash drive for the balance ledger.
[drives.accounts]
builder = "empty"
format = "raw"
size = 4194304                 # 4 MiB, the whole file the ledger library manages
mount = false
user = "dapp"
accounts_drive = true          # derive the withdrawal config from this drive
accounts_drive_size = "128Ki"  # only the balance records: 4096 accounts x 32 bytes

# Optional. Without this table, cartesi run uses the devnet values shown here.
# [withdrawal]
# guardian = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"                   # devnet account 1
# withdrawal_output_builder = "0xB4D253c7a110241561B3eD6d632846dF7d4e9Af7"  # devnet TestUsdWithdrawalOutputBuilder
# account_size = 32                                                         # bytes per account
```

- `accounts_drive = true` marks the drive that holds the accounts. Only one can be marked, and it must be `builder = "empty"`, `format = "raw"` and not mounted.
- `accounts_drive_size` limits the accounts drive to the beginning of a larger drive. Leave it out only if your balance records fill the whole drive. It must be a power of two, no larger than the drive.
- `[withdrawal]` is optional. Each key overrides one value:

| Key | Default | Meaning |
|-----|---------|---------|
| `guardian` | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (devnet account 1) | The only address allowed to foreclose. |
| `withdrawal_output_builder` | `0xB4D253c7a110241561B3eD6d632846dF7d4e9Af7` (devnet `TestUsdWithdrawalOutputBuilder`) | Decodes an account and builds its payout. The devnet builder pays out `TestUsdc` (`0x7a051EDffC0884cd88d4a377F4C87BE074CF6c81`) and expects 32-byte accounts. |
| `account_size` | `32` | Bytes per account, a power of two of at least 32. Gives `log2LeavesPerAccount`. |

The default guardian and builder exist only on the `cartesi run` devnet. Against a fork of another chain the CLI requires `withdrawal_output_builder`, since the devnet builder is not deployed there.

:::caution Size the accounts drive to the records, not to the file
`log2MaxNumOfAccounts` comes from the size of the accounts drive, and it is fixed on-chain at deployment. If the ledger keeps other data after its records, as the machine-asset-tools ledger does, and you leave out `accounts_drive_size`, the application deploys with a geometry that covers that data too (`log2_max_num_of_accounts` 17 for this 4 MiB drive, instead of 12). Nothing fails until the recovery: `cartesi withdraw` then stops with `account 4096 appears after the first empty slot`, and since the deposits were finalized, they cannot be refunded either. Set `accounts_drive_size` to the number of accounts the ledger was opened with, times the account size.
:::

## Build

`cartesi build` builds the machine, finds where the emulator placed the accounts drive, and prints the configuration it derives:

```sh
cartesi build
```

```text
...
Storing machine: please wait

accounts drive  accounts (flash drive) → /dev/pmem1
start           0xa0000000
size            128 KiB (2^17 bytes), at the beginning of 4 MiB
accounts        4096 × 32 bytes

withdrawal config
  guardian                    0x70997970C51812dc3A010C7d01b50e0d17dc79C8  devnet account 1
  withdrawal_output_builder   0xB4D253c7a110241561B3eD6d632846dF7d4e9Af7  devnet TestUsdWithdrawalOutputBuilder
  account_size                32 bytes                                    default
  log2_leaves_per_account     0                                           derived
  log2_max_num_of_accounts    12                                          derived
  accounts_drive_start_index  20480 (0x5000)                              derived

--withdrawal-config '{"guardian":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8","log2_leaves_per_account":0,"log2_max_num_of_accounts":12,"accounts_drive_start_index":20480,"withdrawal_output_builder":"0xB4D253c7a110241561B3eD6d632846dF7d4e9Af7"}'
devnet defaults in use: set guardian and withdrawal_output_builder under [withdrawal] to deploy elsewhere
```

The first line names the device the guest opens the drive at (`/dev/pmem1` here). `accounts_drive_start_index` is the drive's start address divided by the accounts-drive size (`0xa0000000 / 0x20000 = 0x5000`). The `--withdrawal-config` line is the value `cartesi run` passes to the node's `cartesi-rollups-cli deploy application`; use the same value to deploy this machine yourself ([Deploying with emergency withdrawal](../../deployment/self-hosted/with-emergency-withdrawal.md)), after setting your own `guardian` and `withdrawal_output_builder`.

Without `accounts_drive = true`, `cartesi build` prints no withdrawal section, and `cartesi run` deploys the application without a withdrawal config: its guardian is the zero address and it can never be foreclosed.

## Run the devnet

The `cartesi` commands on this page find the devnet and the application by the project name, which defaults to the name of the current directory. The output and the JSON-RPC calls below assume the project directory is named `ewapp`: run every command from that directory, or replace `ewapp` with your directory's name.

Start the devnet and keep it running in its own terminal:

```sh
cartesi run --epoch-length 10 --claim-staging-period 30 --port 6791
```

```text
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ ewapp starting at http://127.0.0.1:6791
❯ anvil service starting...
❯ rpc service starting...
❯ inspect service starting...
✔ anvil service ready at http://127.0.0.1:6791/anvil
✔ inspect service ready at http://127.0.0.1:6791/inspect/ewapp
✔ rpc service ready at http://127.0.0.1:6791/rpc
✔ ewapp machine hash is 0x5ab71fe4c8acee6dd863c186f7d88b2e67569df7bc91255f04eec4b40571e907
✔ ewapp contract deployed at 0x19607994febf8381df4be89cd82cdd984285c7c0
```

- `--epoch-length 10` closes an epoch every 10 blocks (20 seconds at the default 2-second block time), instead of every 720 blocks.
- `--claim-staging-period 30` keeps each claim staged for 30 blocks (about 60 seconds) before it can be accepted. This is the guardian's window: a deposit whose epoch is still open or staged when you foreclose is never finalized, and is returned by a refund. With the default of `0`, a claim is accepted as soon as it is staged, so only deposits whose epoch has not been claimed yet stay unfinalized.
- `--port 6791` fixes the devnet's address for the `cast` and `curl` commands below.

`cartesi run` derives the same withdrawal config from the built machine and deploys with it, but does not print it. Check what was deployed on-chain, with the address printed above:

```sh
RPC=http://127.0.0.1:6791/anvil
APP=0x19607994febf8381df4be89cd82cdd984285c7c0
```

```sh
for f in 'getGuardian()(address)' 'getWithdrawalOutputBuilder()(address)' \
         'getLog2LeavesPerAccount()(uint8)' 'getLog2MaxNumOfAccounts()(uint8)' \
         'getAccountsDriveStartIndex()(uint64)'; do
  cast call $APP "$f" --rpc-url $RPC
done
```

```text
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0xB4D253c7a110241561B3eD6d632846dF7d4e9Af7
0
12
20480 [2.048e4]
```

The node holds the same values, which the recovery commands read:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_getApplication","params":{"application":"ewapp"},"id":1}' \
  | jq '.result.data.withdrawal_config'
```

```json
{
  "guardian": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "log2_leaves_per_account": "0x0",
  "log2_max_num_of_accounts": "0xc",
  "accounts_drive_start_index": "0x5000",
  "withdrawal_output_builder": "0xb4d253c7a110241561b3ed6d632846df7d4e9af7"
}
```

## Deposit

The devnet's `TestUsdc` starts with no supply, and anyone can mint it. Mint some to two devnet accounts, account 8 (the default sender of `cartesi deposit`) and account 7. The devnet accounts are unlocked, so `cast` can send from them without a key:

```sh
USDC=0x7a051EDffC0884cd88d4a377F4C87BE074CF6c81
ALICE=0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
BOB=0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
cast send $USDC 'mint(address,uint256)' $ALICE 1000000000 --unlocked --from $ALICE --rpc-url $RPC | grep '^status'
cast send $USDC 'mint(address,uint256)' $BOB 1000000000 --unlocked --from $BOB --rpc-url $RPC | grep '^status'
```

```text
status               1 (success)
status               1 (success)
```

`TestUsdc` has 6 decimals, so each account now holds 1000 USDC. Deposit 100 USDC from Alice and 250 USDC from Bob through the ERC-20 portal:

```sh
cartesi deposit erc20 --token $USDC 100
```

```text
- Approving 100 USDC...
✔ Approved 100 USDC
- Depositing 100 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0...
✔ Deposited 100 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0
```

```sh
cartesi deposit --from $BOB erc20 --token $USDC 250
```

```text
- Approving 250 USDC...
✔ Approved 250 USDC
- Depositing 250 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0...
✔ Deposited 250 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0
```

Emergency withdrawal pays out the balances of the last **accepted** epoch, so wait until the epoch holding both deposits is `CLAIM_ACCEPTED` (about a minute and a half with the flags above). Repeat this until it is:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_listEpochs","params":{"application":"ewapp"},"id":1}' \
  | jq -c '.result.data[] | {index, status}'
```

```text
{"index":"0x4","status":"CLAIM_ACCEPTED"}
```

Now make two more deposits, 40 USDC from Bob and 15 USDC from Alice. You will foreclose before their epoch is accepted, so they stay unfinalized:

```sh
cartesi deposit --from $BOB erc20 --token $USDC 40
```

```text
- Approving 40 USDC...
✔ Approved 40 USDC
- Depositing 40 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0...
✔ Deposited 40 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0
```

```sh
cartesi deposit erc20 --token $USDC 15
```

```text
- Approving 15 USDC...
✔ Approved 15 USDC
- Depositing 15 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0...
✔ Deposited 15 USDC to 0x19607994febf8381df4be89cd82cdd984285c7c0
```

## Foreclose

Foreclose right away, within the staging window:

```sh
cartesi foreclose --yes
```

```text
Transaction hash: 0x663f4c16fb813d13203bb0a12f16981329fac7629041b0b8339088aa5c91d53e
Transaction mined: 0x663f4c16fb813d13203bb0a12f16981329fac7629041b0b8339088aa5c91d53e
```

`cartesi foreclose` reads the guardian from the node, looks it up among the first 20 accounts of the node's mnemonic (the devnet mnemonic), and signs as that account: devnet account 1 by default, or the account you set as `guardian` under `[withdrawal]`. To sign as a guardian outside that mnemonic, set `CARTESI_AUTH_MNEMONIC` (with `--account-index` if needed) or `CARTESI_AUTH_PRIVATE_KEY` in the environment of that one command. `--yes` skips the confirmation prompt that each transaction command shows; leave it out to review the transaction before it is sent.

The application is foreclosed on-chain:

```sh
cast call $APP 'isForeclosed()(bool)' --rpc-url $RPC
```

```text
true
```

A few seconds later the node marks every epoch that was not accepted as `CLAIM_FORECLOSED`. The epoch with the first two deposits stays `CLAIM_ACCEPTED`:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_listEpochs","params":{"application":"ewapp"},"id":1}' \
  | jq -c '.result.data[] | {index, status}'
```

```text
{"index":"0x4","status":"CLAIM_ACCEPTED"}
{"index":"0xa","status":"CLAIM_FORECLOSED"}
```

Note the input indexes of the unfinalized deposits, the ones in the foreclosed epoch (here `2` and `3`). The status of an input only says whether the application accepted it; whether it was finalized is the status of its epoch:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_listInputs","params":{"application":"ewapp"},"id":1}' \
  | jq -c '.result.data[] | {index, epoch_index}'
```

```text
{"index":"0x0","epoch_index":"0x4"}
{"index":"0x1","epoch_index":"0x4"}
{"index":"0x2","epoch_index":"0xa"}
{"index":"0x3","epoch_index":"0xa"}
```

From now on the application takes no new inputs: a deposit reverts with `ApplicationForeclosed`.

## Withdraw

Withdraw Alice's balance:

```sh
cartesi withdraw --account $ALICE --account-index 8 --yes
```

```text
- Looking up the last finalized epoch...
✔ Replayed 2 inputs up to epoch 4
- Generating the proofs of 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f...
✔ Generated the proofs of 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (account index 0)
Transaction hash: 0xfeb0a0250a7c73dd17c05c213f07cc9f46779bd9eece0e6d36cd5151083c20d8
Transaction mined: 0xfeb0a0250a7c73dd17c05c213f07cc9f46779bd9eece0e6d36cd5151083c20d8
Transaction hash: 0x176c6195b7ded91b7c758a84e171c0e1bd4b8b6b4dd9b8014493d03a87d8c585
Transaction mined: 0x176c6195b7ded91b7c758a84e171c0e1bd4b8b6b4dd9b8014493d03a87d8c585
```

This one command runs steps 2 to 5 of the [recovery guide](./recovery-guide.md) inside the node container:

1. It reads the last finalized machine root from the chain and waits until the node has the epoch with that root (epoch 4 here).
2. It replays the application's inputs up to that epoch (`cartesi-rollups-machine-tool replay`) and checks that the replayed machine has the finalized root. The snapshot is kept in the node container, under `/tmp/cartesi-withdraw/<application>/epoch-<index>`, and reused by the next withdrawals.
3. It generates the proofs of the account (`cartesi-rollups-machine-tool prove accounts-drive`), with the accounts-drive geometry the node has for the application.
4. If the accounts-drive root is not anchored yet, it anchors it (`cartesi-rollups-cli prove-drive-root`, the first transaction above), and then withdraws (`cartesi-rollups-cli withdraw`, the second).

`--account` selects the account by its owner address, and the funds always go to that owner. `--account-index` selects the devnet account that signs and pays for the transactions. Without it, the node's own signer pays: devnet account 0, which also signs the node's claims. Always pass `--account-index` with an account other than 0 (see [Be careful with devnet account 0](../send-inputs-and-assets.md#initiate-an-advance-request)).

Withdraw Bob's balance. The replayed machine and the anchored root are reused, so this sends a single transaction:

```sh
cartesi withdraw --account $BOB --account-index 7 --yes
```

```text
- Looking up the last finalized epoch...
✔ Using the machine replayed up to epoch 4
- Generating the proofs of 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955...
✔ Generated the proofs of 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (account index 1)
Transaction hash: 0x2ce61899365f42aeab0fe18ce7d1582bcee11a1624123e5138266be3556777f9
Transaction mined: 0x2ce61899365f42aeab0fe18ce7d1582bcee11a1624123e5138266be3556777f9
```

Alice has her 100 USDC back and Bob his 250 USDC. The application still holds the 55 USDC of the unfinalized deposits:

```sh
for a in $ALICE $BOB $APP; do cast call $USDC 'balanceOf(address)(uint256)' $a --rpc-url $RPC; done
```

```text
985000000 [9.85e8]
960000000 [9.6e8]
55000000 [5.5e7]
```

The node indexes each `Withdrawal` event. The `account` field is the account record that was paid out: the balance as a 12-byte little-endian number, followed by the owner:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_listWithdrawals","params":{"application":"ewapp"},"id":1}' \
  | jq -c '.result.data[] | {account_index, account, transaction_hash}'
```

```text
{"account_index":"0x0","account":"0x00e1f505000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f","transaction_hash":"0x176c6195b7ded91b7c758a84e171c0e1bd4b8b6b4dd9b8014493d03a87d8c585"}
{"account_index":"0x1","account":"0x80b2e60e000000000000000014dc79964da2c08b23698b3d3cc7ca32193d9955","transaction_hash":"0x2ce61899365f42aeab0fe18ce7d1582bcee11a1624123e5138266be3556777f9"}
```

The application record now shows the foreclosure and the anchored root:

```sh
curl -s http://127.0.0.1:6791/rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"cartesi_getApplication","params":{"application":"ewapp"},"id":1}' \
  | jq '.result.data | {foreclose_block, accounts_drive_proved_block, accounts_drive_merkle_root}'
```

```json
{
  "foreclose_block": "0x6e",
  "accounts_drive_proved_block": "0x12a",
  "accounts_drive_merkle_root": "0xe944c4f552fcc2d3673c7978d5a65432611ffe57facf165d40be36738af0e49c"
}
```

## Refund the unfinalized deposits

Refund the two deposits of the foreclosed epoch by their input index. `cartesi refund` reads the deposit input from the node, and `--account-index` again selects who pays for gas. The asset always goes back to the original depositor, so Bob can pay for Alice's refund:

```sh
cartesi refund 2 --account-index 7 --yes
```

```text
Transaction hash: 0xe00e860e5b3a447d94831cb608fe123d5080a611360c3997598dd67bdb65027b
Transaction mined: 0xe00e860e5b3a447d94831cb608fe123d5080a611360c3997598dd67bdb65027b
```

```sh
cartesi refund 3 --account-index 7 --yes
```

```text
Transaction hash: 0x9d226ad7ada947ec1239d07a6c89fd4ab5f28048728c6c8865131ff1d4915c95
Transaction mined: 0x9d226ad7ada947ec1239d07a6c89fd4ab5f28048728c6c8865131ff1d4915c95
```

Everything deposited is back with its owner, and the application holds nothing:

```sh
for a in $ALICE $BOB $APP; do cast call $USDC 'balanceOf(address)(uint256)' $a --rpc-url $RPC; done
```

```text
1000000000 [1e9]
1000000000 [1e9]
0
```

The node does not index refunds. Check them, and the withdrawals, on-chain:

```sh
for i in 0 1; do cast call $APP 'wereAccountFundsWithdrawn(uint256)(bool)' $i --rpc-url $RPC; done
```

```text
true
true
```

```sh
for i in 2 3; do cast call $APP 'wasRefundForInputIssued(uint256)(bool)' $i --rpc-url $RPC; done
```

```text
true
true
```

Stopping `cartesi run` removes the devnet, including the replayed snapshot.

## What can go wrong

These are the messages the commands print, as seen on the devnet.

| Situation | Message |
|-----------|---------|
| `cartesi withdraw` before the foreclosure | `Application 0x1960…c7c0 is not foreclosed, use cartesi foreclose first` |
| `cartesi foreclose --account-index 8`, an account that is not the guardian | `decoded revert: NotGuardian()` (nothing is sent) |
| `cartesi foreclose` with `CARTESI_AUTH_PRIVATE_KEY` of an account that is not the guardian | `The private key's address 0x2361…1E8f isn't the guardian 0x7099…79C8` |
| `cartesi foreclose` with a `CARTESI_AUTH_MNEMONIC` that does not hold the guardian | `Guardian 0x7099…79C8 isn't one of the first 20 accounts of the mnemonic in use. …` |
| `cartesi foreclose` a second time | `decoded revert: Foreclosed()` |
| `cartesi foreclose` on an application built without `accounts_drive = true` | `The application was deployed without a withdrawal config and cannot be foreclosed` |
| `cartesi withdraw` when no epoch was accepted before the foreclosure | `No finalized epoch, there are no funds to withdraw` (refund the deposits instead) |
| `cartesi withdraw` for an address with no account in the drive | `Error: account not found: 0x…`, followed by the machine tool's usage text |
| `cartesi withdraw` for an account already paid out | `decoded revert: AccountFundsAlreadyWithdrawn(accountIndex=0)` |
| `cartesi withdraw` when the accounts drive is larger than the records (see [Configure the accounts drive](#configure-the-accounts-drive)) | `account 4096 appears after the first empty slot` |
| `cartesi refund` of a finalized deposit | `decoded revert: CannotRefundFinalizedInput(inputIndex=0)` |
| `cartesi refund` of a deposit already refunded | `decoded revert: RefundAlreadyIssued(inputIndex=3)` |
| `cartesi refund` of an input index the node does not have | `Input 9 not found in the node, use --input-file with the InputAdded.input bytes` |
| `cartesi deposit` after the foreclosure | `Error: ApplicationForeclosed(address appContract)` |

`cartesi build` and `cartesi run` reject an inconsistent configuration before deploying anything:

| In `cartesi.toml` | Message |
|-------------------|---------|
| `[withdrawal]` without a drive marked `accounts_drive = true` | `Invalid [withdrawal]: emergency withdrawal needs an accounts drive, mark a raw drive or an nvram with accounts_drive = true` |
| `accounts_drive_size` without `accounts_drive = true` | `Invalid accounts drive 'accounts': accounts_drive_size requires accounts_drive = true` |
| `accounts_drive_size = "100Ki"` | `Invalid accounts drive 'accounts': accounts_drive_size 102400 is not a power of two, use "128Ki"` |
| `accounts_drive_size = "8Mi"` on a 4 MiB drive | `Invalid accounts drive 'accounts': accounts_drive_size 8388608 is larger than the drive itself (4194304 bytes)` |
| `size = 3000000` and no `accounts_drive_size` | `Invalid accounts drive 'accounts': size 3000000 is not a power of two, use "4Mi", or set accounts_drive_size to keep the accounts at the beginning of a larger drive` |
| `accounts_drive = true` on an `ext2` drive | `Invalid accounts drive 'accounts': it must not have a filesystem, use builder = "empty" and format = "raw", or declare it under [nvrams.accounts]` |
| `mount = "/mnt/accounts"` on the accounts drive | `Invalid accounts drive 'accounts': it can't be mounted, remove 'mount' or set it to false` |
| two drives marked `accounts_drive = true` | `Only one drive or nvram can be the accounts drive, but 'accounts', 'accounts2' are marked with accounts_drive = true` |
| `account_size = 48` | `Invalid [withdrawal]: account_size 48 must be a power of two of at least 32 bytes, such as 32 or 64` |
| `account_size = 64` with the devnet builder | `Invalid [withdrawal]: the devnet withdrawal output builder expects accounts of 32 bytes, but they are set to 64 bytes. Remove account_size, or set withdrawal_output_builder to a builder for 64-byte accounts` (after the machine is built) |
| a key such as `log2_max_num_of_accounts` under `[withdrawal]` | `Unknown key 'log2_max_num_of_accounts' in [withdrawal], expected one of: account_size, guardian, withdrawal_output_builder` |

The CLI cannot check that the guest writes its records where the configuration says. A drive that is too large for the records (see the caution above) deploys, and only `cartesi withdraw` finds out.
