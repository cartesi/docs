---
id: self-hosted-application-factory
title: SelfHostedApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/SelfHostedApplicationFactory.sol
    title: SelfHostedApplicationFactory contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/ISelfHostedApplicationFactory.sol
    title: ISelfHostedApplicationFactory interface
---

`SelfHostedApplicationFactory` deploys an Authority and its Application together at deterministic addresses. The Application is configured to use the new Authority as its outputs Merkle root validator.

The factory temporarily owns the Application during deployment, then renounces ownership. This makes the Application ownerless after the transaction completes and prevents later validator migration through ownership.

## Constructor

```solidity
constructor(
    IAuthorityFactory authorityFactory,
    IApplicationFactory applicationFactory
)
```

The constructor stores the two factories used by every deployment.

## `deployContracts()`

```solidity
function deployContracts(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external returns (IApplication application, IAuthority authority)
```

The function performs three steps in one transaction:

1. It deploys an Authority for `authorityOwner` with the requested epoch and claim-staging periods.
2. It deploys an Application that uses that Authority, the selected input box, and the supplied withdrawal configuration.
3. It renounces the Application's ownership.

The `salt` participates in both CREATE2 addresses. Reusing every deployment parameter and the same salt produces the same calculated addresses and cannot deploy a second copy at those addresses.

## `calculateAddresses()`

```solidity
function calculateAddresses(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external view returns (address application, address authority)
```

Returns the addresses that `deployContracts()` will use without deploying either contract. Every parameter must match the later deployment call.

## Factory views

```solidity
function getAuthorityFactory() external view returns (IAuthorityFactory)
function getApplicationFactory() external view returns (IApplicationFactory)
```

These functions expose the immutable factory dependencies.

:::note Deployment ownership
The function signatures accept an `IInputBox` directly. The factory owns the Application while it completes the deployment setup, then renounces ownership before the transaction finishes.
:::
