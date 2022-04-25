---
title: Drives
---

This section describes in detail the `Drive[] _inputDrives` parameter of the `instantiate` call.
It describes an array of `Drives`, each representing one of the inputs that the machine should receive before executing.

Since Cartesi Machines are deterministic, input drives are necessary to make their calculations interesting: without input drives, whenever the machine is executed it returns the same result to the output drive.

For example, our first [Hello World](hello) tutorial does exactly that, passing no drives to the `instantiate` call and always obtaining `"Hello World!"` as an output.

In order to specify input drives to the machine, one should start by looking at the `Drive` structure defined in `DescartesInterface.sol`:

```javascript
struct Drive {
    uint64 position;
    uint8 driveLog2Size;
    bytes directValue;
    bytes loggerIpfsPath;
    bytes32 loggerRootHash;
    address provider;
    bool waitsProvider;
    bool needsLogger;
}
```
Let's take a closer look at the most basic fields that compose a `Drive`:

- **`position`** refers to the beginning of the drive's representation with respect to the address space of the off-chain machine. The position of a drive is determined when building the Cartesi Machine, as explained previously for the [output drive's position](../instantiate);

- **`driveLog2Size`** similarly to the `outputLog2Size` parameter described in the previous section, this argument represents the log<sub>2</sub> of the input drive's size given in bytes. As such, a value of `10` would represent an input drive with a size of 1024 bytes. This value cannot be smaller than `5` (i.e., the drive size must be at least 32 bytes);

- **`directValue`** contains actual input data in the form of a variable size `bytes` array. This is the simplest and easiest way of specifying drive data, but may be problematic for larger chunks of data because of the storage limitations of the underlying blockchain.

## Direct drives

At this point, one can already explore an interesting range of applications with Descartes. To do that, let's instantiate a *direct drive* (i.e., a drive that directly specifies the data as a `bytes` array), leaving the other fields uninitialized:

```javascript
Drive({
    position: 0x9000000000000000,
    driveLog2Size: 5,
    directValue: "Alice",

    loggerIpfsPath: "",
    loggerRootHash: 0,
    provider: address(0),
    waitsProvider: false,
    needsLogger: false
})
```

In the above example, a drive is specified at position `0x9000000000000000` and with contents given by the string `"Alice"`.
The Linux machine running off-chain will receive this input and will be able to process it as desired.

Note, however, that there are two limitations to this way of dealing with the content of the drives. First, the contents have to be readily available at the time of drive initialization. Secondly, the drive sizes are in practice bounded by the maximum transaction size imposed by the Ethereum network itself. 

The two next sections describe how to overcome each of these limitations.
