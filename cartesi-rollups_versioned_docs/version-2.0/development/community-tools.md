---
id: community-tools
title: Community tools
---

Several tools created and maintained by the community streamline the dApp creation process on Cartesi Rollups.

## Deroll

Introducing Deroll, a powerful TypeScript framework designed to simplify the development of dApps on Cartesi.

- **Features**:
	- Simplifies dApp development with intuitive methods.
	- Handles advance and inspect requests easily.
	- Comprehensive wallet functionality for ERC20, ERC721 and ERC-1155 token standards.
	- Integrated router for complex routing logic.

- **Getting Started**:
	- Create a new Deroll project by running:
		```bash
		npm init @deroll/app
		```

- **Resources**:
	- [Deroll Documentation](https://deroll.dev)
	- [Deroll GitHub Repository](https://github.com/tuler/deroll)

---

## NoNodo

NoNodo is a cutting-edge development tool for Cartesi Rollups that allows applications to run directly on the host machine, bypassing Docker or RISC-V compilation.

- **Features**:
	- Run applications directly on the host machine for faster performance.
	- No Docker or RISC-V Required.

- **Getting Started**:
	- Install NoNodo by running:
		```bash
		npm install -g @nonodo/cli
		```
- **Resources**:
	- [NoNodo GitHub Repository](https://github.com/Calindra/nonodo)

---

## Cartesify

Cartesify is a robust Web3 client designed for seamless interaction with the Cartesi Machine.

- **Features**:
	- Send transactions to the Cartesi Machine.
	- Query data efficiently.
	- Engage with backend systems using a REST-like interface.

- **Resources**:
	- [Cartesify GitHub Repository](https://github.com/Calindra/cartesify)

---

## Tikua

Tikua is a versatile JS Cartesi package designed for seamless integration with any visual library, whether in browser or terminal environments.

- **Features**:
	- Integrates smoothly with any visual library on both Browser and Terminal.
	- Supports any provider or network with extensive configurability.
	- Handles multi-chain applications.
	- Provides warnings for unsupported provider chains.
	- Retrieve machine results.

- **Resources**:

	- [Tikua GitHub Repository](https://github.com/doiim/tikua)


---

## Rollmelette

Rollmelette is a high-level framework that simplifies building Cartesi applications using the Go programming language.

- **Features**:
	- Simplifies the development of Cartesi applications.
	- Provides a high-level API for interacting with the Cartesi Machine.
	- Simplifies sending inputs, retrieving outputs and asset handling 
	- Supports the Go programming language.

- **Resources**:
	- [Rollmelette GitHub Repository](https://github.com/rollmelette/rollmelette)

---

## Python-Cartesi 

Python-Cartesi is a high-level framework that simplifies the development of Cartesi applications using Python.

- **Features**:
	- Simplifies the development of Cartesi applications.
	- Prioritizes testing, equipping developers with tools to write tests for DApps within a local Python environment.
	- Allows full control over inputs and outputs for scenarios where high-level tools may be insufficient 
	- Supports the Python programming language.

- **Getting Started**:
	- Install Python-Cartesi by running:
		```bash
		pip install python-cartesi
		```
- **Resources**:
	- [Python-Cartesi GitHub Repository](https://github.com/prototyp3-dev/python-cartesi)

---

## TypeScript-SQLite template

A backend application built with TypeScript and SQLite, designed to complement a corresponding frontend project.

- **Features**:
	- TypeScript and SQLite for backend development.
	- Integration with React for the frontend.
	- Ethers.js for seamless blockchain interaction.
	- Template designed for easy project initiation.

- **Resources**:
	- [TypeScript-SQLite GitHub Repository](https://github.com/doiim/cartesi-ts-sqlite)
	- [Pre-deployed demo available on the Sepolia Network](https://doiim.github.io/cartesi-ts-react-sqlite/).

---

## Python-Wallet

A Python-based wallet implementation for Cartesi dApps designed to handle various types of assets.

- **Features**:
	- Simplifies asset handling for Cartesi dApps.
	- Deposit assets into the dApp.
	- Transfer assets within the dApp.
	- Withdraw assets from the dApp.

- **Resources**:
	- [Python-Wallet GitHub Repository](https://github.com/jplgarcia/python-wallet/tree/main)
	- [Full example](https://github.com/jplgarcia/python-wallet/blob/main/dapp.py)
---
## CartDevKit

CartDevKit is an all-in-one package for building on Cartesi.

- **Features**:
	- CLI tool for easy project setup.
	- Templates for backend, frontend and Cartesify.

- **Getting Started**:
	- Create a new project:
		```bash
		npx cartdevkit@latest create mydapp
		```

- **Resources**:
	- [CartDevKit GitHub Repository](https://github.com/gconnect/cartdev-kit)
	- [CartDevKit Documentation](https://africlab.gitbook.io/cartdevkit)