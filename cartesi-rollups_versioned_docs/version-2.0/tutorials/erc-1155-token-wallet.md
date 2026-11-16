---
id: erc-1155-token-wallet
title: Integrating ERC1155 token wallet functionality
---

This tutorial guides you through building an ERC-1155 token wallet for a Cartesi backend application using TypeScript. It covers **single** and **batch** deposits from the base layer, internal balance tracking, transfers, and withdrawals for both modes.

## Setting up the project

First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project): create a new TypeScript project, install [`viem`](https://viem.sh/) as a development dependency and let rolldown bundle it:

```bash
cartesi create erc-1155-token-wallet --template typescript
cd erc-1155-token-wallet
pnpm add -D viem@2.57.19
```

Then replace the contents of `rolldown.config.ts` with the configuration shown in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project), which sets `external: ["@cartesi/rollup"]`.

Single deposits use packed fields (`token`, `sender`, `tokenId`, `value`) with an optional standard-ABI tail; batch deposits use packed `token` and `sender` followed by ABI-encoded `tokenIds`, `values`, and optional data fields. See [asset handling](../development/asset-handling.md#abi-encoding-for-deposits). Withdrawals emit vouchers whose `safeTransferFrom` or `safeBatchTransferFrom` sender is your on-chain application address (`request.appContract` on each advance request)—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC1155 wallet

Create `src/wallet/balance.ts`:

```typescript
import type { Address } from "viem";

/** Per-account balances: ERC-1155 contract → tokenId → amount */
export class Balance {
  private holdings: Map<Address, Map<bigint, bigint>> = new Map();

  constructor(private readonly account: string) {}

  getAmount(erc1155: Address, tokenId: bigint): bigint {
    return this.holdings.get(erc1155)?.get(tokenId) ?? 0n;
  }

  increase(erc1155: Address, tokenId: bigint, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(`Invalid amount for ${erc1155} id ${tokenId}`);
    }
    if (!this.holdings.has(erc1155)) {
      this.holdings.set(erc1155, new Map());
    }
    const byId = this.holdings.get(erc1155)!;
    byId.set(tokenId, (byId.get(tokenId) ?? 0n) + amount);
  }

  decrease(erc1155: Address, tokenId: bigint, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(`Invalid amount for ${erc1155} id ${tokenId}`);
    }
    const current = this.getAmount(erc1155, tokenId);
    if (current < amount) {
      throw new Error(
        `Insufficient balance for ${erc1155} id ${tokenId} on ${this.account}`,
      );
    }
    this.holdings.get(erc1155)?.set(tokenId, current - amount);
  }

  listIds(erc1155: Address): { tokenId: string; amount: string }[] {
    const byId = this.holdings.get(erc1155);
    if (!byId) return [];
    return Array.from(byId.entries()).map(([id, amount]) => ({
      tokenId: id.toString(),
      amount: amount.toString(),
    }));
  }
}
```

Create `src/wallet/wallet.ts`:

```typescript
import type { Voucher } from "@cartesi/rollup";
import {
  type Address,
  decodeAbiParameters,
  encodeFunctionData,
  erc1155Abi,
  getAddress,
  type Hex,
  sliceHex,
} from "viem";
import { Balance } from "./balance";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreate(account: Address): Balance {
    const key = getAddress(account);
    let balance = this.accounts.get(key);
    if (!balance) {
      balance = new Balance(key);
      this.accounts.set(key, balance);
    }
    return balance;
  }

  getBalance(account: Address, erc1155: Address, tokenId: bigint): bigint {
    return this.getOrCreate(account).getAmount(erc1155, tokenId);
  }

  listBalances(account: Address, erc1155: Address) {
    return {
      address: account,
      erc1155,
      holdings: this.getOrCreate(account).listIds(erc1155),
    };
  }

  processSingleDeposit(payload: Hex): string {
    const [erc1155, account, tokenId, amount] =
      this.parseSingleDeposit(payload);
    return this.deposit(
      account,
      erc1155,
      tokenId,
      amount,
      "erc1155SingleDeposit",
    );
  }

  processBatchDeposit(payload: Hex): string {
    const [erc1155, account, tokenIds, amounts] =
      this.parseBatchDeposit(payload);
    const balance = this.getOrCreate(account);
    tokenIds.forEach((tokenId, i) => {
      balance.increase(erc1155, tokenId, amounts[i] ?? 0n);
    });
    return JSON.stringify({
      type: "erc1155BatchDeposit",
      content: {
        address: account,
        erc1155,
        tokenIds: tokenIds.map((id) => id.toString()),
        amounts: amounts.map((a) => a.toString()),
      },
    });
  }

  private parseSingleDeposit(
    payload: Hex,
  ): [Address, Address, bigint, bigint] {
    const erc1155 = getAddress(sliceHex(payload, 0, 20));
    const account = getAddress(sliceHex(payload, 20, 40));
    const tokenId = BigInt(sliceHex(payload, 40, 72));
    const amount = BigInt(sliceHex(payload, 72, 104));
    return [erc1155, account, tokenId, amount];
  }

  private parseBatchDeposit(
    payload: Hex,
  ): [Address, Address, bigint[], bigint[]] {
    const erc1155 = getAddress(sliceHex(payload, 0, 20));
    const account = getAddress(sliceHex(payload, 20, 40));
    const [tokenIds, amounts] = decodeAbiParameters(
      [
        { type: "uint256[]" },
        { type: "uint256[]" },
        { type: "bytes" },
        { type: "bytes" },
      ],
      sliceHex(payload, 40),
    );
    return [erc1155, account, [...tokenIds], [...amounts]];
  }

  private deposit(
    account: Address,
    erc1155: Address,
    tokenId: bigint,
    amount: bigint,
    noticeType: string,
  ): string {
    this.getOrCreate(account).increase(erc1155, tokenId, amount);
    return JSON.stringify({
      type: noticeType,
      content: {
        address: account,
        erc1155,
        tokenId: tokenId.toString(),
        amount: amount.toString(),
      },
    });
  }

  transferSingle(
    from: Address,
    to: Address,
    erc1155: Address,
    tokenId: bigint,
    amount: bigint,
  ): string {
    const fromBal = this.getOrCreate(from);
    const toBal = this.getOrCreate(to);
    fromBal.decrease(erc1155, tokenId, amount);
    toBal.increase(erc1155, tokenId, amount);
    return JSON.stringify({
      type: "erc1155SingleTransfer",
      content: {
        from,
        to,
        erc1155,
        tokenId: tokenId.toString(),
        amount: amount.toString(),
      },
    });
  }

  transferBatch(
    from: Address,
    to: Address,
    erc1155: Address,
    tokenIds: bigint[],
    amounts: bigint[],
  ): string {
    if (tokenIds.length !== amounts.length) {
      throw new Error("tokenIds and amounts length mismatch");
    }
    const fromBal = this.getOrCreate(from);
    const toBal = this.getOrCreate(to);
    tokenIds.forEach((tokenId, i) => {
      const amount = amounts[i] ?? 0n;
      fromBal.decrease(erc1155, tokenId, amount);
      toBal.increase(erc1155, tokenId, amount);
    });
    return JSON.stringify({
      type: "erc1155BatchTransfer",
      content: {
        from,
        to,
        erc1155,
        tokenIds: tokenIds.map((id) => id.toString()),
        amounts: amounts.map((a) => a.toString()),
      },
    });
  }

  withdrawSingle(
    application: Address,
    account: Address,
    erc1155: Address,
    tokenId: bigint,
    amount: bigint,
  ): Voucher {
    this.getOrCreate(account).decrease(erc1155, tokenId, amount);
    const call = encodeFunctionData({
      abi: erc1155Abi,
      functionName: "safeTransferFrom",
      args: [application, account, tokenId, amount, "0x"],
    });
    return { destination: erc1155, value: 0n, payload: call };
  }

  withdrawBatch(
    application: Address,
    account: Address,
    erc1155: Address,
    tokenIds: bigint[],
    amounts: bigint[],
  ): Voucher {
    if (tokenIds.length !== amounts.length) {
      throw new Error("tokenIds and amounts length mismatch");
    }
    const balance = this.getOrCreate(account);
    tokenIds.forEach((tokenId, i) => {
      balance.decrease(erc1155, tokenId, amounts[i] ?? 0n);
    });
    const call = encodeFunctionData({
      abi: erc1155Abi,
      functionName: "safeBatchTransferFrom",
      args: [application, account, tokenIds, amounts, "0x"],
    });
    return { destination: erc1155, value: 0n, payload: call };
  }
}
```

### Voucher creation

- **Single withdraw** encodes `safeTransferFrom(application, recipient, tokenId, amount, "0x")`.
- **Batch withdraw** encodes `safeBatchTransferFrom(application, recipient, ids[], amounts[], "0x")`.

Tokens deposited through the portals are held by your on-chain `Application` contract; the `from` address in the voucher must match `request.appContract` from the advance request. The voucher's `value` is `0n` because no Ether is sent with the call.

## Using the wallet

Create `src/index.ts` to wire deposits from both portals and user operations sent as JSON inputs.

:::note Portal addresses
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `Erc1155SinglePortal` and `Erc1155BatchPortal` addresses into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
:::

```typescript
import {
  type AdvanceRequest,
  type InspectRequest,
  Rollup,
} from "@cartesi/rollup";
import {
  type Address,
  bytesToHex,
  getAddress,
  isAddressEqual,
  stringToHex,
} from "viem";
import { Wallet } from "./wallet/wallet";

// Replace with the addresses from `cartesi address-book`
const ERC1155_SINGLE_PORTAL: Address = "0xYOUR_ERC1155_SINGLE_PORTAL_ADDRESS";
const ERC1155_BATCH_PORTAL: Address = "0xYOUR_ERC1155_BATCH_PORTAL_ADDRESS";

const rollup = new Rollup();
const wallet = new Wallet();

const parseBigIntArray = (values: string[] | string): bigint[] => {
  const list = Array.isArray(values) ? values : [values];
  return list.map((v) => BigInt(v));
};

const handleAdvance = (request: AdvanceRequest): boolean => {
  console.log(
    `Received advance request from ${request.msgSender} with index ${request.index}`,
  );

  if (isAddressEqual(request.msgSender, ERC1155_SINGLE_PORTAL)) {
    const deposit = wallet.processSingleDeposit(bytesToHex(request.payload));
    rollup.emitNotice(stringToHex(deposit));
    return true;
  }

  if (isAddressEqual(request.msgSender, ERC1155_BATCH_PORTAL)) {
    const deposit = wallet.processBatchDeposit(bytesToHex(request.payload));
    rollup.emitNotice(stringToHex(deposit));
    return true;
  }

  // Transfer or withdrawal: always on behalf of the account that sent the input
  const owner = getAddress(request.msgSender);
  try {
    const body = JSON.parse(request.payload.toString("utf8"));
    const { operation, mode } = body;
    const erc1155 = getAddress(body.erc1155);

    if (operation === "transfer" && mode === "single") {
      const notice = wallet.transferSingle(
        owner,
        getAddress(body.to),
        erc1155,
        BigInt(body.tokenId),
        BigInt(body.amount),
      );
      rollup.emitNotice(stringToHex(notice));
    } else if (operation === "transfer" && mode === "batch") {
      const notice = wallet.transferBatch(
        owner,
        getAddress(body.to),
        erc1155,
        parseBigIntArray(body.tokenIds),
        parseBigIntArray(body.amounts),
      );
      rollup.emitNotice(stringToHex(notice));
    } else if (operation === "withdraw" && mode === "single") {
      // The application contract holds the deposited tokens, so it is the
      // `from` address of the transfer call in the voucher
      const voucher = wallet.withdrawSingle(
        request.appContract,
        owner,
        erc1155,
        BigInt(body.tokenId),
        BigInt(body.amount),
      );
      rollup.emitVoucher(voucher);
    } else if (operation === "withdraw" && mode === "batch") {
      const voucher = wallet.withdrawBatch(
        request.appContract,
        owner,
        erc1155,
        parseBigIntArray(body.tokenIds),
        parseBigIntArray(body.amounts),
      );
      rollup.emitVoucher(voucher);
    } else {
      throw new Error(`Unknown operation ${operation} with mode ${mode}`);
    }
    return true;
  } catch (error) {
    console.error("Error processing payload:", error);
    rollup.emitReport(stringToHex(`Error processing payload: ${error}`));
    return false;
  }
};

const handleInspect = (request: InspectRequest): void => {
  try {
    const query = request.payload.toString("utf8");
    const [kind, address, erc1155, tokenId] = query.split("/");
    if (kind !== "erc1155" || address === undefined || erc1155 === undefined) {
      throw new Error("expected erc1155/userAddress/contractAddress[/tokenId]");
    }
    if (tokenId !== undefined) {
      const amount = wallet.getBalance(
        getAddress(address),
        getAddress(erc1155),
        BigInt(tokenId),
      );
      rollup.emitReport(
        stringToHex(
          `Balance of ${erc1155} id ${tokenId} for ${address} is ${amount}`,
        ),
      );
    } else {
      const summary = wallet.listBalances(
        getAddress(address),
        getAddress(erc1155),
      );
      rollup.emitReport(stringToHex(JSON.stringify(summary)));
    }
  } catch (error) {
    rollup.emitReport(
      stringToHex(`Error processing inspect payload: ${error}`),
    );
  }
};

await rollup.run({ advance: handleAdvance, inspect: handleInspect });
```

This code uses the `Rollup` class of [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup), which the template already depends on: `rollup.run()` passes each request to `handleAdvance` or `handleInspect`, with the payload as a Node.js `Buffer`, and an advance handler rejects the input when it returns `false`. When an operation fails, for example because of an insufficient balance, the application emits the error as a report and rejects the input.

The account that sends the input is the owner of every transfer and withdrawal: the wallet always debits `request.msgSender`, and the payloads have no `from` field. Anyone can write any address in a JSON payload, but nobody can send an input on behalf of another account, so reading the owner from the payload would let anyone move anyone's tokens.

User input payloads use `mode`: `"single"` or `"batch"`, plus `operation`: `"transfer"` or `"withdraw"`.

**Single transfer:**

```json
{
  "operation": "transfer",
  "mode": "single",
  "erc1155": "0xTokenAddress",
  "to": "0xToAddress",
  "tokenId": "1",
  "amount": "10"
}
```

**Batch transfer:**

```json
{
  "operation": "transfer",
  "mode": "batch",
  "erc1155": "0xTokenAddress",
  "to": "0xToAddress",
  "tokenIds": ["1", "2"],
  "amounts": ["10", "20"]
}
```

**Single withdraw:**

```json
{
  "operation": "withdraw",
  "mode": "single",
  "erc1155": "0xTokenAddress",
  "tokenId": "1",
  "amount": "10"
}
```

**Batch withdraw:**

```json
{
  "operation": "withdraw",
  "mode": "batch",
  "erc1155": "0xTokenAddress",
  "tokenIds": ["1", "2"],
  "amounts": ["10", "20"]
}
```

## Build and run the application

```shell
cartesi build
cartesi run
```

### Deposits

:::caution token approvals
ERC-1155 uses `setApprovalForAll` on the token contract for each portal operator. Approve **both** [`Erc1155SinglePortal`](../api-reference/contracts/portals/ERC1155SinglePortal.md) and [`Erc1155BatchPortal`](../api-reference/contracts/portals/ERC1155BatchPortal.md) before depositing through the corresponding portal.
:::

**Single deposit** — interactively:

```bash
cartesi deposit erc1155-single
```

Non-interactive alternative. Run from your **project root** (with `cartesi run` up):

```bash
MULTI=$(cartesi address-book 2>&1 | grep -i TestMultiToken | awk '{print $NF}')
SINGLE_PORTAL=$(cartesi address-book 2>&1 | grep -i Erc1155SinglePortal | awk '{print $NF}')

cast send "$MULTI" \
  "mint(address,uint256,uint256)" \
  0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f \
  1 100 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cast send "$MULTI" \
  "setApprovalForAll(address,bool)" \
  "$SINGLE_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cartesi deposit erc1155-single 1 10 \
  --token "$MULTI" \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Deposits token ID `1` with amount `10`. Skip `mint` if you already hold that ID.

**Batch deposit** — interactively:

```bash
cartesi deposit erc1155-batch
```

Non-interactive alternative (from project root):

```bash
MULTI=$(cartesi address-book 2>&1 | grep -i TestMultiToken | awk '{print $NF}')
BATCH_PORTAL=$(cartesi address-book 2>&1 | grep -i Erc1155BatchPortal | awk '{print $NF}')

cast send "$MULTI" \
  "mint(address,uint256,uint256)" \
  0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f \
  2 50 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cast send "$MULTI" \
  "setApprovalForAll(address,bool)" \
  "$BATCH_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cartesi deposit erc1155-batch 1,2 10,20 \
  --token "$MULTI" \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

### Balance checks (Inspect)

Inspect payloads use UTF-8 strings. The node passes the request body to your application unchanged as the inspect payload, so send the string itself as the body:

- Single ID: `erc1155/0xUser/0xContract/1`
- All IDs for a contract: `erc1155/0xUser/0xContract`

Example for user `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`, the `TestMultiToken` contract `0xAaE893D28b7645B5E09bc16688dddd451aC89C19` and token ID `1`:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-1155-token-wallet \
  -H "Content-Type: text/plain" \
  -d 'erc1155/0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f/0xAaE893D28b7645B5E09bc16688dddd451aC89C19/1'
```

Replace the inspect path if your project name is not `erc-1155-token-wallet` (see the URL printed by `cartesi run`).

### Transfers and withdrawals

Interactively:

```bash
cartesi send
```

Non-interactive examples (from project root):

```bash
cartesi send --encoding string \
  '{"operation":"transfer","mode":"single","erc1155":"0xTokenAddress","to":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8","tokenId":"1","amount":"5"}' \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","mode":"batch","erc1155":"0xTokenAddress","tokenIds":["1","2"],"amounts":["5","10"]}' \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Replace `0xTokenAddress` with `TestMultiToken` from `cartesi address-book`. Both commands send from devnet account 8 (`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`), the account that made the deposits above, so the wallet debits that account. If you pass `--from` to send from another account, the application debits that account instead, and rejects the input with a report when it does not hold the tokens in the wallet.

### Using the explorer

Start the node with the explorer enabled to execute vouchers once their epoch has closed and its claim has been accepted:

```shell
cartesi run --services explorer
```

The local explorer is at `http://localhost:6751/explorer` (see [running an application](../development/running-an-application.md)).
