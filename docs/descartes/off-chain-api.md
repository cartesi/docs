---
title: The off-chain API
---

After the call for `instantiate`, the blockchain may already have all information that is necessary for executing the machine. But in many cases it also needs to get input from other users. In a game for example, the user may need to insert her decisions on input drives for later processing.

In such situations the user is called the “provider” for a certain drive. And the way in which this input is given is through a simple HTTP call to the local node representing the user. The node will automatically add this data into the blockchain in the form of the requested input drive.

In section [...] we will give the full details of this HTTP API, but for now it is important to understant that some input drives will have a “provider” who is responsible to fill-in its data before execution. And this is done through an HTTP call to the localhost.
