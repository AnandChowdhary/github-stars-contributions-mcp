# ⭐ GitHub Stars Contributions MCP

An MCP (Model Context Protocol) server for managing your [GitHub Stars](https://stars.github.com) contributions and profile - so AI assistants like Claude Desktop and Cursor can help you track your community contributions through natural language.

## ✨ Features

### Contribution management

- **Add contribution** — Add talks, blog posts, videos, and other contributions
- **Update contribution** — Modify existing contributions
- **Remove contribution** — Delete contributions from your profile
- **List contributions** — Retrieve all your contributions with pagination

### Profile links

- **Add link** — Add social/platform links to your profile
- **Remove link** — Delete profile links
- **List links** — Get all your profile links

### Query tools

- **Get public profile** — View any GitHub Star's public profile
- **Search Stars** — Browse GitHub Stars directory
- **Get logged user** — View your own profile information

## 📋 Prerequisites

- **Node.js** v18 or later
- **GitHub Stars API token** — Get yours from [stars.github.com/profile](https://stars.github.com/profile) under the "Token" tab

## 🚀 Quick start

Add the server to your MCP config:

### Cursor IDE

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "github-stars": {
      "command": "npx",
      "args": ["-y", "github-stars-contributions-mcp"],
      "env": {
        "GITHUB_STARS_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github-stars": {
      "command": "npx",
      "args": ["-y", "github-stars-contributions-mcp"],
      "env": {
        "GITHUB_STARS_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Get your API token

1. Go to [stars.github.com/profile](https://stars.github.com/profile)
2. Navigate to the **Token** tab
3. Copy your API token and replace `your-api-token-here` in the config above

## ⚙️ Alternative installation

### From source

If you prefer to run from source:

```bash
git clone https://github.com/AnandChowdhary/github-stars-contributions-mcp.git
cd github-stars-contributions-mcp
npm install
```

Then use this config:

```json
{
  "mcpServers": {
    "github-stars": {
      "command": "node",
      "args": [
        "/absolute/path/to/github-stars-contributions-mcp/github-stars-contributions-mcp.mjs"
      ],
      "env": {
        "GITHUB_STARS_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Running standalone

```bash
export GITHUB_STARS_TOKEN="your-api-token-here"
npx github-stars-contributions-mcp
```

## 🎯 Available tools

### `add_contribution`

Add a new contribution to your GitHub Stars profile.

| Parameter     | Type   | Required | Description                                                                                                                                |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`        | enum   | ✅       | `SPEAKING`, `BLOGPOST`, `ARTICLE_PUBLICATION`, `EVENT_ORGANIZATION`, `HACKATHON`, `OPEN_SOURCE_PROJECT`, `VIDEO_PODCAST`, `FORUM`, `OTHER` |
| `title`       | string | ✅       | Title of the contribution                                                                                                                  |
| `description` | string | ✅       | Description of the contribution                                                                                                            |
| `date`        | string | ✅       | Date in `YYYY-MM-DD` or ISO format                                                                                                         |
| `url`         | string | ❌       | URL related to the contribution                                                                                                            |

### `update_contribution`

Update an existing contribution.

| Parameter     | Type   | Required | Description                      |
| ------------- | ------ | -------- | -------------------------------- |
| `id`          | string | ✅       | ID of the contribution to update |
| `type`        | enum   | ❌       | Contribution type                |
| `title`       | string | ❌       | Title                            |
| `description` | string | ❌       | Description                      |
| `date`        | string | ❌       | Date                             |
| `url`         | string | ❌       | URL                              |

### `remove_contribution`

Delete a contribution from your profile.

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `id`      | string | ✅       | ID of the contribution to delete |

### `list_contributions`

Get all your contributions.

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `first`   | number | ❌       | Number of items to fetch |
| `offset`  | number | ❌       | Pagination offset        |

### `add_link`

Add a profile link.

| Parameter  | Type   | Required | Description                                                                                |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| `link`     | string | ✅       | URL of the link                                                                            |
| `platform` | enum   | ✅       | `TWITTER`, `MEDIUM`, `LINKEDIN`, `README`, `STACK_OVERFLOW`, `DEV_TO`, `MASTODON`, `OTHER` |

### `remove_link`

Delete a profile link.

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `id`      | string | ✅       | ID of the link to delete |

### `list_links`

Get all your profile links. No parameters required.

### `get_public_profile`

Get a GitHub Star's public profile.

| Parameter  | Type   | Required | Description     |
| ---------- | ------ | -------- | --------------- |
| `username` | string | ✅       | GitHub username |

### `search_stars`

Search GitHub Stars.

| Parameter  | Type    | Required | Description                   |
| ---------- | ------- | -------- | ----------------------------- |
| `featured` | boolean | ❌       | Filter to featured Stars only |

### `get_logged_user`

Get your own profile information. No parameters required.

## 📝 Example usage

Once configured with your AI assistant, you can use natural language:

- _"Add my talk at GitHub Universe as a speaking contribution"_
- _"List all my contributions from this year"_
- _"Add my Twitter profile link"_
- _"Show me the public profile of octocat"_
- _"Remove the contribution with ID abc123"_

## 📊 Contribution types

| Type                  | Description                              |
| --------------------- | ---------------------------------------- |
| `SPEAKING`            | Conference talks, meetups, webinars      |
| `BLOGPOST`            | Blog posts and tutorials                 |
| `ARTICLE_PUBLICATION` | Published articles in magazines/journals |
| `EVENT_ORGANIZATION`  | Organizing events, meetups, conferences  |
| `HACKATHON`           | Hackathon participation or mentoring     |
| `OPEN_SOURCE_PROJECT` | Open source contributions                |
| `VIDEO_PODCAST`       | YouTube videos, podcasts                 |
| `FORUM`               | Forum contributions, Q&A                 |
| `OTHER`               | Any other contribution type              |

## 🔗 Platform types

| Type             | Description            |
| ---------------- | ---------------------- |
| `TWITTER`        | Twitter/X profile      |
| `MEDIUM`         | Medium blog            |
| `LINKEDIN`       | LinkedIn profile       |
| `README`         | README profile         |
| `STACK_OVERFLOW` | Stack Overflow profile |
| `DEV_TO`         | DEV Community profile  |
| `MASTODON`       | Mastodon profile       |
| `OTHER`          | Any other platform     |

## 🔧 Troubleshooting

### "GITHUB_STARS_TOKEN environment variable is required"

Make sure you've set the `GITHUB_STARS_TOKEN` in your MCP configuration or exported it in your shell.

### "Unauthorized" errors

Your API token may have expired. Generate a new one from [stars.github.com/profile](https://stars.github.com/profile).

### Server not connecting

1. Ensure Node.js v18+ is installed
2. Check that the `GITHUB_STARS_TOKEN` is set correctly
3. Restart your AI assistant after config changes

## 🔗 Related projects

- [github-stars-contributions CLI](https://github.com/ahmadawais/github-stars-contributions) — CLI tool by Ahmad Awais
- [GitHub Stars Program](https://stars.github.com) — Official GitHub Stars website

## 📃 License

ISC © [Anand Chowdhary](https://anandchowdhary.com)
