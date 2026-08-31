> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: erc-721-token-wallet
title: Integrating ERC721 token wallet functionality
---

This tutorial will guide you through creating a basic ERC721(NFT) token wallet using TypeScript for a Cartesi backend application.

## Setting up the project

First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project). Create a new project (for example `erc-721-token-wallet`) and install [`viem`](https://viem.sh/) only.

ERC-721 deposit payloads use packed fields (`token`, `sender`, `tokenId`) with an optional standard-ABI tail; see [asset handling](../development/asset-handling.md#abi-encoding-for-deposits). Withdrawals emit vouchers whose `safeTransferFrom` sender is your on-chain application address (`metadata.app_contract` on each advance)—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC721 wallet

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address } from "viem";

export class Balance {
  private account: string;
  private erc721Tokens: Map<Address, Set<number>>;

  constructor(account: string, erc721Tokens: Map<Address, Set<number>>) {
    this.account = account;
    this.erc721Tokens = erc721Tokens;
  }

  listErc721(): Map<Address, Set<number>> {
    return this.erc721Tokens;
  }

  getErc721Tokens(erc721: Address): Set<number> | undefined {
    return this.erc721Tokens.get(erc721);
  }

  addErc721Token(erc721: Address, tokenId: number): void {
    if (!this.erc721Tokens.has(erc721)) {
      this.erc721Tokens.set(erc721, new Set());
    }
    const tokens = this.erc721Tokens.get(erc721);
    if (tokens) {
      tokens.add(tokenId);
    } else {
      throw new Error(
        `Failed to add token ${erc721}, id:${tokenId} for ${this.account}`
      );
    }
  }

  removeErc721Token(erc721: Address, tokenId: number): void {
    if (!this.erc721Tokens.has(erc721)) {
      throw new Error(
        `Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Collection not found`
      );
    }
    const tokens = this.erc721Tokens.get(erc721);
    if (!tokens?.delete(tokenId)) {
      throw new Error(
        `Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Token not found`
      );
    }
  }
}
```

The `Balance` class represents an account's balance. It contains a map of ERC721 tokens and their corresponding token IDs.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import {
  Address,
  getAddress,
  encodeFunctionData,
  sliceHex,
  zeroHash,
  type Hex,
} from "viem";
import { Balance } from "./balance";
import { erc721Abi } from "viem";
import { Voucher } from "..";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreateBalance(address: Address): Balance {
    let balance = this.accounts.get(address);
    if (!balance) {
      balance = new Balance(address, new Map());
      this.accounts.set(address, balance);
    }
    return balance;
  }

  getBalance(address: Address): Balance {
    return this.getOrCreateBalance(address);
  }

  getErc721Balance(
    address: Address,
    erc721: Address
  ): { address: string; erc721: string; tokenIds: number[] } {
    const balance = this.getOrCreateBalance(address);
    const tokens = balance.getErc721Tokens(erc721) || new Set<number>();
    const tokenIdsArray = Array.from(tokens);

    const result = {
      address: address,
      erc721: erc721,
      tokenIds: tokenIdsArray,
    };

    console.info(
      `ERC721 balance for ${address} and contract ${erc721}: ${JSON.stringify(
        result,
        null,
        2
      )}`
    );
    return result;
  }

  processErc721Deposit(payload: string): string {
    try {
      const [erc721, account, tokenId] = this.parseErc721Deposit(payload);
      console.info(
        `Token ERC-721 ${erc721} id: ${tokenId} deposited in ${account}`
      );
      return this.depositErc721(account, erc721, tokenId);
    } catch (e) {
      return `Error depositing ERC721 token: ${e}`;
    }
  }

  private parseErc721Deposit(payload: Hex): [Address, Address, number] {
    const erc721 = getAddress(sliceHex(payload, 0, 20));
    const account = getAddress(sliceHex(payload, 20, 40));
    const tokenId = Number(BigInt(sliceHex(payload, 40, 72)));
    return [erc721, account, tokenId];
  }

  private depositErc721(
    account: Address,
    erc721: Address,
    tokenId: number
  ): string {
    const balance = this.getOrCreateBalance(account);
    balance.addErc721Token(erc721, tokenId);
    const noticePayload = {
      type: "erc721deposit",
      content: {
        address: account,
        erc721: erc721,
        tokenId: tokenId.toString(),
      },
    };
    return JSON.stringify(noticePayload);
  }

  withdrawErc721(
    application: Address,
    account: Address,
    erc721: Address,
    tokenId: number
  ): Voucher {
    try {
      const balance = this.getOrCreateBalance(account);
      balance.removeErc721Token(erc721, tokenId);
      const call = encodeFunctionData({
        abi: erc721Abi,
        functionName: "safeTransferFrom",
        args: [application, account, BigInt(tokenId)],
      });
      console.log("Voucher creator success", {
        destination: erc721,
        payload: call,
      });

      return {
        destination: erc721,
        payload: call,
        value: zeroHash,
      };
    } catch (e) {
      throw Error(`Error withdrawing ERC721 token: ${e}`);
    }
  }

  transferErc721(
    from: Address,
    to: Address,
    erc721: Address,
    tokenId: number
  ): string {
    try {
      const balanceFrom = this.getOrCreateBalance(from);
      const balanceTo = this.getOrCreateBalance(to);
      balanceFrom.removeErc721Token(erc721, tokenId);
      balanceTo.addErc721Token(erc721, tokenId);
      const noticePayload = {
        type: "erc721transfer",
        content: {
          from: from,
          to: to,
          erc721: erc721,
          tokenId: tokenId.toString(),
        },
      };
      console.info(
        `Token ERC-721 ${erc721} id:${tokenId} transferred from ${from} to ${to}`
      );
      return JSON.stringify(noticePayload);
    } catch (e) {
      return `Error transferring ERC721 token: ${e}`;
    }
  }
}
```

### Voucher creation

The `withdrawErc721` method encodes `safeTransferFrom(application, recipient, tokenId)` and returns a voucher. NFTs deposited through the portal are held by your on-chain `Application` contract; pass `metadata.app_contract` from the advance as the `from` address. Set `value` to [`zeroHash`](https://viem.sh/docs/glossary/types#zeroHash) when no Ether is sent with the call. See [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Using the wallet

Now, let's create a simple application at the entry point `src/index.ts` to test the wallet’s functionality.

The portal contract moves ERC-721 tokens from the base layer into your application. Deposits arrive as advances whose `metadata.msg_sender` is the portal address.

:::note Portal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `ERC721Portal` address into `index.ts`. Read the address from the active environment instead of hardcoding it. The contract interface is documented on the [`Erc721Portal`](../api-reference/contracts/portals/Erc721Portal.md) page.
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
export type Payload = components["schemas"]["Payload"];
export type Report = components["schemas"]["Report"];
export type Voucher = components["schemas"]["Voucher"];

const wallet = new Wallet();
// Replace with the ERC721Portal address from `cartesi address-book`
const ERC721Portal = `0xYOUR_ERC721_PORTAL_ADDRESS`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log(`HTTP rollup_server url is ${rollupServer}`);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const application = data["metadata"]["app_contract"];
  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === ERC721Portal.toLowerCase()) {
    // Handle deposit
    const deposit = wallet.processErc721Deposit(payload);
    await createNotice({ payload: stringToHex(deposit) });
  } else {
    // Handle transfer or withdrawal
    try {
      const { operation, erc721, from, to, tokenId } = JSON.parse(
        hexToString(payload)
      );

      if (operation === "transfer") {
        const transfer = wallet.transferErc721(
          getAddress(from as Address),
          getAddress(to as Address),
          getAddress(erc721 as Address),
          parseInt(tokenId)
        );

        await createNotice({ payload: stringToHex(transfer) });
      } else if (operation === "withdraw") {
        const voucher = wallet.withdrawErc721(
          getAddress(application as Address),
          getAddress(from as Address),
          getAddress(erc721 as Address),
          parseInt(tokenId)
        );

        await createVoucher(voucher);
      } else {
        console.log("Unknown operation");
      }
    } catch (error) {
      console.error("Error processing payload:", error);
    }
  }

  return "accept";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));

  try {
    const payloadString = hexToString(data.payload);

    const [address, erc721] = payloadString.split("/");

    const balance = wallet.getErc721Balance(
      address as Address,
      erc721 as Address
    );

    if (balance === undefined) {
      throw new Error("ERC721 balance is undefined");
    }

    await createReport({ payload: toHex(JSON.stringify(balance)) });
  } catch (error) {
    console.error("Error processing inspect payload:", error);
  }
};

const createNotice = async (payload: Notice) => {
  await fetch(`${rollupServer}/notice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const createVoucher = async (payload: Voucher) => {
  await fetch(`${rollupServer}/voucher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const createReport = async (payload: Report) => {
  await fetch(`${rollupServer}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
      // no rollup request available
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
```

Here is a breakdown of the wallet functionality:

- We handle deposits when the sender is the `ERC721Portal`.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- For `transfers`, we call `wallet.transferErc721` and create a notice with the parsed parameters.

- For `withdrawals`, we call `wallet.withdrawErc721` with the on-chain application address (`metadata.app_contract`) as the `safeTransferFrom` sender, then emit a voucher to the token contract.

- We created helper functions to `createNotice` for deposits and transfers, `createReport` for balance checks, and `createVoucher` for withdrawals.

## Build and run the application

With Docker running, [build your backend application](../development/running-an-application.md) by running:

```shell
cartesi build
```

To run your application, enter the command:

```shell
cartesi run
```

### Deposits

:::caution token approvals
An approval step is needed for the [**ERC721 token standard**](https://ethereum.org/en/developers/docs/standards/tokens/). This ensures you grant explicit permission for `ERC721Portal` to transfer tokens on your behalf.

Without this approval, the `ERC721Portal` cannot deposit your tokens to the Cartesi backend.

You will encounter this error if you don't approve the `ERC721Portal` address before deposits:

`ContractFunctionExecutionError: The contract function "depositErc721Token" reverted with the following reason: ERC721: insufficient allowance`
:::

To deposit ERC721 tokens interactively:

```bash
cartesi deposit erc721
```

Non-interactive alternative. Run from your **project root** (with `cartesi run` up). Resolve addresses from [`cartesi address-book`](../development/send-inputs-and-assets.md):

```bash
NFT=$(cartesi address-book 2>&1 | grep -i TestNFT | awk '{print $NF}')
ERC721_PORTAL=$(cartesi address-book 2>&1 | grep -i ERC721Portal | awk '{print $NF}')

cast send "$NFT" \
  "safeMint(address,uint256,string)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  1 \
  "https://example.com/metadata/1.json" \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cast send "$NFT" \
  "setApprovalForAll(address,bool)" \
  "$ERC721_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cartesi deposit erc721 1 \
  --token "$NFT" \
  --project-name erc-721-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Skip `safeMint` if token ID `1` is already minted to your address.

### Balance checks (used in Inspect requests)

Inspect payloads use the form `userAddress/erc721TokenAddress` as a UTF-8 string (hex-encoded in the JSON body). Example for user `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` and collection `0x5FbDB2315678afecb367f032d93F642f64180aa3`:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-721-token-wallet \
  -H "Content-Type: application/json" \
  -d '{"payload": "0x3078663339466436653531616164383846364634636536614238383237323739636666466239323236362f307835466244423233313536373861666563623336376630333264393346363432663634313830616133"}'
```

Replace the inspect path if your project name is not `erc-721-token-wallet` (see the URL printed by `cartesi run`). Build the payload with `stringToHex` from viem if you use different addresses.

### Transfers and Withdrawals

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then enter one of the sample payloads:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","erc721":"0xTokenAddress","from":"0xFromAddress","tokenId":"1"}' \
  --project-name erc-721-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

1. For transfers:

   ```js
   {"operation":"transfer","erc721":"0xTokenAddress","from":"0xFromAddress","to":"0xToAddress","tokenId":"1"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","erc721":"0xTokenAddress","from":"0xFromAddress","tokenId":"1"}
   ```

### Using the explorer

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

Start the node with the explorer service enabled:

```shell
cartesi run --services explorer
```

The local explorer is then available at `http://localhost:6751/explorer` (same port as the application node—see [running an application](../development/running-an-application.md)). The explorer is not started by plain `cartesi run`; you must pass `--services explorer`.

You can execute your vouchers via the explorer, which completes the withdrawal process at the end of [an epoch](../api-reference/backend/vouchers.md/#epoch-configuration).

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/main/erc-721-token-wallet)!
:::
