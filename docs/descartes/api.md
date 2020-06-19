---
title: API
---

Descartes has two interfaces: a blockchain interface and an HTTP interface to access respectively the on-chain and off-chain parts of the infrastructure. Here is a summary of the responsibility and end-points of each of these interfaces.

## The on-chain API

All interactions with the Descartes infrastructure is done through a single smart contract, conveniently called Descartes. In this contract, there are only two endpoints that a developer needs to access. There are the functions `instantiate` and `getResult` and they are respectively responsible to start a new computation and obtain its output.

The `instantiate` call is a little more elaborate, as it needs to specify all the details of the machine, including its hash, maximum running time and metadata about its input drives. This is explained in detail in the next section.

In contrast, the `getResult` endpoint is very simple to understand. In a typical situation it returns the output of the computation (as written by the software running on Linux to the output drive). Or in other cases it can return error codes, for example when one fo teh parties involved misbehaves and is proved wrong in the dispute resolution that followed.

## The off-chain API

After the call for `instantiate`, the blockchain may already have all information that is necessary for executing the machine. But in many cases it also needs to get input from other users. In a game for example, the user may need to insert her decisions on input drives for later processing.

In such situations the user is called the “provider” for a certain drive. And the way in which this input is given is through a simple HTTP call to the local node representing the user. The node will automatically add this data into the blockchain in the form of the requested input drive.

In section [...] we will give the full details of this HTTP API, but for now it is important to understant that some input drives will have a “provider” who is responsible to fill-in its data before execution. And this is done through an HTTP call to the localhost.
