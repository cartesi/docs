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

## Step 2: Run the application back-end

The next step is to run the application back-end in your machine. For example, if the code is written in Python, you will need to have `python3` installed.

In order to start the back-end, run the following commands in a dedicated terminal:

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

After that, you can interact with the application normally [as explained in the quick start article](./run-dapp.md#interacting-with-the-dapp).

## Options

### How to automatically restart the back-end

The final command will effectively run the back-end and send corresponding outputs to port `5004`.
It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints.

You can also use a tool like [entr](https://eradman.com/entrproject/) to restart the back-end automatically when the code changes. For example:

```shell
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 echo.py
```

### How to stop containers

To stop the containers and remove any associated volumes, run the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml -f ../docker-compose-host.yml down -v
```
