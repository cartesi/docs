---
title: Drives
---

This section describes in detail the `Drive[] _inputDrives` parameter of the `instantiate` call.

The `_inputDrives` argument describes an array of `Drives`, each representing one of the inputs that the machine should receive before executing.

A Cartesi Machine without any input drives is not very useful.
This is due to the fact that the machine is deterministic, so that whenever executed it will output the same result to the output drive.

However, our first [Hello World](hello) tutorial does exactly that, passing no drives to the `instantiate` call and obtaining a (not surprisingly) `"Hello, World!"` output.

In order to have at least one input drive to the machine, one should start by looking at the `Drive` structure defined in `DescartesInterface.sol`:
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

`position` is the first field in `Drive` and refers to the beginning of the drive's representation (with respect to the address space of the off-chain machine).
These value to be inserted here has been determined when building the Linux Machine and more on how to obtain this values can be found [here](http://localhost:3000/machine/target/architecture#linux-setup).

`directValueOrLoggerRoot` is a field that is used for two different purposes, depending on whether we are enabling the `logger` functionality or not.

The logger is used to input larger drives into the machine.
Without enabling the logger, only drives of 32 bytes are supported.
Since the logger will be described a later [section](./logger_drive), one can focus now on the `directValue` functionality of this field.

Without using the logger, the drive is restricted to 32 byte and the field `directValueOrLoggerRoot` gives the content of this drive directly during the `instantiate` call.

At this point, one can already specify input small input drives (of 32 bytes each) for a Cartesi Machine.
This already greatly expands the range of applications of Descartes.
To do this, one can simply not initialize the other fields of `Drive`, such as in this initialization example:
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


But there are two limitations to this way of dealing with the content of the drives:
- first, these contents have to be available right at the time of initialization;
- second, the drives are currently limited to 32 bytes.

The two next sections describe how to overcome these limitations.

