> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Submitting transactions"
sidebar_label: "Submitting operations"
description: "How to construct, sign, submit, retry, and interpret an application transaction sent to the sequencer."
---

A client sends a user operation to the sequencer as EIP-712 typed data. The sequencer verifies the signature, applies the protocol and application checks, executes the operation against its predicted state, and stores accepted operations in order.

## Submit a transaction with POST /tx

Send a JSON request to:

```text
POST /tx
Content-Type: application/json
```

The request contains the sender's next nonce, maximum fee, application payload, EIP-712 signature, and expected signer:

```json
{
  "message": {
    "nonce": 0,
    "max_fee": 1100,
    "data": "0x..."
  },
  "signature": "0x...",
  "sender": "0x..."
}
```

Use `0x`-prefixed hexadecimal values. The application defines the payload encoding and its maximum decoded size. See [`POST /tx`](../api-reference/api.md#post-tx) for the exact field types, limits, and response schema.

## Sign the transaction with EIP-712

Sign the exact nonce, maximum fee, and payload sent in the request. The domain binds the signature to the deployment's chain and application contract, so a signature for another deployment is rejected.

[EIP-712 domain](../api-reference/eip712.md) defines the exact domain and `UserOp` type. The [Quickstart](./quickstart.md#step-3-sign-and-submit-a-transaction) contains a complete ethers example.

## Interpret the soft confirmation

HTTP `200` returns:

```json
{
  "ok": true,
  "sender": "0x...",
  "nonce": 0
}
```

Before returning `200`, the sequencer has validated, executed, and committed the operation to its provisional ordering. The response is therefore stronger than queue admission, but it remains a soft confirmation.

The response contains no feed offset, application output, batch number, frame number, or settlement status. Read the sequenced feed to discover its current ordering position. Feed appearance does not add a settlement guarantee because both responses come from the same off-chain sequencer.

## Manage the sender nonce

Nonces are maintained separately for each sender. A sender's first accepted operation uses nonce `0`; each accepted operation advances the expected value by one.

Clients should:

- store the next nonce for each sender;
- serialize submissions made by the same sender;
- advance the local nonce only after an HTTP `200` response;
- leave the nonce unchanged after a definite rejection;
- reconcile application state before deciding what to do after an ambiguous network failure.

The public API does not provide a nonce lookup endpoint. Applications can expose their own read model, or clients can maintain the value from their accepted submission history.

Concurrent requests with the same sender nonce race against one another. At most one can match the application's expected nonce after the earlier accepted operation advances it.

### Handle an ambiguous timeout

The endpoint waits for the storage commit before replying. A connection can still fail after the commit and before the client receives the response. In that case, the client cannot tell from the transport error whether the operation was accepted.

Do not automatically advance the nonce or sign a different operation with the same nonce. First reconcile using the application's state, an application-level transaction identifier, or a corrected replay of the sequenced feed. Retrying the identical signed request is safe from double execution because the nonce prevents a second inclusion, but the retry may return `EXECUTION_REJECTED` if the first attempt already succeeded.

![A signed submission can end in definite success, definite rejection, or an ambiguous transport failure. After an ambiguous failure, the client reconciles application state or the feed, treats confirmed evidence as acceptance, or retries the identical request and reconciles again if the outcome remains unknown.](../images/submission-timeout-recovery.jpg)

## Set the maximum fee

`max_fee` is a fee exponent, not a token amount. The sequencer rejects a value below the current frame price, while an accepted operation pays the committed frame price, which can be lower than the submitted maximum.

The current recommended value is not exposed through a public endpoint. Obtain a baseline from the operator. If the value is too low, update it, sign the changed message again, and resubmit with the same nonce. [Fees and data availability](../concepts/fees.md) defines the exponent and charging model.

## Handle submission errors

Use the stable error `code` and HTTP status for control flow, not the human-readable message. Handle errors by outcome:

- Correct definite request, signature, payload, fee, nonce, or application rejections before retrying. These responses do not consume the nonce.
- Retry overload and temporary unavailability with bounded backoff.
- Stop automatic retries and alert the operator for an internal error.
- Reconcile transport failures and lost responses because the operation may already have committed.

The [`POST /tx` reference](../api-reference/api.md#post-tx) lists every status and error code.

## Using the Rust client

The `sequencer-rust-client` crate wraps submission and WebSocket connection setup:

```rust
use sequencer_rust_client::SequencerClient;

let client = SequencerClient::new("http://127.0.0.1:3000")?;
let response = client.submit_tx(&request).await?;
let stream = client.subscribe(from_offset).await?;
```

`SequencerClient::new` uses a three-second HTTP timeout. Use `new_with_timeout` or `with_request_timeout` to change it.

`submit_tx` decodes a successful response and reports non-`200` responses as `SubmitRejected::Http`. Use `submit_tx_with_status` when the caller needs the raw HTTP status and response body for its own error-code handling.

The current client constructor accepts `http://` endpoints. Deployments that terminate TLS at a gateway need to connect through an appropriate internal HTTP endpoint or use another client until HTTPS endpoint support is added.

The Rust client opens the feed but leaves WebSocket message decoding, cursor persistence, reconnection, and catch-up recovery to the caller. See [Consuming the sequenced transaction feed](./reading-the-feed.md).

## Next steps

- Run the complete local flow in the [Quickstart](./quickstart.md).
- Consume accepted operations using [Consuming the sequenced transaction feed](./reading-the-feed.md).
- Check all public response shapes in [HTTP and WebSocket API](../api-reference/api.md).
