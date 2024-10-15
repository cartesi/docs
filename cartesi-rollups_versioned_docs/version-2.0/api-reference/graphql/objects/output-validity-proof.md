---
id: output-validity-proof
title: OutputValidityProof
hide_table_of_contents: false
---


Validity proof for an output.

```graphql
type OutputValidityProof {
  inputIndexWithinEpoch: Int!
  outputIndexWithinInput: Int!
  outputHashesRootHash: String!
  vouchersEpochRootHash: String!
  noticesEpochRootHash: String!
  machineStateHash: String!
  outputHashInOutputHashesSiblings: [String!]!
  outputHashesInEpochSiblings: [String!]!
}
```


## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `inputIndexWithinEpoch`| [`Int!`](../../scalars/int) | Local input index within the context of the related epoch. |
| `outputIndexWithinInput`| [`Int!`](../../scalars/int) | Output index within the context of the input that produced it. |
| `outputHashesRootHash`| [`String!`](../../scalars/string) | Merkle root of all output hashes of the related input, given in Ethereum hex binary format (32 bytes), starting with '0x'.|
| `vouchersEpochRootHash`| [`String!`](../../scalars/string) | Merkle root of all voucher hashes of the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x'.|
| `noticesEpochRootHash`| [`String!`](../../scalars/string) | Merkle root of all notice hashes of the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x'. |
| `machineStateHash`| [`String!`](../../scalars/string) | Hash of the machine state claimed for the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x'. |
| `outputHashInOutputHashesSiblings`| [`[String!]!`](../../scalars/string) | Proof that this output hash is in the output-hashes merkle tree. This array of siblings is bottom-up ordered (from the leaf to the root). Each hash is given in Ethereum hex binary format (32 bytes), starting with '0x'. |
| `outputHashesInEpochSiblings`| [`[String!]!`](../../scalars/string) | Proof that this output-hashes root hash is in epoch's output merkle tree. This array of siblings is bottom-up ordered (from the leaf to the root). Each hash is given in Ethereum hex binary format (32 bytes), starting with '0x'. |

