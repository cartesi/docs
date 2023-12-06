---
id: dapp-host-mode
title: Run back-end in Host Mode
tags: [build, quickstart, dapps, developer]
---

When developing an application, it is often important to easily test and debug it. For that matter, it is possible to run the Cartesi Rollups environment in [host mode](./overview.md#host-mode), so that the dApp's back-end can be executed directly on the host machine, allowing it to be debugged using regular development tools such as an IDE.

:::note
When running in host mode, localhost port `5004` will be used by default to allow the dApp's back-end to communicate with the Cartesi Rollups framework.
:::

## Step 1: Run the environment

The first step is to run the environment in host mode using the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml -f ../docker-compose-host.yml up
```

:::note
If you are using macOS, please add the line `platform: linux/amd64` under the `server_manager` service in the `docker-compose.host.yml` file, located in the root of the cloned `rollups-examples` repository.
:::

## Step 2: Run the application back-end

The next step is to run the application back-end in your machine. Before proceeding, ensure that you have installed the dependencies and libraries required for your selected language. For example, if the code is written in Python, you will need to have `python3` installed.

If you are using the `echo-python` example, in order to start the back-end, run the following commands in a dedicated terminal:

```shell
cd echo-python/
python3 -m venv .env
. .env/bin/activate
pip install -r requirements.txt
ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" python3 echo.py
```

## Step 3: Check output

After the back-end successfully starts, it should print an output like the following:

```log
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish
```

## Step 4: Interact with the application

With the infrastructure in place, you can use our [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) to interact with your dApp by following the steps:

1. Open a separate terminal window
2. From the rollups-examples base directory, navigate to the `frontend-console` one:

```shell
cd frontend-console
```

3. Build the frontend console application:

```shell
yarn
yarn build
```

4. Send an input to the current locally deployed dApp:

```shell
yarn start input send --payload "Hello, Cartesi."
```

5. For instance, the echo-python dApp "echoes" each input it receives by generating a corresponding output notice based on your input. To check these notices, run the following command:

```shell
yarn start notice list
```

After completing all the steps above, you should get a response with the payload of the notice:

`"Hello, Cartesi."`

:::note
Although we used the `echo-python` dApp as a specific example, it's important to understand that not all dApps generate notices in the same manner. Your dApp may have different behaviors or responses related to notices. However, we hope this example provides a clear understanding and a helpful starting point.
:::

## Options

### How to automatically restart the back-end

The final command will effectively run the back-end and send corresponding outputs to port `5004`.
It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints.

You can also use a tool like [entr](https://eradman.com/entrproject/) to restart the back-end automatically when the code changes. For example:

```shell
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 echo.py
```

### How to stop containers

Stop the containers using `ctrl+c` then remove the containers and the volumes:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml -f ../docker-compose-host.yml down -v
```

:::note
Every time you stop the `docker compose ... up` command with `ctrl+c`, you need to run the `docker compose ... down -v` command to remove the volumes and containers. Ignoring this will preserve outdated information in those volumes, causing unexpected behaviors, such as failure to reset the hardhat localchain.
:::
