---
id: cartesi-machine
title: Cartesi Machine
resources:
  - url: https://github.com/cartesi/machine-emulator
    title: Cartesi Machine Github
  - url: https://www.youtube.com/watch?v=uUzn_vdWyDM
    title: Cartesi Machine Deep Dive Video
---

# Cartesi Machine

The Cartesi Machine is the execution environment for the Cartesi Rollups and the Cartesi Coprocessor. It is a virtual machine designed to perform off-chain computations for blockchain applications. The Cartesi Machine is based on the [RISC-V ISA](https://riscv.org/), a set of instructions for processors. It runs an entire Linux OS, in which a dApp's backend is executed. It runs in isolation, meaning it operates independently and is reproducible. 

## Overview

When examined from a high level of abstraction, the Cartesi Machine can be compared to an AWS Lambda function, with similarities that encompass:

- Code execution: Code is executed based on specific inputs to perform computations, process data, or run custom logic, depending on the requirements of the task at hand.

- Abstraction of infrastructure: The underlying infrastructure is abstracted away, allowing you to focus on writing code without worrying about managing servers, hardware, or networking resources.

- Flexibility in programming languages and libraries: You have flexibility in the choice of programming languages and all open-source libraries available on Linux.

## State Management and Execution

The Cartesi Machine is a state machine that remains idle until a new request arises. The concept of state, in this case, is tied to both the input requests that the Cartesi Machine receives and the execution of the RISC-V instructions that the machine follows in processing those requests. The Cartesi Machine handles:

- Discrete states: RISC-V instructions are executed step-by-step, transitioning from one state to another.

- State transitions: State transitions happen deterministically as the emulator processes these RISC-V instructions, changing the system's state to a new discrete state.

- Determinism: Given the same initial state and input, the Cartesi Machine will always produce the same output and final state to ensure that off-chain computations can be verified and agreed upon.

- The Cartesi machine is self-contained and can't make an external request. To achieve reproducibility,it runs in isolation from any external influence on the computation. 
