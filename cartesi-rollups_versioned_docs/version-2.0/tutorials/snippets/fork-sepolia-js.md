```javascript
import { Rollup } from "@cartesi/rollup";

const rollup = new Rollup();

// In-memory store of all advance messages received from the InputRelayer
const messages = [];

await rollup.run({
  advance(request) {
    const relayer = request.msgSender;
    const inputIndex = request.index;
    const payload = request.payload;

    // Decode payload: first 20 bytes = sender address, remaining bytes = UTF-8 message.
    // The relayer forwards the payload unchanged, so this address is whatever the
    // caller wrote into it: it is not authenticated. Use request.msgSender for
    // anything that must be trusted.
    if (payload.length < 20) {
      console.error(
        "Payload too short to contain a 20-byte sender address, rejecting",
      );
      return false;
    }

    const originalSender = `0x${payload.subarray(0, 20).toString("hex")}`;
    const message = payload.subarray(20).toString("utf8");

    console.log(
      `[InputRelayer] input_index=${inputIndex} relayer=${relayer} original_sender=${originalSender} message="${message}"`,
    );

    messages.push({
      input_index: inputIndex.toString(),
      relayer,
      original_sender: originalSender,
      message,
    });

    return true;
  },
  inspect(request) {
    const route = request.payload.toString("utf8").replace(/^\//, "");
    console.log(`Inspect route: "${route}"`);

    let reportBody;
    if (route === "messages" || route === "") {
      reportBody = JSON.stringify(messages);
    } else if (route === "messages/count") {
      reportBody = JSON.stringify({ count: messages.length });
    } else {
      reportBody = JSON.stringify({ error: "unknown route", route });
    }

    rollup.emitReport(Buffer.from(reportBody, "utf8"));
  },
});
```
