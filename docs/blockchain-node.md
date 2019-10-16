---
id: blockchain-node
title: Blockchain Node
---
The Cartesi Blockchain Node is a development/testing Ganache Ethereum node instance that runs inside a docker container and has all Cartesi blockchain contracts deployed. The contracts come from two different repositories that are submodules of this repository:

- Contracts
- RISC-V Solidity


## Getting Started

### Requirements

- Docker
- Git

### Clone the repository

```
$ git clone --recurse-submodules git@github.com:cartesi/cartesi-blockchain-node.git
```
### Build the docker image

```bash
$ ./build_cartesi_blockchain_node_image.sh
```

### Create an ephemeral container and execute the server

```bash
$ ./execute_cartesi_blockchain_node_ephemeral_container.sh
```

Once you do that you'll have a local instance listening on port 8545 ready to interact with any ethereum node client using the JSON-RPC interface. 
