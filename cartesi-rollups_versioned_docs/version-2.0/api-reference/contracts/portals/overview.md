---
id: overview
title: Portals
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals
    title: Portal contracts
---

Portal contracts transfer assets to an [`Application`](../application.md) and add an input describing the deposit to that Application's [`InputBox`](../input-box.md).

Portals do not store one global input-box address. For each deposit, the portal calls `Application.getInputBox()` and sends the input to the address returned by that Application. This allows different Applications to use different input boxes.

## Deposit sequence

1. The depositor grants the required token approval, when applicable.
2. The portal transfers the asset to the Application contract.
3. The portal encodes the depositor, asset information, amount, and optional data.
4. The portal obtains the Application's input box.
5. The portal adds the encoded deposit as an Application input.

Both the asset transfer and input submission occur in the same transaction. If either action reverts, the entire deposit reverts.

## Application and input-box checks

A portal can raise these errors before adding the input:

| Error | Meaning |
| --- | --- |
| `ApplicationNotDeployed` | The supplied Application address has no code |
| `ApplicationReverted` | Calling `getInputBox()` on the Application reverted |
| `IllformedApplicationReturnData` | `getInputBox()` did not return a valid address |
| `InputBoxNotDeployed` | The advertised input-box address has no code |

## Available portals

| Portal | Asset |
| --- | --- |
| [`EtherPortal`](./EtherPortal.md) | Ether |
| [`Erc20Portal`](./Erc20Portal.md) | ERC-20 tokens |
| [`Erc721Portal`](./Erc721Portal.md) | ERC-721 tokens |
| [`Erc1155SinglePortal`](./Erc1155SinglePortal.md) | One ERC-1155 token type |
| [`Erc1155BatchPortal`](./Erc1155BatchPortal.md) | Multiple ERC-1155 token types |

## Refunds after foreclosure

If a deposit input was not finalized before foreclosure, anyone can ask the Application to return the asset through the [deposit-refund flow](../refund/overview.md).

Contract depositors must be able to receive the refunded asset. Ether refunds require a payable receive path. ERC-721 and ERC-1155 refunds require the corresponding token-receiver hooks.
