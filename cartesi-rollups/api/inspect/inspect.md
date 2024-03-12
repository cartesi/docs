---
id: inspect
title: "Inspect state API"
---

Inspect requests are directly made to the Rollup Node, and the Cartesi Machine is activated without modifying its state.

![img](../../inspect.png)

You can make a simple call from your frontend client to retrieve reports.

To perform an Inspect call, use an HTTP GET request to `<address of the node>/inspect/<request path>`. For example:

```shell
curl http://localhost:8080/inspect/mypath
```

Once the call's response is received, the payload is extracted from the response data, allowing the back-end code to examine it and produce outputs in the form of Reports.

From a frontend client, here is an example of extracting the payload from an inspect request:


```javascript
const response = await fetch("http://localhost:8080/inspect/mypath");
const result = await response.json();
for (let i in result.reports) {
  let payload = result.reports[i].payload;
}
```
