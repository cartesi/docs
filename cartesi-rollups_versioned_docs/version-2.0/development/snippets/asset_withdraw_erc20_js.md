```javascript
import { Rollup } from "@cartesi/rollup";
import { encodeFunctionData, erc20Abi } from "viem";

const rollup = new Rollup();

const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

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
