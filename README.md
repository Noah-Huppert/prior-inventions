# Prior Inventions
Generate a document to enumerate your prior inventions.

# Table of Contents
- [Overview](#overview)
- [Usage](#usage)

# Overview
Allows you to generate a Markdown document with a list of projects. Projects can be automatically retrieved from GitHub and manually defined.

This tool is not perfect, as it is impossible to generate a list of all ideas and inventions an individual has ever made. However it can help enumerate ideas you've committed with Git.

# Usage
This application is written in Typescript for NodeJS.

1. Configure the application by making a copy of `config.ex.ts` named `config.ts`. Replace the values in this file with your own. Never commit this file to Git.
2. Install NodeJS dependencies:
  ```
  yarn install
  ```
3. Run the application:
  ```
  yarn run-app
  ```
  The resulting markdown file will be overwritten at the path you specified in `config.ts` `document.file` (default: `prior-inventions.md`)
