```javascript
import { Rollup } from "@cartesi/rollup";
import { encodeFunctionData, erc20Abi } from "viem";

const rollup = new Rollup();

const erc20Token = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"; // devnet test ERC-20 token (TestToken)

await rollup.run({
  advance(request) {
    const call = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [request.msgSender, 10n],
    });

    rollup.emitVoucher({
      destination: erc20Token, // the token contract
      value: 0n, // no Ether sent with the call
      payload: call,
    });
    return true;
  },
});
```
