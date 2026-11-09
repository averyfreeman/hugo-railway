# Signal CV Hugo plugin

This Codex plugin launches the repository's local `mcp-hugo-server-go` over stdio. The launcher resolves the monorepo through the plugin symlink used by the local marketplace, creates a temporary safe stdio configuration, and points the server at:

- `public/` for rendered site output;
- the repository root for Hugo configuration and builds;
- `content/` for Markdown and notebook bundles.

The plugin is intentionally repo-bound in development. The sibling server's `manifest.json` and npm package remain the portable MCPB/release path for arbitrary Hugo projects.

## Smoke test

From the monorepo root:

```bash
node plugins/hugo-railway/scripts/launch-mcp.cjs --version
```

For a normal Codex install, use a new task after reinstalling the local marketplace plugin so its MCP process starts with the current manifest.
