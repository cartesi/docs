```javascript
import { Rollup } from "@cartesi/rollup";
import { encodeFunctionData, erc20Abi } from "viem";

const rollup = new Rollup();

const erc20Token = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"; // devnet test ERC-20 token (TestToken)

await rollup.run({
  advance(request) {
    console.log(
      `Received advance request from ${request.msgSender} with payload ${request.payload.toString("utf8")}`,
    );

    // notice and report with the input payload
    rollup.emitNotice(request.payload);
    rollup.emitReport(request.payload);

    // voucher that transfers 10 units of the token to the sender
    const call = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [request.msgSender, 10n],
    });
    rollup.emitVoucher({ destination: erc20Token, value: 0n, payload: call });

    return true;
  },
  inspect(request) {
    console.log(
      `Received inspect request with payload ${request.payload.toString("utf8")}`,
    );
    rollup.emitReport(request.payload);
  },
});
```