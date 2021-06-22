import fs from "fs/promises";

import GitHub from "github-api";
import { RepoOverride } from "./libconfig";
import CFG from "./config";

/**
 * Information about a prior invention.
 */
interface Project {
  /**
   * Unique machine identifier.
   */
  id: string,

  
  /**
   * Full link to project's homepage.
   */
  link?: string,

  /**
   * Unique slug identifying owner of project.
   */
  owner: string,

  /**
   * Computer readable pseudo-URI for this project. Should be in the format <owner>/<slug name>.
   */
  slug: string,

  /**
   * Unique machine readable name of project.
   */
  slugName: string,

  /**
   * Human readable name of project.
   */
  name: string,

  /**
   * Short description of project.
   */
  description: string,
}

/**
 * Wrap a piece of text in a Markdown [text](url) style link. If link is undefined don't wrap.
 * @param text Text to show for link.
 * @param link Link to point to.
 * @returns Wrapped text in a link, or just the plain text if the link was undefined.
 */
function wrapMdLink(text: string, link?: string): string {
  if (link !== undefined) {
    return `[${text}](${link})`;
  }

  return text;
}

/**
 * From: https://stackoverflow.com/a/1026087
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Convert a URL slug to a pretty human title.
 */
function prettifySlug(slug: string): string {
  return slug.split("-").join(" ").split("_").join(" ").split(" ").map((word) => {
    return capitalizeFirstLetter(word);
  }).join(" ");
}

async function main(): Promise<void> {
  // Authenticate with GitHub
  const gh = new GitHub({
    username: CFG.github.username,
    token: CFG.github.token,
  });

  // Flatten some configuration values
  let allowedOwners: string[] = [ CFG.github.username ];
  CFG.github.organizations.forEach((o) => {
    allowedOwners.push(o[0]);
  });
  
  let allowedExternRepos = {};
  CFG.github.organizations.forEach((o) => {
    allowedExternRepos[o[0]] = o[1];
  });

  let repoOverrides: { [key: string]: RepoOverride } = {};
  let repoOverrideSlugs: string[] = [];
  
  if (CFG.github.repoOverrides !== undefined) {
    CFG.github.repoOverrides.forEach((o) => {
      repoOverrides[o.slug] = o;
    });
    repoOverrideSlugs = CFG.github.repoOverrides.map((o) => {
      return o.slug;
    });
  }

  // Fetch projects
  let projectsList: Project[] = [];

  const ghUser = gh.getUser();
  const ghUserRepos = (await ghUser.listRepos()).data;

  projectsList.push(...ghUserRepos.map((repo) => {
    // Determine if allowed to add this repository as a project
    if (allowedOwners.indexOf(repo.owner.login) === -1) {
      return undefined;
    }
    
    if (repo.owner.login !== CFG.github.username && allowedExternRepos[repo.owner.login].indexOf(repo.name) === -1) {
      return undefined;
    }

    if (repo.fork === true) {
      return undefined;
    }

    if (!repo.id) {
      throw new Error(`The repository ${JSON.stringify(repo)} did not have an ID. This will ruin internal logic and not work.`);
    }

    // Synthisize project
    let project = {
      id: repo.id,
      link: repo.html_url,
      owner: repo.owner.login,
      slug: `${repo.owner.login}/${repo.name}`,
      slugName: repo.name,
      name: prettifySlug(repo.name),
      description: repo.description,
    };

    if (repoOverrideSlugs.indexOf(project.slug) !== -1) {
      const override = repoOverrides[project.slug];
      ["name", "description"].forEach((key) => {
        if (override[key] !== undefined) {
          project[key] = override[key];
        }
      });
    }

    return project;
  }));

  projectsList = projectsList.filter((p) => p !== undefined);

  // Load manual projects
  if (CFG.projects !== undefined) {
    projectsList.push(...CFG.projects.map((p) => {
      return {
        id: `__manualproject${p.name}`,
        link: p.link,
        owner: CFG.github.username,
        slug: `__manualprojects/${p.name}`,
        slugName: p.name,
        name: p.name,
        description: p.description,
      };
    }));
  }


  // Validate projects
  let projectsMap: { [key: string]: Project } = {};
  projectsList.forEach((p) => {
    projectsMap[p.id] = p;
  });
  
  let missingFields: { [key: string]: string[] } = {};
  projectsList.forEach((p) => {
    const missing = ["owner", "slugName", "name" , "description"].map((k) => {
      if (!p[k]) {
        return k;
      }
    }).filter((v) => v !== undefined);
    
    if (missing.length > 0) {
      missingFields[p.id] = missing;
    }
  });

  const missingErrs = Object.keys(missingFields).map((pid) => {
    const project = projectsMap[pid];
    const missing = missingFields[pid];

    return `${project.name}:
    Slug          : ${project.owner}/${project.slugName}
    Missing fields: ${missing.join(", ")}`;
  });

  if (missingErrs.length > 0) {
    console.error(`Some projects are missing required fields. Please set values for these fields via the github.repoOverrides configuration field.\n\nMissing data:\n  ${missingErrs.join("\n\n  ")}`);
    process.exit(1);
  }

  // Generate output document
  projectsList.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }

    return -1;
  });
  const projectsTxt = projectsList.map((project) => {
    return `- **${wrapMdLink(project.name, project.link)}**: ${project.description}`;
  });
  const outTxt = `# Prior Inventions
${CFG.document.description}

${projectsTxt.join("\n")}`;

  await fs.writeFile(CFG.document.file, outTxt);
}

main().then(() => {
  console.log("Done");
}).catch((e) => {
  console.error("Error", e);
});
