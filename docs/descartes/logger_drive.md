---
title: Logger Drive
---

A major limitation of the Cartesi Machines as they have been described until now is the size of their input drives.
More precisely, without using the Logger Feature, they are restricted to at most 32 bytes.

This section describes how to use the Logger Service in order to submit much larger drives to the machine without paying a prohibitively large transaction cost.

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
To enable the logger service, we should set the Boolean variable `needsLogger` to true.

Similarly to what we described before, the field `needsProvider` is still going to be very important when using the Logger.

Without provider
----------------

The field `needsProvider` is set to false to indicate that the content of the drive is already known at the time of instantiation.

In this case, the field `directValueOrLoggerRoot` should contain the hash of the input drive's contents.

A natural question at this point is how the blockchain becomes certain about the data availability of these drives? This is done through the Logger Service that we will document in another section.

:::warning
A new API that facilitates interacting with the Logger Service is under development and we plan to document the new API instead. Please contact the Cartesi Team if you are interested in using it right away.
:::

With provider
-------------

When `needsProvider` is set to true, the contents of the drive will be supplied by the user with address stored in the `provider` field later.

As before, after all the users have successfully submitted all the drives, the claimer will automatically start the computations and submit the results.

:::warning
The same observation about the change in the Logger Service API applies in this case
:::
