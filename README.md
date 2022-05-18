# The Blockchain OS Documentation

The Blockchain OS Docs built using Docusaurus 2, a modern static website generator.

## Requirements

* Install [Node.js](https://nodejs.org/en/download/) version >= 12.13
* Install [Yarn](https://yarnpkg.com/getting-started/install) version >= 1.5  

> Note that on macOS you also need Xcode and Command Line Tools.

## Run the Docs locally

1. Fork the repo. 
   > For help, refer to [GitHub Docs: Fork a repo](https://help.github.com/en/articles/fork-a-repo).
   
2. Clone your forked repo.
   
    ```
    git clone git@github.com:[your_github_handle]/cartesi-corp/docs
    ```

3. Navigate into the cloned folder.
   
    ```
    cd docs
    ```

4. Link your cloned repo to the upstream repo.
   > For help, see [GitHub Docs: Configuring a remote for a fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork).
   
    ```
    git remote add upstream https://github.com/cartesi-corp/docs
    ```

5. If you have already cloned the repository, be sure to sync your fork with the latest changes. 
   > For help, refer to [GitHub Docs: Syncing a fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork).

    ```
    git checkout master
    git fetch upstream
    git merge upstream/master
    ```

6. Install the dependencies.
   
    ```
    yarn install
    ```
    
   The site is built using Docusaurus. You may need to install Docusaurus before running the Docs locally.

   ```
   yarn add docusaurus
   ```
   
   Alternatively, you can upgrade Docusaurus.

   ```
   yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
   ```

7. Run the Docs locally. 
   The following command will start a local development server and open a browser window. 
   Most changes are reflected live without having to restart the server.

    ```
    yarn start
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
