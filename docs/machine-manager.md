---
id: machine-manager
title: Machine Manager
---
## Introduction

This repository contains the server responsible for managing different sessions of Cartesi Machines. It has a submodule dependency, the machine-emulator repository, that contains the emulator GRPC server.

The easiest way of running the machine manager server + emulator and test them with a sample workload is through a docker container. To get started, follow [TL;DR;](#tldr)

You may also want to install all the dependencies in your system to compile the emulator natively and execute the machine manager server natively

## Getting Started

### Requirements

- Python >= 3.6
- Python modules described in the requirements.txt file
- [Machine emulator](https://github.com/cartesi/machine-emulator)

## TL;DR;

Once you have docker installed in your machine, checkout this repository with all submodules:
```console
$ git clone --recurse-submodules git@github.com:cartesi/machine-manager.git
```

Build emulator base docker image:
```console
$ ./build_emulator_base_image.sh
```

Build machine manager docker image:
```console
$ ./build_core_manager_image.sh
```

Execute an ephemeral docker container of the image just built, it will automatically start machine manager server listening on port 50051:
```console
$ ./execute_machine_manager_ephemeral_container.sh
```

After this step, you should be welcomed by a log message stating that the server is up and listening on port 50051:
```console
2019-04-05 21:27:01,355 140476130260800 INFO __main__ 163 - serve: Server started, listening on address 0.0.0.0 and port 50051
```

Open another terminal to start another session on the ephemeral docker container and execute the test client:
```console
$ docker exec -it ephemeral-machine-manager bash
# python3 test_client.py
```
You should see the logs on both the server and client terminals showing the steps of the tests being performed by the test client

## Installing dependencies to compile the emulator natively

Please follow the instructions from the [machine emulator repository](https://github.com/cartesi/machine-emulator/blob/master/README.md)

## Installing python dependencies to execute the machine manager server natively

It is highly advisable to make a separate python environment to install the dependencies for executing the machine manager server. A very popular option to do that is using virtualenv with virtualenvwrapper, on Ubuntu you can install them by executing:
```console
$ sudo apt install virtualenvwrapper
```

Install python3 in case you don't already have it
```console
$ sudo apt install python3
```

And then create a new virtual env (named "mm" in the example) that uses python3:
```console
$ mkvirtualenv -p `which python3` mm
```

Once you run this step, your terminal should exhibit the activated virtual env name right in the beginning of every line in your shell, similar to this example:
```console
(mm) carlo@parma:~/crashlabs/machine-manager$ _
```

And now you may install the python dependencies from the requirements file in your virtual env:
```console
$ pip install -r requirements.txt
```

In case you don't need any additional packages installed in your system to install the python modules from the step above, you are now ready to execute the machine manager server.

Once you have your virtualenv set up, you may activate it on a terminal using the command "workon":
```console
carlo@parma:~/crashlabs/machine-manager$ workon mm
(mm) carlo@parma:~/crashlabs/machine-manager$ _
```

And you may deactivate it and go back to using your system-wide python installed environment using the command "deactivate":
```console
(mm) carlo@parma:~/crashlabs/machine-manager$ deactivate
carlo@parma:~/crashlabs/machine-manager$ _
```

## Executing the machine manager server

To start the server listening on localhost and port 50051, just execute it:
```console
$ python manager_server.py
```

The server has a couple of options to customize it's behavior, you can check them using the -h option:
```console
python manager_server.py -h
usage: manager_server.py [-h] [--address ADDRESS] [--port PORT] [--defective]

Instantiates a machine manager server, responsible for managing and interacting
with multiple cartesi machine instances

optional arguments:
  -h, --help            show this help message and exit
  --address ADDRESS, -a ADDRESS
                        Address to listen (default: localhost)
  --port PORT, -p PORT  Port to listen (default: 50051)
  --defective, -d       Makes server behave improperly, injecting errors
                        silently in the issued commands
                        -----------------------WARNING!-----------------------
                        FOR TESTING PURPOSES ONLY!!!
                        ------------------------------------------------------
```

As stated in the help, do not use -d option in production as it will make the server misbehave silently, a useful feature only for testing purposes.

## Executing the test client

Once you have the machine manager server up and running, you may want to test it is working correctly using the included test client, if the server is running natively and locally all you have to do is execute it with no additional arguments:
```console
$ python test_client.py
```

The test client also has a couple of options to customize it's behavior, you may check them with the -h or --help option:
```console
$ python test_client.py -h
Starting at Fri Apr  5 19:20:45 2019
usage: test_client.py [-h] [--address ADDRESS] [--port PORT] [--container]

GRPC test client to the machine manager server

optional arguments:
  -h, --help            show this help message and exit
  --address ADDRESS, -a ADDRESS
                        Machine manager server address
  --port PORT, -p PORT  Machine manager server port
  --container, -c       Fixes file references for when machine manager server
                        is running from docker container
```
