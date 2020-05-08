# Website

This website is built using Docusaurus 2, a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

This repo build is automatically deployed using AWS Amplify.

The following branches and pull requests are deployed to the following URLs:

| Branch  | URL                             |
| ------- | ------------------------------- |
| master  | https://docs.cartesi.io         |
| develop | https://preview.docs.cartesi.io |

Pull requests are deployed to an URL according to the PR number, in the following URL:

`https://pr-<PR#>.d38mrjcerjd5by.amplifyapp.com`
