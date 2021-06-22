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
  - `document`: Document configuration
    - `file`: Output file path
    - `description`: An introduction paragraph for the document
    - `markdownHeader`: Add arbitrary text to the top of the Markdown document. The default value inserts a header for Pandoc which tweaks the margins, then adds the current date.
  - `github`: GitHub configuration
    - `username`: Login username
    - `token`: API authentication token, requires the `public_repo`, and `read:org` scopes
    - `organizations`: Array of tuples which configuration projects you want to include from external organizations. The first tuple value is the organization's username / slug. The second tuple value is an array of repository slugs from the organization which you wish to include.
    - `repoOverrides`: Array of override information. Allows you to manually override information about repositories retrieved using the GitHub API. Each array item is an object with a `slug` key which specifies the GitHub repository to override. This should be in the format `<owner username>/<repo slug>`. Then the `name`, `description`, and `link` keys can optionally be provided to override a value. The `link` override key can be set to `null` in order to remove a link from a project.
  - `projects`: Manually specified projects. Each project should be an object with a `name`, `description`, and `link` (optional) key.
2. Install NodeJS dependencies:
  ```
  yarn install
  ```
3. Run the application:
  ```
  yarn run-app
  ```
  The resulting markdown file will be overwritten at the path you specified in `config.ts` `document.file` (default: `prior-inventions.md`). 
  
Projects will be shown sorted in alphabetical order by their name.

_Tip_:  
This output Markdown file could be transformed into a PDF using a tool like [Pandoc](https://pandoc.org/):

```
pandoc -o prior-inventions.pdf prior-inventions.md
```
