---
title: Workflow
---

:::warning Should this section exist?
I am starting to consider if this section should be here.
One alternative would be to move on to Wallets and so on.
Then we have a *Simple Workflow* section, which does not involve providers.
Later we add the *Full Workflow* including providers.
My intuition is that such an organization would be much easier to read and probably to write as well.

Augusto
:::

To understand how Descartes is used, consider a basic Cartesi DApp setup, with one claimer and one challenger. This could be, for instance, a skill-based game where players place their bets and challenge each other for the highest score over the blockchain. The winner takes the pot.

Typically, a DApp is composed of a set of smart contracts and an off-chain client that interacts with these contracts through HTTP calls to the blockchain node, that is either locally or remotely hosted.

DApps that use Descartes will work in a similar fashion, with two small differences:

- The DApp smart contracts will request computations to Descartes contract through a simple smart contract API;
- The off-chain DApp client will feed any additional data to the Descartes Node through HTTP request


Imagine the hypothetical skill-base game described above. In the game, Alice and Bob are two players that will challenge each other, following some procedure that is specified by the DApp. The DApp smart contracts should implement the betting logic, collect deposits and finally make one single transaction call to Descartes smart contract. 

The objective of this transaction is to distribute the roles of claimer and challenger to the nodes representing Alice and Bob and specify the Cartesi Machines that will calculate their scores and define the winner.

:::warning Section Goal
Explain the generic workflow of Descartes (initializing pristine machines, adding input data, the Claimer running the computation and submitting the results, claiming period, challenging period, arbitration).
:::

The Cartesi Machine is specified with four drives: 
- The root file system containing the program that verifies the score of the players;
- An empty drive that will hold the log of in-game events of the claimer;
- An empty drive that will hold the log of in-game events of the challenger;
- An empty drive that will hold the code of the winner.

During the DApp implementation phase, the developer needs to prepare the root file system drive that contains the score verification program that will run in the Cartesi Machine. Refer to this section of the documentation to learn that.  
The developer also implements the client software the players will interact with. The client can be coded to run on the browser as a web application. Alternatively it can be a desktop or mobile app. 
Fast-forwarding to runtime, as a  match between Alice and Bob begins, each player has a limited period of time to submit their gameplay. Upon submission, the client application sends the in-game action log to the Descartes Node through a request to the HTTP API. The action log submitted by Alice becomes the content of Alice's previously empty log drive. The same happens to the log submitted by Bob. It fills Bob's previously empty log drive. . 

At this point, the four drives are ready and filled with all required data for the execution of the Cartesi Machine.  The claimer then runs the computation of the score of Alice and Bob. The main program running on the Cartesi Machine takes as input the players' in-game event logs from the respective input drives, processes their gameplay, calculates their scores and writes to the output drive the identifier of the winner.

Then, the challenger runs the same computation and verifies the results of the claimer. The challenger starts a dispute if the result doesn't match that of the claimer. 

Here is one possible high-level design for this high-score decentralized game. The developer uses TypeScript to code the game front-end, which is distributed by a game server that is remotely accessible over HTTPS. The game server has exclusive privileges to generate new game configurations and scheduled contests with write access to the respective functions of the game smart contracts. 

![Descartes Workflow](/img/descartes-workflow.png)

The game smart contracts use the Descartes smart contract to initialize match resolutions. As described above, at initialization time, the Cartesi Machines are specified with empty input drives. The claimer and the challenger players have not played yet and thus not submitted their game logs. 

On the client side, Alice and Bob have downloaded the game on their browser. The game contains the interactive graphic interface as well as the entire game logic. The opponents play it till the game is over and the final score is achieved. Then they submit their game logs via the HTTP API to the Descartes Node. 
