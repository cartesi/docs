---
id: migration
title: "Migrating from Sunodo CLI" 
---

Follow these simple steps to migrate your application from Sunodo CLI to Cartesi CLI.

## Uninstall Sunodo CLI

1. If installed using Homebrew:

	```bash
	brew uninstall sunodo
	```

2. If installed using NPM:
	```bash
	npm uninstall -g sunodo
	```

## Install Cartesi CLI

1. Install with Homebrew:

	```shell
	brew install cartesi/tap/cartesi
	```

2. Install with NPM:

	```shell
	npm install -g @cartesi/cli
	```


## Update Project Configuration

1. Update your `Dockerfile` to have the latest from [the Cartesi application templates](https://github.com/cartesi/application-templates).

1. Change the `.sunodo` directory to `.cartesi`.

1. Modify the `.gitignore` file to ignore the `.cartesi` directory instead of `.sunodo`.

3. If you have a `.sunodo.env` file, rename it to `.cartesi.env`.
