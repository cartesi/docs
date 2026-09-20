```js title="feed.mjs"
import WebSocket from "ws";

const sequencerUrl = process.env.SEQUENCER_URL;
if (!sequencerUrl) throw new Error("SEQUENCER_URL is required");

const fromOffset = process.env.FROM_OFFSET ?? "0";
const feedUrl =
  `${sequencerUrl.replace(/^http/, "ws")}` +
  `/ws/subscribe?from_offset=${fromOffset}`;
const socket = new WebSocket(feedUrl);

socket.on("open", () => {
  console.log(`Subscribed to ${feedUrl}`);
});

socket.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.log(JSON.stringify(message, null, 2));
});

socket.on("close", (code, reason) => {
  console.log(`Feed closed with code ${code}: ${reason.toString()}`);
});

socket.on("error", (error) => {
  console.error("Feed error:", error);
});
```
