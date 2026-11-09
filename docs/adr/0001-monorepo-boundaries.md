# Keep the site, theme, and MCP server in one fresh-history monorepo

Accepted: the root repository owns the demo site, `themes/railway-cv/` owns reusable presentation, and `mcp-hugo-server-go/` remains a sibling publishing service. The existing nested Git metadata will be removed so the working tree can evolve together without upstream synchronization; licenses and upstream attribution stay in their source directories.

## Consequences

The root build and validation commands become the integration boundary. Upstream changes to the imported theme or MCP server are no longer pulled automatically, so future upgrades must be deliberate copies or merges.
