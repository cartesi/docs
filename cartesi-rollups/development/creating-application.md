---
id: creating-application
title: Creating an application
tags: [create, dapp, developer]
---

Sunodo simplifies creating dApps on Cartesi

To create a new application, run:

```shell
sunodo create <dapp-name> --template <language>
```

For example, create a Python project.

```
sunodo create new-dapp --template python.
```

This command creates a `new-dapp` directory with essential files for your dApp development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your dApp.

- `dapp.py`: A Python file with template backend code that serves as your application's entry point.

- `requirements.txt`: Lists the Python dependencies required for your application.

Sunodo has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

:::note Next Steps
Modify the application’s entry point to write your application logic.
:::

