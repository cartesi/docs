---
id: fraud-proofs
title: Fraud-proof system - Dave
resources:
  - url: https://github.com/cartesi/dave
    title: Dave Github
  - url: https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a
    title: Dave Comparison with other fraud-proof systems
---

Dave is Cartesi's dispute resolution algorithm designed to address shortcomings in existing fraud-proof protocols. Traditional fraud-proof systems often face challenges such as delay attacks and vulnerability to Sybil attacks, where malicious nodes can disrupt operations by continuously challenging transactions or overwhelming honest validators.

## How does it work?

Dave introduces an approach where the resources required to defend against disputes grow logarithmically with the number of opponents. This means that defending against challenges remains affordable for a single honest node, even in the face of multiple attackers.

With Dave, a single honest participant can effectively defend their claims on-chain, ensuring the integrity of transactions without relying on trust in validators. Based on the Permissionless Refereed Tournaments algorithm, this protocol empowers anyone to validate rollups and uphold correct states on-chain, enhancing transaction security and reliability.

Similar to how a consensus algorithm is crucial for achieving agreement on a single state of the blockchain among all nodes in a base-layer chain, Dave plays a fundamental role in ensuring the integrity and trustworthiness of state transitions within Cartesi Rollups.