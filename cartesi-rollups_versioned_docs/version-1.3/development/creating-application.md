---
id: creating-application
title: Creating an application
---

Cartesi CLI simplifies creating dApps on Cartesi. To create a new application, run:

```shell
cartesi create <dapp-name> --template <language>
```

For example, create a Python project.

```shell
cartesi create new-dapp --template python
```

This command creates a `new-dapp` directory with essential files for your dApp development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your dApp.

- `dapp.py`: A Python file with template backend code that serves as your application's entry point.

- `requirements.txt`: Lists the Python dependencies required for your application.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

After creating your application, you can start building your dApp by adding your logic to the `dapp.py` file.


:::note Building with Go?
For Go applications on Cartesi, we recommend using [Rollmelette](https://github.com/rollmelette/rollmelette). It’s a high-level Go framework and an alternative template that simplifies development and enhances input management, providing a smoother and more efficient experience.
:::