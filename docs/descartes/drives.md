---
title: Drives
---

This section describes in detail the `Drive[] _inputDrives` parameter of the `instantiate` call.
It describes an array of `Drives`, each representing one of the inputs that the machine should receive before executing.

Since Cartesi Machines are deterministic, input drives are necessary to make their calculations interesting: without input drives, whenever the machine is executed it returns the same result to the output drive.

For example, our first [Hello World](hello) tutorial does exactly that, passing no drives to the `instantiate` call and always obtaining `"Hello, World!"` as an output.

In order to specify input drives to the machine, one should start by looking at the `Drive` structure defined in `DescartesInterface.sol`:
```
struct Drive {
    uint64 position;
    bytes32 directValueOrLoggerRoot;
    bool needsProvider;
    address provider;
    bool needsLogger;
    uint64 loggerLog2Size;
}
```
What follows is a description of the fields that compose a `Drive`.

`position` refers to the beginning of the drive's representation with respect to the address space of the off-chain machine.
The position of a drive is determined when building the Linux Machine.
More on how to obtain this values can be found [here](http://localhost:3000/machine/target/architecture#linux-setup).

`directValueOrLoggerRoot` is a field that is used for two different purposes, depending on whether we are enabling the `logger` functionality or not.

The logger is used to input larger drives into the machine and will only be discussed in a later [section](./logger_drive).
For now, the reader should focus on what happens when the Logger is disabled and in this case only drives of 32 bytes are supported.

In this particular case, `directValueOrLoggerRoot` gives the content of this drive directly during the `instantiate` call.
So for example if the DApp wants to insert the string `"Alice"` inside an input drive, this string can be placed in the `directValueOrLoggerRoot` field directly (assuming that it is smaller than 32 bytes).

At this point, one can already specify small input drives (of 32 bytes each) for a Cartesi Machine.
This already gives an interesting range of applications to Descartes.
To do this, one doesn't need to initialize the other fields of `Drive`, such as in this example:
```
Drive({
    position: 0x8000000000000000,
    directValueOrLoggerRoot: bytes32("Alice"),
    needsProvider: false,
    provider: address(0),
    needsLogger: false,
    loggerLog2Size: 0,
})
```
In the above example, a drive is specified at position `0x8000000000000000` and with contents given by the string `"Alice"`.
The Linux machine running off-chain will receive this input and will be able to process is as desired.


But there are two limitations to this way of dealing with the content of the drives:
- First, these contents have to be available right at the time of initialization;
- Second, the drives are currently limited to 32 bytes.

The two next sections describe how to overcome each of these limitations.
