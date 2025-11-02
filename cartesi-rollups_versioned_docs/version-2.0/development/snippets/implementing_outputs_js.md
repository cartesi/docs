```javascript
import { stringToHex, encodeFunctionData, erc20Abi, hexToString, zeroHash } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);
  const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

  await emitNotice(payload);
  await emitReport(payload);

    const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [sender, BigInt(10)],
  });

  let voucher = {
    destination: erc20Token,
    payload: call,
    value: zeroHash,
  };

  await emitVoucher(voucher);
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data.payload;
  await emitReport(payload);
  return "accept";
}

const emitNotice = async (inputPayload) => {
  let hexPayload = stringToHex(inputPayload);
  try {
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    //Do something when there is an error
  }
}

const emitVoucher = async (voucher) => {
  try {
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucher),
    });
  } catch (error) {
    //Do something when there is an error
  }
};

const emitReport = async (payload) => {
  let hexPayload = stringToHex(payload);
  try {
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    //Do something when there is an error
  }
};

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
      body: JSON.stringify({ status: "accept" }),
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