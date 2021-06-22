export default interface Config {
  /**
   * Output document.
   */
  document: {
    /**
     * Name of file to output.
     */
    file: string,

    /**
     * Introductory paragraph which will be displayed before the prior works list.
     */
    description: string,

    /**
     * Text which will be inserted at the very top of the generated markdown file.
     */
    markdownHeader: string,
  },
  
  /**
   * GitHub.
   */
  github: {
    /**
     * The username (not email) of the GitHub account from which to source projects.
     */
    username: string,

    /**
     * GitHub API personal access token. Requires the `repo:status`, `public_repo`, `read:org`, and `read:user` scopes.
     */
    token: string,

    /**
     * Configures which organizations and projects from those organizations should be incldued. If left empty no projects from organizations will be included.
     */
    organizations: OrgPair[],

    /**
     * Allows information for repositories to be overriden.
     */
    repoOverrides?: RepoOverride[],
  },
  projects?: ManualProject[],
}

/**
 * Specifies an organization and the repositories which are allowed to be used from that organization.
 * The first tuple item is the machine readable slug of the organization.
 * The second tuple item is an array of machine readable slugs for repositories within the organization which will be sourced as projects.
 */
export type OrgPair = [ string, string[] ];

/**
 * Specifies override information for a project sourced from a GitHub repository.
 */
export interface RepoOverride {
  /**
   * Specifies the slug of the project to override.
   */
  slug: string,

  /**
   * If present overrides the project's name.
   */
  name?: string,

  /**
   * If present overrides the project's description.
   */
  description?: string,

  /**
   * If present overrides the project's link. If set to null then removes a project's link.
   */
  link?: string|null,
}

/**
 * Specifies a project manually, instead of gathering information from GitHub.
 */
interface ManualProject {
  /**
   * A link for the project, optional.
   */
  link?: string,

  /**
   * Human readable name of project.
   */
  name: string,

  /**
   * Text describing all relevant aspects of the project.
   */
  description: string,
}
