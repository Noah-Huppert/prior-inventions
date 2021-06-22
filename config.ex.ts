import Config from "./libconfig";

const CFG: Config = {
  document: {
    file: "prior-inventions.md",x
    description: "A list of all inventions which includes every idea ever thought by a person is not possible to generate. However this document includes as comprehensive of a list as possible.",
  },
  github: {
	  username: "your GitHub username",
	  token: "your GitHub personal access token",
    organizations: [
      [ "org-name-slug", [ "list of repos", "to include", "from org" ] ],
      [ "another-org", [ "..." ] ],
    ],
    repoOverrides: [
      {
        slug: "org-name/repo-name",
        name: "optional, overriden name of project",
        description: "optional, overriden description",
      },
    ],
  },
  projects: [
    {
      link: "link to project",
      name: "User Friendly Project Name",
      description: "Short description of project",
    }
  ],
};

export default CFG;
