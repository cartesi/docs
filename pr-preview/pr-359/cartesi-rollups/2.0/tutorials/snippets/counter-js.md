> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```javascript
import { Rollup } from "@cartesi/rollup";

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
    return this.count;
  }

  get() {
    return this.count;
  }
}

const counter = new Counter();
const rollup = new Rollup();

await rollup.run({
  advance(request) {
    console.log(
      `Received advance request from ${request.msgSender} with index ${request.index} and payload 0x${request.payload.toString("hex")}`,
    );
    const newValue = counter.increment();
    console.log(`Counter increment requested, new count value: ${newValue}`);
    return true;
  },
  inspect(request) {
    console.log(
      `Received inspect request with payload 0x${request.payload.toString("hex")}`,
    );
    console.log(`Current counter value: ${counter.get()}`);
  },
});
```
