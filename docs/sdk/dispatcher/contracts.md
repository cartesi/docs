---
title: Contracts
---

:::note Section Goal
- explain the design pattern used in all of them (Instantiator interface and instantiate instead of constructor)
- explain what is a contract instance, active/inactive, concerned
- explain getSubInstances and how this evolves into a tree of instances
- explain getCurrentState and getState and how it maps to a state machine style of DApp 
- this chapter will be very loose at this point, but it will be useful later on.
:::

## Conformant Contracts

Each contract that wants to benefit from Cartesi's infrastructure must be organized in a certain fashion to facilitate interactions with it.

- `instances` The first aspect in this specification is that the smart contract should be organized around "instances".
More precisely, each conformant smart contract needs to contain an array of instances, each of which contains a struct describing that whole instance.
For example, in the partition smart contract, there is an array of instances, each of these instances represents a dispute between two players to find the point they disagree with.
- `uint currentInstance()` This returns the number of the last used instance plus one (so that it coincides with the number of instances already initialized).
- `bool isActive(uint instance)` These contracts should also implement a pure function, answering whether a given instance is still active or not.
This helps trim out the instances that need no more attention.
- `bool isConcerned(uint instance, address player)` There should be a pure function to determine if a certain player should be concerned with a certain instance.
Typically, this can be achieved by simply storing a list of concerned users and checking against it.
- `uint getNonce(uint instance)` Each instance should have a nonce that is incremented in every transaction (that is not reversed, of course).
This nonce will be important in various moments for the off-chain component to decide on how to react.
- `bytes getState(uint instance)` This pure function returns the current state of one particular instance.
Note that all data which is necessary for players to react to this instance should be returned by this function, although not necessarily the full state of the contract.
For example, in the case of partition, one possible return for this function would contain something like `[nonce: 5, state: 2, queryArray: [0, 200, 400, 600]]` encoded appropriately.
- `getSubInstances(uint instance)` this function returns other pairs `(address, instance)` of other smart contracts and instances that are relevante for the user.
For example, a verification game may depend on a partition instance stored in another contract.

