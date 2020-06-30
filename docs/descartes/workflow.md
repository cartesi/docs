---
title: Putting Things Together
---

To better understand how Descartes can be used, imagine the following simple Cartesi DApp with one claimer and one challenger. The DApp can be a skill-based game where players place their bets and challenge each other for the highest score over the blockchain. The winner takes the pot.

Typically, a blockchain DApp is composed of a set of smart contracts and an off-chain client that interacts with these contracts through HTTP calls sent to the blockchain node, that is either locally or remotely hosted.

DApps that use Descartes will work in a similar fashion, with two small differences:

- The DApp smart contracts will request computations to Descartes contract through a simple smart contract API;
- The off-chain DApp client will feed any additional data to the Descartes Node through an HTTP request.

Imagine the hypothetical skill-base game suggested above. In the game, Alice and Bob are two players that will challenge each other, following some procedure that is specified by the DApp. The DApp smart contracts should implement a betting logic, collect players' deposits and finally make a single transaction call to Descartes smart contract.

The instantiation of the Descartes contract distributes the roles of claimer and challenger to the nodes representing Alice and Bob and specify the Cartesi Machine that runs a program that is capable of computing their scores and determining the winner, henceforth called the *verification program*.

As the machine boots, the *verification program* is run. It expects to read the content from two input drives, holding separately the log of in-game actions from the two opponent players. It replays Alice's and Bob's moves and calculates their scores. Finally it writes to the output drive a code representing the player with highest score.

The Cartesi Machine, as instantiated from Descartes smart contract is initially specified as a *template machine*. This is the state of the machine with so-called pristine input and output drives, meaning drives whose contents have not been determined yet. A machine in such initial state is ready to produce outputs for whatever inputs it will be given.

As it will be clear in the next sections, the *template machine* is represented by Merkle-tree root hash that is passed at the instantiation Descartes contract. This hash is calculated by the target Cartesi Machine developer, who also prepares a root file system drive containing the *verification program*.

In this example, the template Cartesi Machine thus comprises four drives:
- The root file system containing the *verification program*;
- A pristine drive that will hold the log of in-game events of the claimer;
- A pristine drive that will hold the log of in-game events of the challenger;
- A pristine drive that will hold the code of the winner.

At some point of the playtime, Alice and Bob get to achieve their final scores. When that happens, the game client uses the HTTP API of the Descartes Nodes to submit the contents of the pristine input drives, i.e. the in-game event logs of the player. That means that Alice's client application submits the payload to Alice's Descartes Node. The node persists efficiently the drive content on the blockchain. The same happens to Bob.

What follows from this point is that the claimer has all the data required to run the *verification program*. The claimer node downloads the input drives from the blockchain and executes the program. It writes the result to the output drive and sends the claim back to the Descartes smart contract.

A challenging period starts. The challenger runs the same computation and verifies the results of the claimer. The challenger starts a dispute if the result doesn't match that of the claimer. The dispute resolution ensures that the honest party is always able to prove to the blockchain the incorrectness of its opponent, as long as their node doesn't miss any deadlines of the interactive dispute protocol.

Here is one possible high-level design for this high-score decentralized game. The developer uses TypeScript to code the game front-end, which is distributed by a game server that is remotely accessible over HTTPS. The game server has exclusive privileges to generate new game configurations and scheduled contests with write access to the respective functions of the game smart contracts.

![Descartes Workflow](/img/descartes-workflow.png)

The game smart contracts use the Descartes smart contract to initialize match resolutions. As described above, at initialization time, the Cartesi Machines are specified with empty input drives. The claimer and the challenger players have not played yet and thus not submitted their game logs.

On the client side, Alice and Bob have downloaded the game on their browser. The game contains the interactive graphic interface as well as the entire game logic. The opponents play it till the game is over and the final score is achieved. Then they submit their game logs via the HTTP API to the Descartes Node.
