---
title: Architecture
---

:::note Section Goal
- explain the react pattern and how it evolves to a state machine style
- explain the stateless trait and that it caches state
- explain communication with other node services through gRPC, and how this relates to its own stateless trait. Services are assumed to be idempotent.
- explain the provided communication links to the outside world through an HTTP interface, both for reading and writing data
- do this chapter describing the dispatcher like a blockchain powered application server.
- don't need to go into details of how it's implemented, or what the DApp developer needs to provide on top of it
- at this point we should be ready to introduce the other SDK components, in the following order: arbitration-dlib, tournament-dlib, logger-dlib, machine-manager
:::
