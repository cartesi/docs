```javascript
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

// In-memory store of all advance messages received from the InputRelayer
const messages = [];

/**
 * Decodes a hex string to a UTF-8 string.
 * Accepts with or without "0x" prefix.
 */
function hexToUtf8(hex) {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = Buffer.from(clean, "hex");
  return bytes.toString("utf8");
}

/**
 * Decodes a hex string to a Buffer.
 */
function hexToBuffer(hex) {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Buffer.from(clean, "hex");
}

/**
 * Encodes a string to a "0x"-prefixed hex string.
 */
function utf8ToHex(str) {
  return "0x" + Buffer.from(str, "utf8").toString("hex");
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const relayer = data.metadata.msg_sender;
  const inputIndex = data.metadata.input_index;
  const payload = data.payload;

  // Decode payload: first 20 bytes = original sender address (abi.encodePacked),
  // remaining bytes = UTF-8 message.
  const bytes = hexToBuffer(payload);

  if (bytes.length < 20) {
    console.error(
      "Payload too short to contain a 20-byte sender address, rejecting",
    );
    return "reject";
  }

  const originalSender = "0x" + bytes.slice(0, 20).toString("hex");
  const message = bytes.slice(20).toString("utf8");

  console.log(
    `[InputRelayer] input_index=${inputIndex} relayer=${relayer} original_sender=${originalSender} message="${message}"`,
  );

  messages.push({
    input_index: inputIndex,
    relayer,
    original_sender: originalSender,
    message,
  });

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const route = hexToUtf8(data.payload).replace(/^\//, "");
  console.log(`Inspect route: "${route}"`);

  let reportBody;
  if (route === "messages" || route === "") {
    reportBody = JSON.stringify(messages);
  } else if (route === "messages/count") {
    reportBody = JSON.stringify({ count: messages.length });
  } else {
    reportBody = JSON.stringify({ error: "unknown route", route });
  }

  const resp = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: utf8ToHex(reportBody) }),
  });
  console.log("Report response status: " + resp.status);

  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: finish["status"] }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
```
