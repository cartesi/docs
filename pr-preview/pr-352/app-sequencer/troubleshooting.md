> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Troubleshooting"
sidebar_label: "Troubleshooting"
description: "Common questions and common errors, with what to do about them."
---

## Common questions

**Is a soft confirmation final?**
No. Treat it as a provisional result. See [Soft confirmations](./concepts/soft-confirmations.md).

**Can the sequencer steal funds?**
Sequencing does not give the service custody of application assets or authority over canonical state. See [Trust model and guarantees](./foundations/trust-model.md).

**Can it censor a user?**
It can refuse the fast path. Users can still submit supported actions through the application's direct-input path. See [Direct and sequenced inputs](./concepts/direct-vs-sequenced.md).

**Can the operator front-run users?**
Yes, in the sense that nothing in the protocol forces first come, first served, and the operator sees transactions before anyone else. An application where ordering carries value should treat the operator as trusted for fairness.

**Do deposits still work if the sequencer is down?**
They can still reach the `InputBox` as direct inputs. Canonical execution may wait for another recorded input to trigger the scheduler. See [Direct inputs during an outage](./recovery/failure-modes.md#direct-inputs-during-an-outage).

**How do I find out my next nonce?**
Track it in the client. There is no endpoint that reports it. The response to a successful submission echoes the nonce that was accepted.

**Why did my transaction disappear after being accepted?**
Its batch was invalidated after a recovery. Fee and application checks happen at submission, so an accepted transaction was not rejected for those reasons later.

## Errors when submitting

**`429` with code `OVERLOADED`.** The queue is full. Retry with bounded backoff.

**`400` with an invalid signature.** Usually the EIP-712 domain does not match. Check the chain id, and that `verifyingContract` is the application's address. Also check that `sender` matches the key that signed.

**`413`.** The complete request body exceeds the ingress limit. Reduce it before retrying.

**`422` with code `EXECUTION_REJECTED`.** Correct the maximum fee, nonce, or application condition, then sign again. See [Submitting transactions](./usage/submitting-operations.md#handle-submission-errors).

## Errors on the feed

**Closed immediately with code `1008`, `catch-up window exceeded`.** Initialize from a snapshot and subscribe from its offset. See [Recover after a long absence](./usage/reading-the-feed.md#recover-after-a-long-absence).

**Cannot connect because the server reports overload.** The subscriber limit has been reached. Use a small number of durable indexers instead of connecting every client directly.

**A transaction never appears.** Reconcile its status because its provisional history may have been invalidated. See [Soft confirmations](./concepts/soft-confirmations.md).

## Errors when running the sequencer

**`remote RPC must use https`.** The endpoint is plain HTTP to a non-loopback host. Use `https://`, or set `CARTESI_SEQUENCER_ALLOW_INSECURE_RPC=true` on **every** command that dials the base layer.

**Refuses to start, setup not complete.** It is looking at an unprepared directory. Check `CARTESI_SEQUENCER_DATA_DIR`, remembering the default is a relative path.

**Exit code 30.** Terminal. Do not restart in a loop. See [Constants and exit codes](./api-reference/constants-and-exit-codes.md).

**Restarts repeatedly.** Usually a base-layer connection that is unreachable or lagging, so the sequencer keeps stepping back from the deadline. Fix the connection.

**Batches stop being posted.** Check the submitter account has funds.

## Next steps

- For what can fail and how it is handled, see [Failure modes](./recovery/failure-modes.md).
- For terms, see the [App Sequencer glossary](./foundations/glossary.md).
