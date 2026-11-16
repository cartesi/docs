```javascript
import { Rollup } from "@cartesi/rollup";
import { Parser } from "expr-eval-fork";

const rollup = new Rollup();
const parser = new Parser();

await rollup.run({
  advance(request) {
    const expression = request.payload.toString("utf8");
    console.log(`Received advance request with expression ${expression}`);
    try {
      const result = parser.evaluate(expression);
      console.log(`Result: ${result}`);
      rollup.emitNotice(Buffer.from(String(result), "utf8"));
      return true;
    } catch (error) {
      rollup.emitReport(Buffer.from(`Error processing input: ${error}`, "utf8"));
      return false;
    }
  },
  inspect(request) {
    console.log(`Received inspect request with payload ${request.payload.toString("utf8")}`);
    rollup.emitReport(request.payload);
  },
});
```
