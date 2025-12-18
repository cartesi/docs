# Contributing to Cartesi

Thank you for your interest in Cartesi!
We highly appreciate even the smallest of fixes or additions to our project.


 - [Code of Conduct](#coc)
 - [Basic Contributing Guidelines](#basic)
 - [Commit Message Guidelines](#commit)
 - [Signing the CLA](#cla)
 - [Authors](#authors)
 - [Get in Touch](#touch)


## <a name="coc" />Code of Conduct

Help us keep Cartesi an open space for development.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## <a name="basic" />Basic Contributing Guidelines

We use the same guidelines for contributing code to any of our repositories, any developers wanting to contribute to Cartesi must create pull requests.
This process is described in the [GitHub documentation](https://help.github.com/en/articles/creating-a-pull-request).
Each pull request should be started against the main branch in the respective Cartesi repository.
After a pull request is submitted the Cartesi team will review the submission and give feedback via the comments section of the pull request.
After the submission is reviewed and approved, it will be merged into the master branch of the source.
Please note the below! We appreciate everyone following the guidelines.

* No --force pushes or modifying the Git history in any way;
* Use non-master branches, using a short meaningful description, with words separated by dash (e.g. 'fix-this-bug');
* All modifications must be made in a pull-request to solicit feedback from other contributors.

## <a name="commit" />Commit Message Format

We have very precise rules over how our Git commit messages must be formatted, following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guideline.
This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is optional.
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional.
The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.


### <a name="commit-header" />Commit Message Header

```
<type>(<scope>): <subject>
  │       │          │
  │       │          └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: Check the available scopes of the repository.
  │
  └─⫸ Commit Type: build|feat|fix|test|perf|refactor|docs|style
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.


#### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example: npm)
* **feat**: A new feature
* **fix**: A bug fix
* **test**: Adding missing tests or correcting existing tests
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

When a commit fits multiple types, the list also serves as a hierarchy of what type should be used, e.g. if a commit introduces a feature and its tests, it's a `feat`.

If there's a breaking change in this commit, add a `!` to the end of the type, e.g. `feat!`, for easier identification.


#### Scope

For information on the scopes of this repository, check the [scopes](.github/.scopes.txt) file for the full list of acceptable scopes.

The scope is optional, although highly recommended.
However, if you choose to add a scope, it **must** be one of the listed on the file.


#### Subject

Use the subject field to provide a succinct description of the change:

* Limit the subject line to 50 characters.
* Do not capitalize.
* Don't put a period at the end.
* Describe what was done, but not how or why. Leave those to the `body`, if needed.
* Use the imperative, present tense (e.g. "change" not "changed" nor "changes").

### <a name="commit-body" />Commit Message Body

The body exists to complement anything that you think is needed in the commit message.
Remember that commit messages are not documentation, and should be kept brief.

* Just as in the subject, use the imperative, present tense.
* Describe why and how it was done.
* Wrap the body at 72 characters.

### <a name="commit-footer" />Commit Message Footer

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues and other PRs that this commit closes or is related to.
For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.


## <a name="authors" />Authors

Any contributor who has in the past had at least one pull request for a code change accepted in this repo may submit a pull request to have their name added to the AUTHORS file.
Submissions to the AUTHORS file should be in the format below:

```
Name <email>
```

Inclusion in the AUTHORS file for each repo is entirely voluntary.
It is up to each individual author to decide whether they would like attribution in a given AUTHORS file and to submit a pull request accordingly.
Please note that a contributor's decision on whether to seek attribution in an AUTHORS file will have no impact on copyright ownership.


## <a name="cla" />Signing the CLA

Make sure to review our [Contributing License Agreement](https://forms.gle/k3E9ZNkZY6Vy3mkK9), sign and send it to info@cartesi.io with the title of "CLA Signed" before taking part in the project.
We are happy to automate this for you via DocuSign upon request in the Google Form as well.


## <a name="touch" />Get in Touch

When contributing in a deeper manner to this repository, please first discuss the change you wish to make via our 
[Discord channel here](https://discord.gg/Pt2NrnS), or contact us at info@cartesi.io email before working on the change.