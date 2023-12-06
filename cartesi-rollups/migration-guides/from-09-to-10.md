---
id: from-09-to-10
title: Breaking Changes v1.0
tags: [learn, rollups, dapps, low-level developer]
---

This guide is designed to highlight the key distinctions between v0.9 and v1.0, offering assistance to those transitioning an existing application or individuals already acquainted with v0.9 who require a concise overview.

### GraphQL API

#### OutputValidityProof

The field names in [OutputValidityProof](../api/graphql/objects/output-validity-proof.mdx) have been changed. This includes:

| v0.9                   | v1.0                             |
| ---------------------- | -------------------------------- |
| inputIndex             | inputIndexWithinEpoch            |
| outputIndex            | outputIndexWithinInput           |
| keccakInHashesSiblings | outputHashInOutputHashesSiblings |

This change also affects the `OutputValidityProof` part of the [CartesidApp contract](../api/json-rpc/sol-output.md#outputvalidityproof).
