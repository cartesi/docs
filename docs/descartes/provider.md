---
title: Provider drives
---

In the last section, DApp developers could already specify drives with some contents, namely 32 bytes of data.

However, the data had to be ready and provided by the DApp at the time of instantiation.

This section describes an alternative to this, in which some user (here called *provider*) will be responsible to submit the contents of said drive.

This functionality will make use of two other fields of the `Drive` struct: `needsProvider` and `provider`.

These fields are very intuitive to use:
- `needsProvider` is a Boolean value indicating the need to have someone provide the value at a later time;
- `provider` stands for the address of the provider who has the authorization to fill that value.

When using the *provider* feature, the field `directValueOrLoggerRoot` will be ignored during instantiation and it is wise to leave it empty as in the following example.
```
Drive({
    position: 0x8000000000000000,
    directValueOrLoggerRoot: bytes32(0),
    needsProvider: true,
    provider: address(0x1234567890abcdef1234567890abcdef12345678),
    needsLogger: false,
    loggerLog2Size: 0,
})
```
The above drive specification indicates that only the user controlling the wallet `0x1234567890abcdef1234567890abcdef12345678` will be able to fill the contents of this drive, which is still limited to a 32 bytes input.

The next section lifts this limitation.

:::warning
The API that allows the provider to submit data is being refactored right now. So, please contact the Cartesi Team to implement this feature already using the new API.
:::
