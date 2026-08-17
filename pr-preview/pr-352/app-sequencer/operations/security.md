> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Production security"
sidebar_label: "Production security"
description: "Protect the submitter account, control public and internal routes, secure the base-layer connection, and prevent concurrent writers."
---

Production hardening focuses on four boundaries: the batch-submitter key, the HTTP listener, the base-layer RPC connection, and exclusive control of the deployment's state and wallet nonces.

The sequencer validates signed user transactions and protects several protocol boundaries itself. Authentication, TLS termination, traffic filtering, secret distribution, and instance coordination belong to the surrounding infrastructure.

## Protect the batch-submitter key

The batch-submitter key authorizes base-layer transactions from the address identified as the sequencer. Its holder can consume that account's nonces and submit inputs that the scheduler attempts to decode as batches.

The key is online because `run` signs batch submissions and recovery may sign replacement transactions. Store it in a secret manager and expose it to the process through a read-only file:

```bash
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE=/run/secrets/submitter-key
```

The sequencer reads the first line, trims it, derives the address, and checks that it matches the submitter identity pinned during setup.

Avoid `CARTESI_SEQUENCER_AUTH_PRIVATE_KEY` in production. Environment values can appear in process inspection, container configuration, diagnostic output, and shell history.

Exactly one key source must be configured for:

- `run`;
- `flush-mempool`;
- `setup --recovery`.

Plain `setup` rejects a signing key and accepts only the public submitter address.

Restrict the key file to the sequencer identity, mount it read-only, prevent it from entering logs or backups, and define a rotation procedure that accounts for the submitter identity pinned in storage and in canonical scheduler configuration.

## Use a dedicated submitter account

Use one batch-submitter account for one sequencer deployment. Do not share it with unrelated scripts, applications, or operator transactions.

The sequencer assigns consecutive Ethereum wallet nonces and persists the highest nonce it intends to use before broadcasting. Uncoordinated activity from another process can consume a nonce, block later transactions, or introduce an input the local batch history does not expect.

Keep the account funded and monitor its balance. Batch submission and mempool flushing both spend base-layer gas. A depleted account can prevent submission until unsettled batches approach the staleness deadline.

## Control public API exposure

The sequencer does not authenticate HTTP or WebSocket clients.

`POST /tx` requires a valid user signature, which prevents transaction forgery. It does not prevent request floods, signature-recovery work, application-validation load, or pressure on the inclusion queue.

`GET /ws/subscribe` also has no client authentication. Its fixed subscriber and catch-up limits do not replace perimeter protection. See the [WebSocket API reference](../api-reference/api.md#get-wssubscribe) for their exact values.

Place a gateway or reverse proxy in front of the sequencer to provide:

- TLS termination;
- network and identity-based access controls where required;
- request-rate and connection-rate limiting;
- client quotas;
- observability and abuse detection;
- request-body limits no larger than the sequencer's own 4 KiB limit for `POST /tx`.

The default listener is `127.0.0.1:3000`, which is local to the host. Changing `CARTESI_SEQUENCER_HTTP_ADDR` to a non-loopback interface is an explicit exposure decision.

## Separate public and internal routes

The current runtime merges public, feed, health, and snapshot routes onto one HTTP listener. It does not offer separate bind addresses or ports for ingress and operator endpoints.

Treat the route groups differently at the gateway:

| Route                                                      | Intended audience                    |
| ---------------------------------------------------------- | ------------------------------------ |
| `POST /tx`                                                 | Application clients                  |
| `GET /ws/subscribe`                                        | Authorized frontends and indexers    |
| `GET /livez`, `/readyz`, `/healthz`                        | Orchestrator and internal monitoring |
| `GET /finalized_state`, `/finalized_state/inclusion_block` | Watchdog and trusted operators       |
| `GET /latest_snapshot`                                     | Trusted indexers and operators       |

The snapshot routes stream application state and have no authentication. Deny them at the public ingress. A single-listener deployment can still enforce separation through path-based proxy rules and network policy.

Health endpoints reveal little data, but they are not required by public clients and should remain on the internal route tier.

## Secure the base-layer RPC connection

The sequencer refuses plaintext RPC to a non-loopback host by default. Use an `https://` endpoint whenever traffic leaves the host.

For a Docker, Kubernetes, or private VPC network where plaintext transport is intentionally protected by the network boundary, set:

```bash
CARTESI_SEQUENCER_ALLOW_INSECURE_RPC=true
```

This option only permits the transport. It does not authenticate the RPC, validate its operational quality, or protect traffic after it leaves the trusted network.

Apply the setting to every command that uses the RPC. Review it whenever the endpoint changes so a private-network exception is not accidentally reused with a public provider.

Keyed write paths verify the live RPC chain identifier against the deployment's pinned chain before signing. A mismatch is terminal. Protect RPC credentials separately because they can grant paid capacity or expose application traffic even when they cannot sign submitter transactions.

## Use one consistent RPC source

The design assumes the configured node can fail but returns a consistent, truthful chain view when it responds.

Avoid generic load-balanced pools in which requests can reach replicas with different safe heads, log indexes, mempools, or even chain configurations. This is especially important because setup detection, batch submission, recovery flushing, and input synchronization rely on related observations across calls.

If availability infrastructure sits in front of the node, it must preserve a consistent view and must not silently fail over to a different chain. Monitor the RPC's chain identifier, safe-head lag, log completeness, and error rate.

## Enforce single-instance operation

The deployment has no leader election or distributed writer coordination. Enforce one active keyed writer for each submitter account and data directory. [Prevent overlapping sequencer instances](./orchestration.md#prevent-overlapping-sequencer-instances) defines the excluded command combinations and safe update behavior.

## Production hardening checklist

- Store the submitter key in a read-only secret file.
- Use a dedicated, funded submitter account.
- Run exactly one keyed writer for the deployment.
- Keep the sequencer listener on an internal network.
- Terminate TLS and enforce path-based access at a gateway.
- Apply rate and connection limits to public API routes.
- Block snapshot and health routes from the public internet.
- Use one consistent HTTPS RPC source.
- Mount the data directory on durable storage with restricted permissions.
- Monitor disk capacity, submitter balance, exit codes, batch age, and watchdog status.
- Archive complete checkpoint directories outside the live data volume.
- Rehearse process restart and checkpoint recovery before production launch.

## Next steps

- Configure the runtime using [Configure, set up, and run the sequencer](./setup-and-running.md).
- Supervise keyed processes with [Process supervision and recovery operations](./orchestration.md).
- Review the broader assumptions in [Trust model and guarantees](../foundations/trust-model.md).
