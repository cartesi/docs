---
title: Logger Drive
---

A major limitation of the Cartesi Machines as they have been described until now is the size of input drives.
More precisely, without using the Logger Feature, one can submit drives no larger than 32 bytes in size.

This section describes how to use the Logger Service in order to submit much larger drives to the machine without paying a prohibitively large transaction cost.

The field of `Drive` that flags the activation of this feature is `needsLogger`.
When set to `true`, the system will not receive a 32 bytes input as the content of the drive, but rather as a hash describing the contents of the (potentially much larger) drive.

Recall the definition of the `Drive` structure:
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
Until now the `directValueOrLoggerRoot` has been used for the direct insertion of drive data. This will change now and it will represent a hash instead.
