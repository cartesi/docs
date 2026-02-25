```javascript
import { Parser } from "expr-eval";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const parser = new Parser();

function hex2str(hex) {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Buffer.from(normalized, "hex").toString("utf8");
}

function str2hex(text) {
  return "0x" + Buffer.from(text, "utf8").toString("hex");
}

async function emitNotice(payload) {
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
}

async function emitReport(payload) {
  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  try {
    const expression = hex2str(data.payload);
    const result = parser.evaluate(expression);
    await emitNotice(str2hex(String(result)));
    return "accept";
  } catch (error) {
    await emitReport(str2hex(`Error processing input: ${error}`));
    return "reject";
  }
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  await emitReport(data.payload);
  return "accept";
}

const handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

const finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: finish.status }),
    });

    if (finish_req.status === 202) {
      console.log("No pending rollup request, trying again");
      continue;
    }

    const rollup_req = await finish_req.json();
    const handler = handlers[rollup_req.request_type];
    finish.status = await handler(rollup_req.data);
  }
})();
```
