---
title: Provider drives
---

After going through the last section, the reader is already able to specify drives if the data was available to the caller at the time of instantiation.

This section describes an alternative to this, in which the content of the drive can be left blank for later insertion.
In this case, an external user (here called the *provider*) will be responsible for submitting the contents of said drive later.

This functionality will make use of two other fields of the `Drive` struct: `waitsProvider` and `provider`.

The name of these fields already indicate their meanings:

- **`waitsProvider`** is a Boolean value indicating whether someone will provide the contents of said drive at a later time;

- **`provider`** denotes the address of the party that is responsible for the drive's contents, and that consequently has the authorization to fill in the data if it is not already available on the blockchain. As such, the `provider` will be automatically notified by Descartes whenever data needs to be submitted to the blockchain.

When using the *provider* feature, the field `directValue` will be ignored during instantiation. It is thus good practice to leave it empty as in the following example.

```javascript
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

After the computation has been instantiated, the user can submit the drive's required data directly by calling the following `provideDirectDrive` method on the Descartes smart contract:

```javascript
function provideDirectDrive(uint256 _index, bytes memory _value)
```

Where:

- **`_index`** is the Descartes computation index returned by the [instantiate method](../instantiate);

- **`_value`** corresponds to the drive's provided data, directly given as a variable size `bytes` array.

After all the drives that require a provider have been filled (in the order they appear in the [instantiate method](../instantiate)'s `_inputDrives` field), the machine will be executed automatically by the claimer.

Note that in the above example drives are still limited by the storage restrictions of the underlying blockchain, which in the case of Ethereum would certainly mean that input data of more than 1024 bytes could become impractical.
The next section lifts this limitation.
