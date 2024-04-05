# Cartesi Documentation

Cartesi Docs is built with [Docusaurus 2.4.3](https://docusaurus.io/)

## Requirements

* Install [Node.js](https://nodejs.org/en/download/) version >= 20.x
* Install [Yarn](https://yarnpkg.com/getting-started/install) version >= 1.5  

## Run the Docs locally

1. Fork the repo:
   > For help, refer to [GitHub Docs: Fork a repo](https://help.github.com/en/articles/fork-a-repo).

2. Clone your forked repo:

    ```
    git clone git@github.com:[your_github_handle]/cartesi/docs
    ```

3. Navigate into the cloned folder:

    ```
    cd docs
    ```

4. If you have already cloned the repository, be sure to sync your fork with the latest changes:
   > For help, refer to [GitHub Docs: Syncing a fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork).

    ```
    git checkout master
    git pull
    ```

5. Install the dependencies:

    ```
    yarn install
    ```

   The site is built using Docusaurus. You need to install Docusaurus before running the Docs locally.

   ```
   yarn add docusaurus
   ```

6. Run the Docs locally:

   The following command will start a local development server and open a browser window.
   Most changes are reflected live without having to restart the server.

    ```
    yarn start
    ```

Launch the docs on `http://localhost:3000`.

## Build

```
$ yarn build
```

This command generates static content in the `build` directory, which can be served using any static content hosting service.

## Deployment

This repo build is automatically deployed using AWS Amplify.

The following branches and pull requests are deployed to the following URLs:

| Branch  | URL                             |
| ------- | ------------------------------- |
| master  | https://github.com/cartesi/docs |

## Project Structure

* [Learn Markdown features](https://docusaurus.io/docs/markdown-features)
* [Understand docs structure rundown](https://docusaurus.io/docs/installation#project-structure-rundown)

