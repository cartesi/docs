---
title: Logger Drive
---

A relevant limitation of the Cartesi Machines as they have been described until now is the size of their input drives.
More precisely, even though the provided drives have no exact size limitations, in practice there is a cap to the amount of data that can be used, which is given by the maximum transaction size currently allowed by the Ethereum network itself.

In other words, without using the *Logger Feature* presented here, there is a practical limitation to the amount of data that can be used to perform a computation using Descartes.

As such, this section describes how to use this service in order to submit much larger drives to the machine, without paying a prohibitively large transaction cost.

Recall the definition of the `Drive` structure:
```
struct Drive {
    uint64 position;
    uint64 driveLog2Size;
    bytes directValue;
    bytes32 loggerRootHash;
    address provider;
    bool waitsProvider;
    bool needsLogger;
```
To enable the Logger Service, we should set the Boolean variable `needsLogger` to `true`.

Similarly to what we described before, the field `waitsProvider` is still going to be very important when using the Logger.

Without provider
----------------

The field `waitsProvider` is set to `false` to indicate that the content of the drive is already known at the time of instantiation.

In this case, the field `loggerRootHash` should contain the hash of the input drive's contents.

A natural question at this point is how the blockchain becomes certain about the data availability of these drives? This is done through the Logger Service that we will document in another section.

:::warning
A new API that facilitates interacting with the Logger Service is under development and we plan to document the new API instead. Please contact the Cartesi Team if you are interested in using it right away.
:::

With provider
-------------

When `waitsProvider` is set to true, the contents of the drive will be later supplied by the user whose address is stored in the `provider` field.

As before, after all the users have successfully submitted all the drives, the claimer will automatically start the computations and submit the results.

:::warning
The same observation about the change in the Logger Service API applies in this case
:::
