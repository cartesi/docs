> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: add-voucher
title: "Add a new voucher"
description: "The backend calls this method to emit a voucher while processing an advance-state request."
sidebar_label: "Add a new voucher"
hide_title: true
hide_table_of_contents: true
api: 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
sidebar_class_name: "post api-method"
info_path: cartesi-rollups/_versioned_docs/version-2.0/api-reference/rollup/cartesi-rollup-http-api
custom_edit_url: null
---

import MethodEndpoint from "@theme/ApiExplorer/MethodEndpoint";
import ParamsDetails from "@theme/ParamsDetails";
import RequestSchema from "@theme/RequestSchema";
import StatusCodes from "@theme/StatusCodes";
import OperationTabs from "@theme/OperationTabs";
import TabItem from "@theme/TabItem";
import Heading from "@theme/Heading";

<Heading
  as={"h1"}
  className={"openapi__heading"}
  children={"Add a new voucher"}
>
</Heading>

<MethodEndpoint
  method={"post"}
  path={"/voucher"}
  context={"endpoint"}
>
  
</MethodEndpoint>



The backend calls this method to emit a voucher while processing an advance-state request.
A voucher is a call that anyone can execute on the base layer, through the application contract's `executeOutput()` function, once the claim of its epoch has been accepted.
The application contract calls `destination` with `payload` as calldata, forwarding `value` Wei.

To send Ether to a wallet, leave the payload empty (`0x`) and set `value`: a call with a non-empty payload reverts when the destination has no code.

The response holds the index of the new output among all the outputs the application has emitted, which is the index the node uses for it.


<Heading
  id={"request"}
  as={"h2"}
  className={"openapi-tabs__heading"}
  children={"Request"}
>
</Heading>

<ParamsDetails
  parameters={undefined}
>
  
</ParamsDetails>

<RequestSchema
  title={"Body"}
  body={{"content":{"application/json":{"schema":{"type":"object","required":["destination","payload"],"properties":{"destination":{"type":"string","description":"Address the application contract calls when the voucher is executed.","example":"0x86EA17052C8e335Ad830B54EF566274EAB46B852"},"value":{"type":"string","description":"Amount of Wei sent with the call, as a `0x`-prefixed hex string of up to 32 bytes, with an even number of hex digits (for example 64). Defaults to zero when omitted.\n","example":"0x0000000000000000000000000000000000000000000000000000000000000000"},"payload":{"type":"string","description":"Calldata of the call: a function selector followed by its ABI-encoded arguments, in Ethereum hex format.\nUse `0x` (no calldata) to send Ether to an account that has no code.\n","example":"0xa9059cbb00000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f000000000000000000000000000000000000000000000000000000000000000a"}},"title":"Voucher"}}}}}
>
  
</RequestSchema>

<StatusCodes
  id={undefined}
  label={undefined}
  responses={{"201":{"description":"Created the voucher.","content":{"application/json":{"schema":{"type":"object","properties":{"index":{"type":"integer","format":"uint64","description":"Index of the output among all the outputs the application has emitted.","example":0}},"title":"IndexResponse"}}}},"400":{"description":"Invalid voucher.","content":{"text/plain":{"schema":{"type":"string","description":"Error message.","example":"address not valid","title":"Error"}}}}}}
>
  
</StatusCodes>


      