---
title: Provider drives
---

After going through the last section, the reader is already able to specify drives if the data was available to the caller at the time of instantiation.

This section describes an alternative to this, in which the content of the drive can be left blank for later insertion.
In this case, an external user (here called the *provider*) will be responsible for submitting the contents of said drive later.

This functionality will make use of two other fields of the `Drive` struct: `waitsProvider` and `provider`.

The name of these fields already indicate their meanings:
- `waitsProvider` is a Boolean value indicating whether someone will provide the contents of said drive at a later time;
- `provider` stands for the address of the provider who has the authorization to fill that value.

When using the *provider* feature, the field `directValue` will be ignored during instantiation. It is thus good practice to leave it empty as in the following example.
```
Drive({
    position: 0x9000000000000000,
    driveLog2Size: 10,
    directValue: "",
    provider: address(0x1234567890abcdef1234567890abcdef12345678),
    waitsProvider: true,
    needsLogger: false
})
```
The above drive specification indicates that only the user controlling the wallet `0x1234567890abcdef1234567890abcdef12345678` will be able to fill the contents of this drive.

After all the drives that require a provider have been filled (in the order they appear at `_inputDrives`), the machine will be executed automatically by the claimer.

Note that in the above example drives are still limited to 1024 bytes of input.
The next section lifts this limitation.

:::warning
The API that allows the provider to submit data is being refactored right now. So, please contact the Cartesi Team to implement this feature already using the new API.
:::
