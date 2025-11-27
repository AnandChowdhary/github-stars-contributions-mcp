#!/usr/bin/env node

// Get the GitHub Stars token from environment variables
const GITHUB_STARS_TOKEN = process.env.GITHUB_STARS_TOKEN;

if (!GITHUB_STARS_TOKEN) {
  console.error("Error: GITHUB_STARS_TOKEN environment variable is required");
  process.exit(1);
}

const API_URL = "https://api-stars.github.com/";

// Introspection query to get the schema
const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

async function introspect() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_STARS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: introspectionQuery }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("Errors:", result.errors);
    return;
  }

  // Filter to show only relevant types
  const relevantTypes = ["User", "StarPublicData", "Contribution", "Link", "Query", "Mutation"];
  
  const types = result.data.__schema.types.filter(t => 
    relevantTypes.includes(t.name) || 
    t.name.toLowerCase().includes("star") ||
    t.name.toLowerCase().includes("profile") ||
    t.name.toLowerCase().includes("user")
  );

  for (const type of types) {
    if (type.fields) {
      console.log(`\n=== ${type.name} (${type.kind}) ===`);
      for (const field of type.fields) {
        const fieldType = field.type.name || 
          (field.type.ofType ? `${field.type.kind}<${field.type.ofType.name}>` : field.type.kind);
        console.log(`  ${field.name}: ${fieldType}`);
      }
    }
  }
}

introspect();

