> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
slug: /deployment/self-hosted
---

Self-hosting means running a Cartesi Rollups node yourself to deploy and operate your application, instead of using a third-party provider. This section covers two paths:

- **[Standard deployment](./standard.md)** runs the node and deploys a regular application. Start here if you do not need emergency withdrawal.
- **[Deployment with emergency withdrawal](./with-emergency-withdrawal.md)** builds on the standard setup and deploys the application with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md), so a guardian can foreclose it and users can recover their funds directly from the contracts. Read the [Foreclosure & Emergency Withdrawal](../../foreclosure/overview.md) concept first.

:::warning Production Warning
**This self-hosted approach should NOT be used in _production_.** It is designed for development and testing on **testnet**. It lacks production requirements such as public snapshot verification, security hardening, and production-grade infrastructure.
:::
