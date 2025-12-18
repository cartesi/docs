# Cartesi Documentation

Welcome to the official Cartesi documentation repository. This documentation is built using [Docusaurus 3.6.3](https://docusaurus.io/).

## Requirements

* Install [Node.js](https://nodejs.org/en/download/) version >= 20.x
* Install [Yarn](https://yarnpkg.com/getting-started/install) version >= 1.5

## Installation

Fork, clone the repository and install dependencies:

```bash
yarn install
```

## Local Development

The following command will start a local development server on `http://localhost:3000` and open a browser window.
Most changes are reflected live without having to restart the server.

```bash
yarn start
```


## Build

To create a production build:

```bash
yarn build
```

This command generates static content in the `build` directory, which can be served using any static content hosting service.

## Deployment

This repo build is automatically deployed using AWS Amplify.

The following branches and pull requests are deployed to the following URLs:

| Branch | URL                             |
| ------ | ------------------------------- |
| main   | https://github.com/cartesi/docs |

## Project Structure

* [Learn Markdown features](https://docusaurus.io/docs/markdown-features)
* [Understand docs structure rundown](https://docusaurus.io/docs/installation#project-structure-rundown)

## Contributing
We welcome contributions to improve the documentation! Please see the [Contributing Guide](./CONTRIBUTING.md) for more details.

## License
This project is licensed under the [Apache 2.0 License](https://github.com/cartesi/rollups-contracts/blob/main/LICENSE).


