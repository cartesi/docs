---
id: grpc
title: Cartesi gRPC Interfaces
---
The Cartesi GRPC Interfaces repository contains all GRPC and Protobuf definitions used in the GRPC interfaces of the Cartesi Project modules. Currently these comprehend:

- A definition of basic message types used in multiple interfaces (cartesi-base.proto)
- A definition of the services exported by the machine emulator and used by the machine manager (core.proto)
- A definition of the services and higher level message types used by the machine emulator to interact with the machine manager (manager-low.proto) 
- A definition of the services and higher level message types used to interact with the machine manager sessions (manager-high.proto)
