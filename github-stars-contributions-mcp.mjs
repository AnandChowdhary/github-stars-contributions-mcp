#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Get the GitHub Stars token from environment variables
const GITHUB_STARS_TOKEN = process.env.GITHUB_STARS_TOKEN;

if (!GITHUB_STARS_TOKEN) {
  console.error("Error: GITHUB_STARS_TOKEN environment variable is required");
  process.exit(1);
}

const API_URL = "https://api-stars.github.com/";

// GraphQL request helper
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_STARS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((e) => e.message).join(", "));
  }

  return result.data;
}

// Enums
const ContributionType = z.enum([
  "SPEAKING",
  "BLOGPOST",
  "ARTICLE_PUBLICATION",
  "EVENT_ORGANIZATION",
  "HACKATHON",
  "OPEN_SOURCE_PROJECT",
  "VIDEO_PODCAST",
  "FORUM",
  "OTHER",
]);

const PlatformType = z.enum([
  "TWITTER",
  "MEDIUM",
  "LINKEDIN",
  "README",
  "STACK_OVERFLOW",
  "DEV_TO",
  "MASTODON",
  "OTHER",
]);

const server = new McpServer(
  { name: "github-stars-contributions-mcp", version: "1.0.0" },
  {
    instructions:
      "Use this server to manage GitHub Stars contributions, profile links, and query public profiles.",
  }
);

// ============================================
// CONTRIBUTION MANAGEMENT TOOLS
// ============================================

server.tool(
  "add_contribution",
  "Add a new contribution to your GitHub Stars profile.",
  z.object({
    type: ContributionType.describe("Type of contribution"),
    title: z.string().min(1).describe("Title of the contribution"),
    description: z.string().min(1).describe("Description of the contribution"),
    url: z
      .string()
      .url()
      .optional()
      .describe("URL related to the contribution"),
    date: z
      .string()
      .describe("Date of the contribution (YYYY-MM-DD or ISO format)"),
  }),
  async ({ type, title, description, url, date }) => {
    const query = `
      mutation AddContribution(
        $type: ContributionType!
        $date: GraphQLDateTime!
        $title: String!
        $url: URL
        $description: String!
      ) {
        createContribution(
          data: {
            date: $date
            url: $url
            type: $type
            title: $title
            description: $description
          }
        ) {
          id
          title
          type
          date
          url
          description
        }
      }
    `;

    const variables = {
      type,
      title,
      description,
      url: url || null,
      date: new Date(date).toISOString(),
    };

    const data = await graphqlRequest(query, variables);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.createContribution, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "remove_contribution",
  "Delete a contribution from your GitHub Stars profile.",
  z.object({
    id: z.string().min(1).describe("ID of the contribution to delete"),
  }),
  async ({ id }) => {
    const query = `
      mutation DeleteContribution($id: String!) {
        deleteContribution(id: $id) {
          id
        }
      }
    `;

    const data = await graphqlRequest(query, { id });

    return {
      content: [
        {
          type: "text",
          text: `Successfully deleted contribution with ID: ${data.deleteContribution.id}`,
        },
      ],
    };
  }
);

server.tool(
  "update_contribution",
  "Update an existing contribution on your GitHub Stars profile.",
  z.object({
    id: z.string().min(1).describe("ID of the contribution to update"),
    type: ContributionType.optional().describe("Type of contribution"),
    title: z.string().min(1).optional().describe("Title of the contribution"),
    description: z
      .string()
      .min(1)
      .optional()
      .describe("Description of the contribution"),
    url: z
      .string()
      .url()
      .optional()
      .describe("URL related to the contribution"),
    date: z
      .string()
      .optional()
      .describe("Date of the contribution (YYYY-MM-DD or ISO format)"),
  }),
  async ({ id, type, title, description, url, date }) => {
    const query = `
      mutation UpdateContribution(
        $id: String!
        $type: ContributionType
        $date: GraphQLDateTime
        $title: String
        $url: URL
        $description: String
      ) {
        updateContribution(
          id: $id
          data: {
            date: $date
            url: $url
            type: $type
            title: $title
            description: $description
          }
        ) {
          id
          title
          type
          date
          url
          description
        }
      }
    `;

    const variables = {
      id,
      type: type || null,
      title: title || null,
      description: description || null,
      url: url || null,
      date: date ? new Date(date).toISOString() : null,
    };

    const data = await graphqlRequest(query, variables);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.updateContribution, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "list_contributions",
  "Get all your contributions from your GitHub Stars profile.",
  z.object({
    first: z.number().optional().describe("Number of contributions to fetch"),
    offset: z.number().optional().describe("Offset for pagination"),
  }),
  async ({ first, offset }) => {
    const query = `
      query AllContributions($pagination: ContributionOffsetPaginationInput) {
        allContributions(pagination: $pagination) {
          id
          title
          type
          date
          url
          description
        }
      }
    `;

    const variables = {
      pagination: first || offset ? { first, offset } : null,
    };

    const data = await graphqlRequest(query, variables);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.allContributions, null, 2),
        },
      ],
    };
  }
);

// ============================================
// PROFILE LINKS TOOLS
// ============================================

server.tool(
  "add_link",
  "Add a profile link to your GitHub Stars profile.",
  z.object({
    link: z.string().url().describe("URL of the profile link"),
    platform: PlatformType.describe("Platform type for the link"),
  }),
  async ({ link, platform }) => {
    const query = `
      mutation CreateLink($link: URL, $platform: PlatformType) {
        createLink(data: { link: $link, platform: $platform }) {
          id
          link
          platform
        }
      }
    `;

    const data = await graphqlRequest(query, { link, platform });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.createLink, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "remove_link",
  "Delete a profile link from your GitHub Stars profile.",
  z.object({
    id: z.string().min(1).describe("ID of the link to delete"),
  }),
  async ({ id }) => {
    const query = `
      mutation DeleteLink($id: String!) {
        deleteLink(id: $id) {
          id
        }
      }
    `;

    const data = await graphqlRequest(query, { id });

    return {
      content: [
        {
          type: "text",
          text: `Successfully deleted link with ID: ${data.deleteLink.id}`,
        },
      ],
    };
  }
);

server.tool(
  "list_links",
  "Get all profile links from your GitHub Stars profile.",
  z.object({}),
  async () => {
    const query = `
      query {
        links {
          id
          link
          platform
        }
      }
    `;

    const data = await graphqlRequest(query);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.links, null, 2),
        },
      ],
    };
  }
);

// ============================================
// QUERY TOOLS
// ============================================

server.tool(
  "get_public_profile",
  "Get a GitHub Star's public profile by username.",
  z.object({
    username: z.string().min(1).describe("GitHub username of the Star"),
  }),
  async ({ username }) => {
    const query = `
      query PublicProfile($username: String!) {
        publicProfile(username: $username) {
          id
          username
          name
          bio
          avatar
          status
          featured
          country
          contributions {
            id
            title
            type
            date
            url
            description
          }
          links {
            id
            link
            platform
          }
        }
      }
    `;

    const data = await graphqlRequest(query, { username });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.publicProfile, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "search_stars",
  "Search and list GitHub Stars public data.",
  z.object({
    featured: z.boolean().optional().describe("Filter to only featured Stars"),
  }),
  async ({ featured }) => {
    const query = `
      query StarsPublicData($featured: Boolean) {
        starsPublicData(featured: $featured) {
          id
          username
          name
          bio
          avatar
          status
          featured
          country
        }
      }
    `;

    const data = await graphqlRequest(query, { featured: featured ?? null });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.starsPublicData, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_logged_user",
  "Get information about the currently logged-in user.",
  z.object({}),
  async () => {
    const query = `
      query {
        loggedUser {
          id
          username
          avatar
          email
          nominee {
            status
            name
            bio
            featured
            country
            jobTitle
            company
          }
        }
      }
    `;

    const data = await graphqlRequest(query);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data.loggedUser, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);
