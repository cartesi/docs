---
title: Provider drives
---

After going through the last section, the reader is already able to specify drives (limited to 32 bytes of data) if this data was available to the caller at the time of instantiation.

This section describes an alternative to this, in which the content of the drive can be left blank for later insertion.
In this case, an external user (here called the *provider*) will be responsible to submit the contents of said drive later.

This functionality will make use of two other fields of the `Drive` struct: `needsProvider` and `provider`.

The name of these fields already indicate their meanings:
- `needsProvider` is a Boolean value indicating whether someone will provide the contents of said drive at a later time;
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
The above drive specification indicates that only the user controlling the wallet `0x1234567890abcdef1234567890abcdef12345678` will be able to fill the contents of this drive.

After all the drives that require a provider have been filled (in the order they appear at `_inputDrives`), the machine will be executed automatically by the claimer.

Note that in the above example drives are still limited to a 32 bytes of input.
The next section lifts this limitation.

:::warning
The API that allows the provider to submit data is being refactored right now. So, please contact the Cartesi Team to implement this feature already using the new API.
:::
