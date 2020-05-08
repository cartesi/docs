---
title: Machine Manager
---

:::note Section Goal
- higher level management of machines
- architecture (gRPC <-> machine-manager <-> machine-emulator)
- session concept
- common operations
- gRPC communication and usage by the dispatcher
:::

## Introduction

This repository contains the server responsible for managing different sessions of Cartesi Machines. It has a submodule dependency, the machine-emulator repository, that contains the emulator GRPC server.

The easiest way of running the machine manager server + emulator and test them with a sample workload is through a docker container. To get started, follow [TL;DR;](#tldr)

You may also want to install all the dependencies in your system to compile the emulator natively and execute the machine manager server natively

