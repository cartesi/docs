> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: cartesi-rollup-http-api
title: "Cartesi Rollup HTTP API"
description: "API of the Rollup HTTP Server of [machine-guest-tools 0.18.0](https://github.com/cartesi/machine-guest-tools/tree/v0.18.0/rollup-http/rollup-http-server)."
sidebar_label: Introduction
sidebar_position: 0
hide_title: true
custom_edit_url: null
---

import ApiLogo from "@theme/ApiLogo";
import Heading from "@theme/Heading";
import SchemaTabs from "@theme/SchemaTabs";
import TabItem from "@theme/TabItem";
import Export from "@theme/ApiExplorer/Export";

<span
  className={"theme-doc-version-badge badge badge--secondary"}
  children={"Version: 0.18.0"}
>
</span>

<Heading
  as={"h1"}
  className={"openapi__heading"}
  children={"Cartesi Rollup HTTP API"}
>
</Heading>



API of the Rollup HTTP Server of [machine-guest-tools 0.18.0](https://github.com/cartesi/machine-guest-tools/tree/v0.18.0/rollup-http/rollup-http-server).
The server runs inside the Cartesi Machine, next to the application backend, and listens on `http://127.0.0.1:5004`; the templates pass this address to the backend in the `ROLLUP_HTTP_SERVER_URL` environment variable.

The Python, Rust, Go and C++ templates use this API. The JavaScript and TypeScript templates do not: they use the `@cartesi/rollup` package, which makes the same calls directly to the machine.

All request and response bodies are JSON (up to 5 MiB). Binary data, such as payloads, is a string in Ethereum hex format: `0x` followed by two hexadecimal digits per byte. The `0x` prefix is required.

The example below is a backend that echoes every advance input as a notice and a report, and every inspect payload as a report.

```python
import os
import requests

rollup = os.environ["ROLLUP_HTTP_SERVER_URL"]

finish = {"status": "accept"}
while True:
    response = requests.post(rollup + "/finish", json=finish)
    response.raise_for_status()
    request = response.json()
    payload = request["data"]["payload"]

    if request["request_type"] == "advance_state":
        requests.post(rollup + "/notice", json={"payload": payload}).raise_for_status()
        requests.post(rollup + "/report", json={"payload": payload}).raise_for_status()
    else:
        requests.post(rollup + "/report", json={"payload": payload}).raise_for_status()
    finish["status"] = "accept"
```

If the backend process exits, the application stops for good: `rollup-init` reports an exception (see [/exception](./register-exception.api.mdx)), or the machine halts.


<div
  style={{"marginBottom":"var(--ifm-paragraph-margin-bottom)"}}
>
  <h3
    style={{"marginBottom":"0.25rem"}}
  >
    License
  </h3><a
    href={"https://www.apache.org/licenses/LICENSE-2.0.html"}
  >
    Apache-2.0
  </a>
</div>
      