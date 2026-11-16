---
id: erc-721-token-wallet
title: Integrating ERC721 token wallet functionality
---

This tutorial will guide you through creating a basic ERC721(NFT) token wallet using TypeScript for a Cartesi backend application.

## Setting up the project

First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project): create a new TypeScript project, install [`viem`](https://viem.sh/) as a development dependency and let rolldown bundle it:

```bash
cartesi create erc-721-token-wallet --template typescript
cd erc-721-token-wallet
pnpm add -D viem@2.57.19
```

Then replace the contents of `rolldown.config.ts` with the configuration shown in the [Ether wallet tutorial](./ether-wallet.md#setting-up-the-project), which sets `external: ["@cartesi/rollup"]`.

ERC-721 deposit payloads use packed fields (`token`, `sender`, `tokenId`) with an optional standard-ABI tail; see [asset handling](../development/asset-handling.md#abi-encoding-for-deposits). Withdrawals emit vouchers whose `safeTransferFrom` sender is your on-chain application address (`request.appContract` on each advance request)—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC721 wallet

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import type { Address } from "viem";

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
        `Failed to add token ${erc721}, id:${tokenId} for ${this.account}`,
      );
    }
  }

  removeErc721Token(erc721: Address, tokenId: number): void {
    if (!this.erc721Tokens.has(erc721)) {
      throw new Error(
        `Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Collection not found`,
      );
    }
    const tokens = this.erc721Tokens.get(erc721);
    if (!tokens?.delete(tokenId)) {
      throw new Error(
        `Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Token not found`,
      );
    }
  }
}
```

The `Balance` class represents an account's balance. It contains a map of ERC721 tokens and their corresponding token IDs.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import type { Voucher } from "@cartesi/rollup";
import {
  type Address,
  encodeFunctionData,
  erc721Abi,
  getAddress,
  type Hex,
  sliceHex,
} from "viem";
import { Balance } from "./balance";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreateBalance(address: Address): Balance {
    const key = getAddress(address);
    let balance = this.accounts.get(key);
    if (!balance) {
      balance = new Balance(key, new Map());
      this.accounts.set(key, balance);
    }
    return balance;
  }

  getBalance(address: Address): Balance {
    return this.getOrCreateBalance(address);
  }

  getErc721Balance(
    address: Address,
    erc721: Address,
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
      `ERC721 balance for ${address} and contract ${erc721}: ${JSON.stringify(result)}`,
    );
    return result;
  }

  processErc721Deposit(payload: Hex): string {
    const [erc721, account, tokenId] = this.parseErc721Deposit(payload);
    console.info(
      `Token ERC-721 ${erc721} id: ${tokenId} deposited in ${account}`,
    );
    return this.depositErc721(account, erc721, tokenId);
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
    tokenId: number,
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
    tokenId: number,
  ): Voucher {
    const balance = this.getOrCreateBalance(account);
    balance.removeErc721Token(erc721, tokenId);
    const call = encodeFunctionData({
      abi: erc721Abi,
      functionName: "safeTransferFrom",
      args: [application, account, BigInt(tokenId)],
    });
    console.log("Voucher creation success", {
      destination: erc721,
      payload: call,
    });

    return {
      destination: erc721,
      value: 0n,
      payload: call,
    };
  }

  transferErc721(
    from: Address,
    to: Address,
    erc721: Address,
    tokenId: number,
  ): string {
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
      `Token ERC-721 ${erc721} id:${tokenId} transferred from ${from} to ${to}`,
    );
    return JSON.stringify(noticePayload);
  }
}
```

### Voucher creation

The `withdrawErc721` method encodes `safeTransferFrom(application, recipient, tokenId)` and returns a voucher. NFTs deposited through the portal are held by your on-chain `Application` contract; pass `request.appContract` from the advance request as the `from` address. The voucher's `value` is `0n` because no Ether is sent with the call. See [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Using the wallet

Now, let's create a simple application at the entry point `src/index.ts` to test the wallet’s functionality.

The [`Erc721Portal`](../api-reference/contracts/portals/ERC721Portal.md) contract moves ERC-721 tokens from the base layer into your application. Deposits arrive as advance requests whose `msgSender` is the portal address.

:::note Erc721Portal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `Erc721Portal` address for your network into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
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

// Replace with the Erc721Portal address from `cartesi address-book`
const ERC721_PORTAL: Address = "0xYOUR_ERC721_PORTAL_ADDRESS";

const rollup = new Rollup();
const wallet = new Wallet();

const handleAdvance = (request: AdvanceRequest): boolean => {
  console.log(
    `Received advance request from ${request.msgSender} with index ${request.index}`,
  );

  if (isAddressEqual(request.msgSender, ERC721_PORTAL)) {
    // Deposit: the portal names the collection, the depositor and the token ID
    const deposit = wallet.processErc721Deposit(bytesToHex(request.payload));
    rollup.emitNotice(stringToHex(deposit));
    return true;
  }

  // Transfer or withdrawal: always on behalf of the account that sent the input
  const owner = getAddress(request.msgSender);
  try {
    const { operation, erc721, to, tokenId } = JSON.parse(
      request.payload.toString("utf8"),
    );

    if (operation === "transfer") {
      const transfer = wallet.transferErc721(
        owner,
        getAddress(to),
        getAddress(erc721),
        Number(tokenId),
      );
      rollup.emitNotice(stringToHex(transfer));
    } else if (operation === "withdraw") {
      // The application contract holds the deposited NFTs, so it is the
      // `from` address of the `safeTransferFrom` call in the voucher
      const voucher = wallet.withdrawErc721(
        request.appContract,
        owner,
        getAddress(erc721),
        Number(tokenId),
      );
      rollup.emitVoucher(voucher);
    } else {
      throw new Error(`Unknown operation: ${operation}`);
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
    const [address, erc721] = request.payload.toString("utf8").split("/");
    if (address === undefined || erc721 === undefined) {
      throw new Error("expected userAddress/erc721TokenAddress");
    }
    const balance = wallet.getErc721Balance(
      getAddress(address),
      getAddress(erc721),
    );
    rollup.emitReport(stringToHex(JSON.stringify(balance)));
  } catch (error) {
    rollup.emitReport(
      stringToHex(`Error processing inspect payload: ${error}`),
    );
  }
};

await rollup.run({ advance: handleAdvance, inspect: handleInspect });
```

This code uses the `Rollup` class of [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup), which the template already depends on: `rollup.run()` passes each request to `handleAdvance` or `handleInspect`, with the payload as a Node.js `Buffer`, and an advance handler rejects the input when it returns `false`.

Here is a breakdown of the wallet functionality:

- We handle deposits when the sender is the `Erc721Portal`. The portal writes the collection, the depositor's address and the token ID in the payload, and the wallet credits the token to the depositor.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- The account that sends the input is the owner of the operation: transfers and withdrawals always move tokens of `request.msgSender`, and the payload has no `from` field. Anyone can write any address in a JSON payload, but nobody can send an input on behalf of another account, so reading the owner from the payload would let anyone take anyone's NFTs.

- For `transfers`, we call `wallet.transferErc721` and create a notice with the parsed parameters.

- For `withdrawals`, we call `wallet.withdrawErc721` with the on-chain application address (`request.appContract`) as the `safeTransferFrom` sender, then emit a voucher to the token contract with `rollup.emitVoucher`.

- When an operation fails, for example because the sender does not own the token, we emit the error as a report with `rollup.emitReport` and reject the input. Inspect requests answer balance checks with a report as well.

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
An approval step is needed for the [**ERC721 token standard**](https://ethereum.org/en/developers/docs/standards/tokens/). This ensures you grant explicit permission for `Erc721Portal` to transfer tokens on your behalf.

Without this approval, the `Erc721Portal` cannot deposit your tokens to the Cartesi backend.

If you don't approve the `Erc721Portal` address before depositing, the call to `depositErc721Token` reverts with the token contract's insufficient-approval error (for example, `ERC721InsufficientApproval` in OpenZeppelin 5 tokens).
:::

To deposit ERC721 tokens interactively:

```bash
cartesi deposit erc721
```

The depositing account must own the token. `TestNFT` has a public `mint` function, so mint the token first as shown below.

Non-interactive alternative. Run from your **project root** (with `cartesi run` up). Resolve addresses from [`cartesi address-book`](../development/send-inputs-and-assets.md):

```bash
NFT=$(cartesi address-book TestNFT)
ERC721_PORTAL=$(cartesi address-book Erc721Portal)

cast send "$NFT" \
  "mint(address,uint256)" \
  0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f \
  1 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cast send "$NFT" \
  "setApprovalForAll(address,bool)" \
  "$ERC721_PORTAL" \
  true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cartesi deposit erc721 1 \
  --token "$NFT" \
  --project-name erc-721-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Skip the `mint` call if token ID `1` already exists; each token ID can be minted only once. On success, the CLI prints `✔ Approved 1 NFT` and `✔ Deposited 1 NFT to <application address>`.

### Balance checks (used in Inspect requests)

Inspect payloads use the form `userAddress/erc721TokenAddress` as a UTF-8 string. The node passes the request body to your application unchanged as the inspect payload, so send that string as the body. Example for user `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f` and the `TestNFT` collection `0x0761b8e3aB06F458632974393C48765E6Ddc61bB`:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-721-token-wallet \
  -H "Content-Type: text/plain" \
  -d '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f/0x0761b8e3aB06F458632974393C48765E6Ddc61bB'
```

Replace the inspect path if your project name is not `erc-721-token-wallet` (see the URL printed by `cartesi run`). Replace the addresses in the body if you use different ones.

### Transfers and Withdrawals

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then enter one of the sample payloads:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","erc721":"0x0761b8e3aB06F458632974393C48765E6Ddc61bB","tokenId":"1"}' \
  --project-name erc-721-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

1. For transfers:

   ```js
   {"operation":"transfer","erc721":"0xTokenAddress","to":"0xToAddress","tokenId":"1"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","erc721":"0xTokenAddress","tokenId":"1"}
   ```

Replace `0xTokenAddress` with the collection address (`TestNFT` in the samples above, `0x0761b8e3aB06F458632974393C48765E6Ddc61bB`). The wallet moves tokens of the account that sends the input: `cartesi send` sends from devnet account 8 (`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`), the account that made the deposit above. If you pass `--from` to send from another account, the application rejects the input with a report unless that account owns the token in the wallet.

### Using the explorer

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

Start the node with the explorer service enabled:

```shell
cartesi run --services explorer
```

The local explorer is then available at `http://localhost:6751/explorer` (same port as the application node—see [running an application](../development/running-an-application.md)). The explorer is not started by plain `cartesi run`; you must pass `--services explorer`.

You can execute your vouchers via the explorer to complete the withdrawal. A voucher becomes executable only after [its epoch](../api-reference/backend/vouchers.md/#epoch-configuration) closes and the epoch's claim is accepted on-chain; until then, execution reverts.

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/af7e52df98999a28223283814bfde9a4f6f1add3/erc-721-token-wallet)!
:::