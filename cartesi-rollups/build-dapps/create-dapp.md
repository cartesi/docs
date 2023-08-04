---
id: create-dapp
title: Create your first DApp
tags: [build, dapps ,developer]
---

Once you learned how to [run a simple example](./run-dapp.md), it is now time to create one of your own. In order to do this, we will make use of the existing DApps available in Cartesi's [rollups-examples](https://github.com/cartesi/rollups-examples) Github repository. Once again, make sure you have [installed all the necessary requirements](./requirements.md) before proceeding.

## Example DApp

The 'fortune' package in Linux contains a command-line tool that randomly displays quotes from a set of predefined lists, which serve as its quote database. This tutorial demonstrates how to create a DApp that installs this package, calls it from a Python script, and displays the result.


### Set up the environment

First of all, clone the [rollups-examples](https://github.com/cartesi/rollups-examples) repository as follows:

```shell
git clone https://github.com/cartesi/rollups-examples.git
```

### Copy an existing DApp

We suggest using a sample DApp that utilizes a new build system, `docker-riscv`, instead of the outdated `toolchain` system:

* [calculator](https://github.com/cartesi/rollups-examples/tree/main/calculator)
* [converter](https://github.com/cartesi/rollups-examples/tree/main/converter)
* [echo-js](https://github.com/cartesi/rollups-examples/tree/main/echo-js)
* [erc20](https://github.com/cartesi/rollups-examples/tree/main/erc20)
* [knn](https://github.com/cartesi/rollups-examples/tree/main/knn)
* [m2cgen](https://github.com/cartesi/rollups-examples/tree/main/m2cgen)


In this example, we are using the existing [Calculator DApp](https://github.com/cartesi/rollups-examples/tree/main/calculator) as a basis to build a new DApp called 'fortune'.


```shell
cd rollups-examples
cp -r  calculator/ fortune
cd fortune
``` 

### Adjust build files

* Change `calculator.py` to `fortune.py`
* Change the DApp name in `entrypoint.sh` to `rollup-init python3 fortune.py`
* Change the DApp name in the Dockerfile to `COPY ./fortune.py`
* Change the DApp name in ` docker-bake.override.hcl` to `dapp:fortune`
* Change the DApp name in `docker-compose.override` to `dapp:fortune-devel-server`
* Amend the Readme as required.


### Test the copied DApp

First of all, check if your Docker supports the RISCV platform by running:

```shell
docker buildx ls
```

If you do not see `linux/riscv64` in the platforms list, install QEMU by running:

```shell
apt install qemu-user-static
```

QEMU is a generic and open source machine emulator and virtualizer that will be used by Docker to emulate RISCV instructions to build a Cartesi Machine for your DApp. 

After installing QEMU, the platform `linux/riscv64` should appear in the platforms list.


Build the copied existing DApp to ensure that the Docker image functions correctly:

```shell
docker buildx bake --load
```

## Add the fortune package to the Dockerfile

Add the `fortune` package to the Docker image as follows:

```dockerfile
RUN apt-get update \
    && apt-get install -y fortune \
    && rm -rf /var/apt/lists/*
```

This command updates the package lists for a Debian-based Linux system, installs the `fortune` package without confirmation, and then cleans up the package list files to save space.

So our full Dockerfile will look as follows:

```dockerfile
# syntax=docker.io/docker/dockerfile:1.4
FROM --platform=linux/riscv64 cartesi/python:3.10-slim-jammy

WORKDIR /opt/cartesi/dapp

RUN apt-get update \
    && apt-get install -y fortune \
    && rm -rf /var/apt/lists/*

COPY ./requirements.txt .
RUN pip install -r requirements.txt --no-cache \
    && find /usr/local/lib -type d -name __pycache__ -exec rm -r {} +

COPY ./entrypoint.sh .
COPY ./fortune.py .
```


## Modify the DApp logic

1. First we need to import the `subprocess package`:

```puthon
import subprocess
```

2. We then delete `from py_expression_eval import Parser` as we are not using the `parser` module in our application.

3. Next, we need to add the `FORTUNE_CMD` command to our code as follows:

```python
FORTUNE_CMD = "/usr/games/fortune; exit 0"
```

This command sets the FORTUNE_CMD variable to a string that, when executed, runs the fortune program to display a random quote and then immediately exits the shell with a success status.


4. We then replace the existing `try` function of `def handle_advance(data)` with the following command that calls the `fortune` app:

```python
    try:
        input = hex2str(data["payload"])
        logger.info(f"Received input: {input}")

        quote = subprocess.check_output(FORTUNE_CMD, shell=True, stderr=subprocess.STDOUT).decode()
        output = f"Received input: {input}. This was the quote {quote}"

        # Emits notice with result of calculation
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(rollup_server + "/notice", json={"payload": str2hex(str(output))})
        logger.info(f"Received notice status {response.status_code} body {response.content}")
```

The `quote` runs the command stored in FORTUNE_CMD using a shell, captures the output (including errors), and then decodes it from bytes to a string, storing the result in the variable output. The `output` creates a formatted string with placeholders, replacing {input} and {quote} with the values of the variables input and quote, respectively, and assigns the resulting string to the variable output.


5. We then change the code of the `def handle_inspect(data):` function to:

```python
    logger.info(f"Received inspect request data {data}")

    status = "accept"
    try:
        input = hex2str(data["payload"])
        logger.info(f"Received input: {input}")

        output = subprocess.check_output(FORTUNE_CMD, shell=True, stderr=subprocess.STDOUT).decode()

        # Emits notice with result of calculation
        logger.info(f"Adding report with payload: '{output}'")
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(str(output))})
        logger.info(f"Received report status {response.status_code} body {response.content}")

    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(msg)})
        logger.info(f"Received report status {response.status_code} body {response.content}")

    return status
```


## Create the Docker build for the new DApp

```shell
docker buildx bake --load
```


## Build the frontend console

In the cloned `rollups-examples` repository, navigate to the `frontend-console`:

```shell
cd frontend-console
```

And build it:

```yarn
yarn
yarn build
```

## Start the application

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml up
```

## Check the DApp address

We now will check our DApp address by viewing the contents of the `dapp.json` file located in the `deployments/localhost/` directory:

```shell
cat deployments/localhost/dapp.json
```

It will return a response similar to the one below:

```json
"address": "0x142105FC8dA71191b3a13C738Ba0cF4BC33325e2",
"blockHash":"0xa228c81061345a0db2910c3f253213bfab131cd575c4589b370555bb748b6238"
"blockNumber": 22,
"transactionHash":"0x77b6be9c95b16f7ab880fc7662028ealdea3279fe28f0382706dd693f0d5315d"
```

## Run an inspect call

From the front-end console directory:

```yarn
yarn start inspect --payload 'test'
```

This will get us a qoute, similar to the one below:

```shell
yarn run v1.22.19
$ ts-node src/index. ts inspect - -payload test
HTTP status: 200
Inspect status: "Accepted"
Input count: 0
Reports:
0:
My dear People.
My dear Bagginses and Boffins, and my dear Tooks and Brandybucks,
and Grubbs, and Chubbs, and Burrowses, and Hornblowers, and Bolgers,
Bracegirdles, Goodbodies, Brockhouses and Proudfoots. Also my good
Sackville Bagginses that I welcome back at last to Bag End.
one hundred and eleventh birthday: I am eleventy-one today!"
Today is my
J. R. R. Tolkien
```

If we execute the `inspect` command again, it will consistently produce the same result, thereby providing the same quote each time.



## Run an advance call

From the front-end console directory:

## Setting up the environment

First of all, clone the repository as follows:

```shell
$ git clone https://github.com/cartesi/rollups-examples.git
```

## Customizing the DApp

Then, use `create-dapp.sh` to create a customized DApp:

```shell
cd custom-dapps
./create-dapp.sh <dapp-name>
```

A new directory, `<dapp-name>`, will be created with all the boiler plate infrastructure needed by the new DApp.

The new DApp will be provided with some basic back-end code, resembling what is available in the sample [Echo Python DApp](https://github.com/cartesi/rollups-examples/tree/main/echo-python), as explained in the [previous section](./run-dapp.md).

## Modifying the DApp logic

The back-end logic may be found at `<dapp-name>/<dapp-name>.py`.

The script comes with some reference code, which may be helpful during development.
It may be replaced or extended according to the use case needs.

As we conclude this tutorial, we hope that you now have a better understanding of how to build a DApp that uses the `fortune` package and how the Cartesi Machine drives the DApp's logic. Don't hesitate to experiment further with these tools and techniques, as they can greatly expand your capabilities in creating your custom DApps. Happy coding! 
