> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: inspect
title: "Inspect application state"
description: "This method sends an inspect-state request to the application backend. The request body is"
sidebar_label: "Inspect application state"
hide_title: true
hide_table_of_contents: true
api: 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
sidebar_class_name: "post api-method"
info_path: cartesi-rollups/_versioned_docs/version-2.0/api-reference/inspect/inspect-state-http-api-for-cartesi-rollups
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
  children={"Inspect application state"}
>
</Heading>

<MethodEndpoint
  method={"post"}
  path={"/inspect/{application}"}
  context={"endpoint"}
>
  
</MethodEndpoint>



This method sends an inspect-state request to the application backend. The request body is
passed to the backend unchanged, as the raw bytes of the inspect payload. The node does not
interpret the body or its content type. The body can be at most 2 MiB (the size of the
Cartesi Machine CMIO RX buffer); larger bodies are rejected with HTTP 413.

Only `POST` is accepted. Other HTTP methods receive HTTP 405 with an `Allow: POST` header.

The node runs the request on a fork of the application's current machine state, so the
inspect cannot change the application state. `processed_input_count` tells how many inputs
that state includes. Inspect requests run concurrently: each application accepts up to its
`max_concurrent_inspects` execution parameter (default 10) at a time, and the whole inspect
server accepts up to `CARTESI_INSPECT_MAX_INFLIGHT` requests (default 64). Requests beyond
these limits are rejected with HTTP 503 instead of waiting in a queue.

A successful request returns HTTP 200 with a JSON body. The `status` field tells how the
inspection ended:
- `Accepted`: the backend accepted the request.
- `Rejected`: the backend rejected the request.
- `Exception`: the backend raised an exception. `exception_data` holds the exception
  payload, and `error` holds a fixed message.
- `MachineHalted`: the machine halted while processing the request.
- `Failed`: the node could not complete the inspection, for example because a cycle or time
  limit was reached. `error` holds a fixed message; details are only in the node logs.

`reports` holds the reports that the backend emitted, including the ones emitted before a
failure. Inspect reports are returned only in this response: the node does not store them,
so they are not available through the JSON-RPC API.


<Heading
  id={"request"}
  as={"h2"}
  className={"openapi-tabs__heading"}
  children={"Request"}
>
</Heading>

<ParamsDetails
  parameters={[{"in":"path","name":"application","required":true,"description":"The application's name or hex encoded address.","schema":{"type":"string"},"example":"my-dapp"}]}
>
  
</ParamsDetails>

<RequestSchema
  title={"Body"}
  body={{"required":false,"description":"Raw inspect payload, passed unchanged to the application backend. At most 2 MiB.","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}}}
>
  
</RequestSchema>

<StatusCodes
  id={undefined}
  label={undefined}
  responses={{"200":{"description":"Inspect state response.","content":{"application/json":{"schema":{"type":"object","required":["status","reports","processed_input_count"],"properties":{"status":{"type":"string","description":"How the inspection ended.","enum":["Accepted","Rejected","Exception","MachineHalted","Failed"],"example":"Accepted","title":"CompletionStatus"},"error":{"type":"string","description":"Fixed, human-readable message. Present only when `status` is `Exception` or `Failed`.\n","example":"The node could not complete the inspection"},"exception_data":{"type":"string","description":"Exception payload provided by the backend, in the Ethereum hex binary format.\nPresent only when `status` is `Exception`.\n","example":"0xdeadbeef","title":"ExceptionData"},"reports":{"type":"array","description":"Reports emitted by the backend while processing the request.","items":{"type":"object","properties":{"payload":{"type":"string","description":"Payload in the Ethereum hex binary format.\nThe first two characters are '0x' followed by pairs of hexadecimal numbers that correspond to one byte.\nFor instance, '0xdeadbeef' corresponds to a payload with length 4 and bytes 222, 173, 190, 239.\nAn empty payload is represented by the string '0x'.\n","example":"0xdeadbeef","title":"Payload"}},"title":"Report"}},"processed_input_count":{"type":"integer","description":"Number of inputs processed by the machine state that served this inspect request.","example":0}},"title":"InspectResponse"}}}},"400":{"description":"Bad request. The request body could not be read.","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"},"example":"Bad request"}}},"404":{"description":"Application not found. The node does not know the application.","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"},"example":"Application not found"}}},"405":{"description":"Method not allowed. Only `POST` is accepted (the response has an `Allow` header).","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"},"example":"Method not allowed"}}},"413":{"description":"Payload too large. The request body is larger than 2 MiB.","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"},"example":"Payload too large"}}},"500":{"description":"Internal error in the node.","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"}}}},"503":{"description":"Service unavailable. The inspect cannot run now. The body tells which case applies:\n- `service at capacity`: the inspect server already has `CARTESI_INSPECT_MAX_INFLIGHT`\n  requests in flight. The response has a `Retry-After` header (in seconds).\n- `Application inspect at capacity`: the application already runs `max_concurrent_inspects`\n  inspect requests. Retry later.\n- `Machine not ready`: the node has no machine loaded for the application, or the machine\n  was closed.\n- `Application is terminal; inspect unavailable`: the application status is terminal\n  (for example `DIVERGED` or `GUEST_EXCEPTION`). Retrying does not help.\n- `Application was foreclosed; machine unavailable`: the application was foreclosed and the\n  node no longer keeps its machine. Retrying does not help.\n","content":{"text/plain":{"schema":{"type":"string","description":"Fixed error message.","title":"Error"},"example":"Machine not ready"}}}}}
>
  
</StatusCodes>


      