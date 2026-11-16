> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```javascript
import { Rollup } from "@cartesi/rollup";

const rollup = new Rollup();

const ONE_ETHER = 10n ** 18n; // amount in wei

await rollup.run({
  advance(request) {
    rollup.emitVoucher({
      destination: request.msgSender,
      value: ONE_ETHER, // @cartesi/rollup takes the amount in wei as a bigint
      // no payload: a wallet has no code to call, so the payload stays empty
    });
    return true;
  },
});
```
