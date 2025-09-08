# Honeypot with PRT 

## Architecture Overview

The Honeypot v2 is secured by Permissionless Refereed Tournament(PRT) as the fraud proof system. Its core on‐chain components include the _Application contract_ (the Honeypot app itself) and a separate _Rollups-PRT Consensus contract_ that orchestrates the PRT consensus logic.  In the v2 deployment on Ethereum Mainnet, a 3‑layer PRT consensus (also known as _PRT‑3L_) is used. 

![Honeypot with PRT](../images/honeypot-prt-architecture.png)

## On-Chain Components

#### **Honeypot Application Contract** 
The Application contract is the on-chain representation of the Honeypot app. It stores the genesis hash of the Honeypot's Cartesi machine. As any other Cartesi rollups application, the Application contract is responsible for holding user deposits and executing outputs. However, it does not verify output validity itself. Instead, it delegates this responsibility to the DaveConsensus contract. When a Honeypot node produces a _voucher_ as output, the app contract’s `executeOutput(bytes output, OutputValidityProof proof)` function is invoked. This function first calls `validateOutput(output, proof)`, which in turn checks the Merkle proof against the current output.

Thus, withdrawing ERC-20 tokens to the pre-configured address of the Honeypot is only possible if DaveConsensus has marked the corresponding output root as valid. Only after validation does the contract can successfully execute a withdrawal voucher of the Honeypot.

#### **PRT-Rollups Consensus (DaveConsensus)** 
The DaveConsensus contract orchestrates the PRT system for the Honeypot application. It keeps track of [epochs](../../../fraud-proofs/fraud-proof-basics/epochs) and manages the tournament for each epoch. Importantly, it implements both `IDataProvider` and `IOutputsMerkleRootValidator`. Application outputs are considered valid if and only if DaveConsensus has stored that output-root as acceptable. In DaveConsensus, the function `isOutputsMerkleRootValid(address app, bytes32 root)` simply checks a mapping set during settlement. This value is set to true only when a tournament has been settled successfully for that epoch and the outputsMerkleRoot has been verified via on-chain computations.

## Off-Chain Components

The Honeypot uses Cartesi’s Rollups node with PRT support. This includes:

#### **Honeypot PRT Node** 
The Honeypot-PRT node executes the Honeypot Cartesi Machine (with the provided `honeypot.cpp`) and participates in the PRT fraud proof system. The node listens for new inputs from the _InputBox_ contract on L1, advances the Cartesi machine to compute outputs, and either submits a `settle` call or joins disputes. Running the Honeypot node is permissionless and any node can challenge correctness of computations to guarantee the integrity of the rollup.

:::note Run a Honeypot Node
Checkout the Honeypot wiki to learn how to run a node that participates in PRT [here](https://github.com/cartesi/honeypot/wiki).
:::

When an epoch is sealed and the node detects that no tournaments remain unresolved, it will call `settle(epoch, outputsMerkleRoot, proof)` on DaveConsensus. This settle call verifies the Merkle proof of the final machine state, records the outputs root as valid, and opens the next epoch to receive inputs. Once DaveConsensus has accepted a root in this way, the Honeypot Application contract will honor any vouchers contained within it, such as withdrawals of deposited tokens.

Under the hood, the Honeypot-PRT node listens to the events emitted by the PRT contracts, and tracks tournament state. When disputes arise, it reacts to those events by issuing the required tournament moves.