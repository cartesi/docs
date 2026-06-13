> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: erc-1155-token-wallet
title: Integrating ERC1155 token wallet functionality
---

This tutorial guides you through building an ERC-1155 token wallet for a Cartesi backend application using TypeScript. It covers **single** and **batch** deposits from the base layer, internal balance tracking, transfers, and withdrawals for both modes.

## Setting up the project

First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project). Create a new project (for example `erc-1155-token-wallet`) and install [`viem`](https://viem.sh/):

```bash
cartesi create erc-1155-token-wallet --template typescript
cd erc-1155-token-wallet
yarn && yarn run codegen
yarn add viem
```

Single deposits use packed fields (`token`, `sender`, `tokenId`, `value`) with an optional standard-ABI tail; batch deposits use packed `token` and `sender` followed by ABI-encoded `tokenIds`, `values`, and optional data fields. See [asset handling](../development/asset-handling.md#abi-encoding-for-deposits). Withdrawals emit vouchers whose `safeTransferFrom` or `safeBatchTransferFrom` sender is your on-chain application address (`metadata.app_contract` on each advance)—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC1155 wallet

Create `src/wallet/balance.ts`:

```typescript
import { Address } from "viem";

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
    const current = this.getAmount(erc1155, tokenId);
    if (current < amount) {
      throw new Error(
        `Insufficient balance for ${erc1155} id ${tokenId} on ${this.account}`
      );
    }
    this.holdings.get(erc1155)!.set(tokenId, current - amount);
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
import {
  Address,
  getAddress,
  encodeFunctionData,
  decodeAbiParameters,
  sliceHex,
  zeroHash,
  type Hex,
} from "viem";
import { erc1155Abi } from "viem";
import { Balance } from "./balance";
import { Voucher } from "..";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreate(account: Address): Balance {
    let balance = this.accounts.get(account);
    if (!balance) {
      balance = new Balance(account);
      this.accounts.set(account, balance);
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
    const [erc1155, account, tokenId, amount] = this.parseSingleDeposit(payload);
    return this.deposit(account, erc1155, tokenId, amount, "erc1155SingleDeposit");
  }

  processBatchDeposit(payload: Hex): string {
    const [erc1155, account, tokenIds, amounts] =
      this.parseBatchDeposit(payload);
    const balance = this.getOrCreate(account);
    for (let i = 0; i < tokenIds.length; i++) {
      balance.increase(erc1155, tokenIds[i], amounts[i]);
    }
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
    payload: Hex
  ): [Address, Address, bigint, bigint] {
    const erc1155 = getAddress(sliceHex(payload, 0, 20));
    const account = getAddress(sliceHex(payload, 20, 40));
    const tokenId = BigInt(sliceHex(payload, 40, 72));
    const amount = BigInt(sliceHex(payload, 72, 104));
    return [erc1155, account, tokenId, amount];
  }

  private parseBatchDeposit(
    payload: Hex
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
      sliceHex(payload, 40)
    );
    return [erc1155, account, tokenIds, amounts];
  }

  private deposit(
    account: Address,
    erc1155: Address,
    tokenId: bigint,
    amount: bigint,
    noticeType: string
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
    amount: bigint
  ): string {
    const fromBal = this.getOrCreate(from);
    const toBal = this.getOrCreate(to);
    fromBal.decrease(erc1155, tokenId, amount);
    toBal.increase(erc1155, tokenId, amount);
    return JSON.stringify({
      type: "erc1155SingleTransfer",
      content: { from, to, erc1155, tokenId: tokenId.toString(), amount: amount.toString() },
    });
  }

  transferBatch(
    from: Address,
    to: Address,
    erc1155: Address,
    tokenIds: bigint[],
    amounts: bigint[]
  ): string {
    if (tokenIds.length !== amounts.length) {
      throw new Error("tokenIds and amounts length mismatch");
    }
    const fromBal = this.getOrCreate(from);
    const toBal = this.getOrCreate(to);
    for (let i = 0; i < tokenIds.length; i++) {
      fromBal.decrease(erc1155, tokenIds[i], amounts[i]);
      toBal.increase(erc1155, tokenIds[i], amounts[i]);
    }
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
    amount: bigint
  ): Voucher {
    this.getOrCreate(account).decrease(erc1155, tokenId, amount);
    const call = encodeFunctionData({
      abi: erc1155Abi,
      functionName: "safeTransferFrom",
      args: [application, account, tokenId, amount, "0x"],
    });
    return { destination: erc1155, payload: call, value: zeroHash };
  }

  withdrawBatch(
    application: Address,
    account: Address,
    erc1155: Address,
    tokenIds: bigint[],
    amounts: bigint[]
  ): Voucher {
    const balance = this.getOrCreate(account);
    for (let i = 0; i < tokenIds.length; i++) {
      balance.decrease(erc1155, tokenIds[i], amounts[i]);
    }
    const call = encodeFunctionData({
      abi: erc1155Abi,
      functionName: "safeBatchTransferFrom",
      args: [application, account, tokenIds, amounts, "0x"],
    });
    return { destination: erc1155, payload: call, value: zeroHash };
  }
}
```

### Voucher creation

- **Single withdraw** encodes `safeTransferFrom(application, recipient, tokenId, amount, "0x")`.
- **Batch withdraw** encodes `safeBatchTransferFrom(application, recipient, ids[], amounts[], "0x")`.

Tokens deposited through the portals are held by your on-chain `Application` contract; the `from` address in the voucher must match `metadata.app_contract` from the advance. Set `value` to [`zeroHash`](https://viem.sh/docs/glossary/types#zeroHash) when no Ether is sent with the call.

## Using the wallet

Create `src/index.ts` to wire deposits from both portals and user operations sent as JSON inputs.

:::note Portal addresses
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `ERC1155SinglePortal` and `ERC1155BatchPortal` addresses into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
:::

```typescript
import createClient from "openapi-fetch";
import type { components, paths } from "./schema";
import { Wallet } from "./wallet/wallet";
import { stringToHex, getAddress, Address, hexToString, toHex } from "viem";

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

export type Notice = components["schemas"]["Notice"];
export type Report = components["schemas"]["Report"];
export type Voucher = components["schemas"]["Voucher"];

const wallet = new Wallet();
const ERC1155_SINGLE_PORTAL = `0xYOUR_ERC1155_SINGLE_PORTAL_ADDRESS`;
const ERC1155_BATCH_PORTAL = `0xYOUR_ERC1155_BATCH_PORTAL_ADDRESS`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;

const parseBigIntArray = (values: string[] | string): bigint[] => {
  const list = Array.isArray(values) ? values : [values];
  return list.map((v) => BigInt(v));
};

const handleAdvance: AdvanceRequestHandler = async (data) => {
  const application = data.metadata.app_contract;
  const sender = data.metadata.msg_sender.toLowerCase();
  const payload = data.payload;

  if (sender === ERC1155_SINGLE_PORTAL.toLowerCase()) {
    const deposit = wallet.processSingleDeposit(payload);
    await createNotice({ payload: stringToHex(deposit) });
    return "accept";
  }

  if (sender === ERC1155_BATCH_PORTAL.toLowerCase()) {
    const deposit = wallet.processBatchDeposit(payload);
    await createNotice({ payload: stringToHex(deposit) });
    return "accept";
  }

  try {
    const body = JSON.parse(hexToString(payload)) as Record<string, unknown>;
    const { operation, mode } = body;
    const from = getAddress(body.from as Address);
    const erc1155 = getAddress(body.erc1155 as Address);
    const app = getAddress(application as Address);

    if (operation === "transfer" && mode === "single") {
      const notice = wallet.transferSingle(
        from,
        getAddress(body.to as Address),
        erc1155,
        BigInt(body.tokenId as string),
        BigInt(body.amount as string)
      );
      await createNotice({ payload: stringToHex(notice) });
    } else if (operation === "transfer" && mode === "batch") {
      const notice = wallet.transferBatch(
        from,
        getAddress(body.to as Address),
        erc1155,
        parseBigIntArray(body.tokenIds as string[]),
        parseBigIntArray(body.amounts as string[])
      );
      await createNotice({ payload: stringToHex(notice) });
    } else if (operation === "withdraw" && mode === "single") {
      const voucher = wallet.withdrawSingle(
        app,
        from,
        erc1155,
        BigInt(body.tokenId as string),
        BigInt(body.amount as string)
      );
      await createVoucher(voucher);
    } else if (operation === "withdraw" && mode === "batch") {
      const voucher = wallet.withdrawBatch(
        app,
        from,
        erc1155,
        parseBigIntArray(body.tokenIds as string[]),
        parseBigIntArray(body.amounts as string[])
      );
      await createVoucher(voucher);
    }
  } catch (error) {
    console.error("Error processing payload:", error);
  }

  return "accept";
};

const handleInspect: InspectRequestHandler = async (data) => {
  try {
    const query = hexToString(data.payload);
    const [kind, address, erc1155, tokenId] = query.split("/");
    if (kind !== "erc1155") {
      throw new Error(`Expected inspect kind erc1155, got ${kind}`);
    }
    if (tokenId !== undefined) {
      const amount = wallet.getBalance(
        getAddress(address as Address),
        getAddress(erc1155 as Address),
        BigInt(tokenId)
      );
      await createReport({
        payload: stringToHex(
          `Balance of ${erc1155} id ${tokenId} for ${address} is ${amount}`
        ),
      });
    } else {
      const summary = wallet.listBalances(
        getAddress(address as Address),
        getAddress(erc1155 as Address)
      );
      await createReport({ payload: toHex(JSON.stringify(summary)) });
    }
  } catch (error) {
    await createReport({
      payload: stringToHex(`Error processing inspect payload: ${error}`),
    });
  }
};

const createNotice = async (payload: Notice) => {
  await fetch(`${rollupServer}/notice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const createVoucher = async (payload: Voucher) => {
  await fetch(`${rollupServer}/voucher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const createReport = async (payload: Report) => {
  await fetch(`${rollupServer}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { data, response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });
    if (response.status === 200 && data) {
      const request = JSON.parse(data) as RollupRequest;
      switch (request.request_type) {
        case "advance_state":
          status = await handleAdvance(request.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(request.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

User input payloads use `mode`: `"single"` or `"batch"`, plus `operation`: `"transfer"` or `"withdraw"`.

**Single transfer:**

```json
{
  "operation": "transfer",
  "mode": "single",
  "erc1155": "0xTokenAddress",
  "from": "0xFromAddress",
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
  "from": "0xFromAddress",
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
  "from": "0xFromAddress",
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
  "from": "0xFromAddress",
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
ERC-1155 uses `setApprovalForAll` on the token contract for each portal operator. Approve **both** [`ERC1155SinglePortal`](../api-reference/contracts/portals/ERC1155SinglePortal.md) and [`ERC1155BatchPortal`](../api-reference/contracts/portals/ERC1155BatchPortal.md) before depositing through the corresponding portal.
:::

**Single deposit** — interactively:

```bash
cartesi deposit erc1155-single
```

Non-interactive alternative. Run from your **project root** (with `cartesi run` up):

```bash
MULTI=$(cartesi address-book 2>&1 | grep -i TestMultiToken | awk '{print $NF}')
SINGLE_PORTAL=$(cartesi address-book 2>&1 | grep -i ERC1155SinglePortal | awk '{print $NF}')

cast send "$MULTI" \
  "mint(address,uint256,uint256,bytes)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  1 100 0x \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cast send "$MULTI" \
  "setApprovalForAll(address,bool)" \
  "$SINGLE_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

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
BATCH_PORTAL=$(cartesi address-book 2>&1 | grep -i ERC1155BatchPortal | awk '{print $NF}')

cast send "$MULTI" \
  "mint(address,uint256,uint256,bytes)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  2 50 0x \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cast send "$MULTI" \
  "setApprovalForAll(address,bool)" \
  "$BATCH_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cartesi deposit erc1155-batch 1,2 10,20 \
  --token "$MULTI" \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

### Balance checks (Inspect)

Inspect payloads use UTF-8 strings (hex-encoded in the JSON body):

- Single ID: `erc1155/0xUser/0xContract/1`
- All IDs for a contract: `erc1155/0xUser/0xContract`

### Transfers and withdrawals

Interactively:

```bash
cartesi send
```

Non-interactive examples (from project root):

```bash
cartesi send --encoding string \
  '{"operation":"transfer","mode":"single","erc1155":"0xTokenAddress","from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","to":"0x70997970C51812dc3A010C7d01b50b0d17e98F2a","tokenId":"1","amount":"5"}' \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","mode":"batch","erc1155":"0xTokenAddress","from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","tokenIds":["1","2"],"amounts":["5","10"]}' \
  --project-name erc-1155-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Replace `0xTokenAddress` with `TestMultiToken` from `cartesi address-book`.

### Using the explorer

Start the node with the explorer enabled to execute vouchers after an epoch closes:

```shell
cartesi run --services explorer
```

The local explorer is at `http://localhost:6751/explorer` (see [running an application](../development/running-an-application.md)).
