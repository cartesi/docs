# Website

This website is built using Docusaurus 2, a modern static website generator.

## Installation in local machine

```
$ yarn
$ yarn start
```

## Installation as Docker container

```
make build-server
make run-server
```

And then point your browser to `http://localhost:3000`.

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

This repo build is automatically deployed using AWS Amplify.

The following branches and pull requests are deployed to the following URLs:

| Branch  | URL                             |
| ------- | ------------------------------- |
| master  | https://docs.cartesi.io         |
| develop | https://preview-docs.cartesi.io |
