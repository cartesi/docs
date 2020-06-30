---
title: The off-chain API
---

After the call for `instantiate`, the blockchain may already have all information that is necessary to execute the machine. But in many cases it also needs to get input from other users. In a game for example, the user may need to insert their decisions on input drives for later processing.

In such situations, the user is called the “provider” for a certain drive. The provider will send the data through a simple HTTP call to the Descartes Node that represent them. The node will automatically add this data into the blockchain in the form of the requested input drive.

In section [...] we will give the full details of this HTTP API, but for now it is important to understand that some input drives will have a “provider” who is responsible to fill-in its data before execution. And this is done through an HTTP call to the localhost.
