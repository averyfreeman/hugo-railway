# Local Hugo MCP workspace

The repo includes `mcp-hugo-server-go`, a local stdio MCP server for safe Hugo content operations. The Codex plugin in `plugins/hugo-railway/` is the convenient launcher; it finds this repository, builds the Go command when needed, and supplies the workspace paths.

## Manual launch

From the repository root, the server can be run with a temporary stdio configuration:

```bash
MCP_HUGO_SERVER_CONFIG=/path/to/stdio.yaml \
  go run ./mcp-hugo-server-go/cmd/mcp-hugo-server-go
```

The configuration must keep the build output separate from the Hugo project root:

```yaml
transport: stdio
site_root: /absolute/path/to/hugo-railway/public
hugo_root: /absolute/path/to/hugo-railway
content_root: /absolute/path/to/hugo-railway/content
site_url: http://localhost:1313
site_name: Signal CV
```

The server is local-only in this workflow. It does not expose an HTTP listener or make network calls unless an optional integration is explicitly configured. Use the server's existing revision and confirmation requirements for mutations, and run a Hugo build before asking an agent to publish changes.

## MCPB packaging

`mcp-hugo-server-go/manifest.json` remains the upstream-compatible MCPB manifest. It already describes the platform binary and user-configured site paths. The repo plugin is a development launcher; a release MCPB should be built from the Go server's release workflow rather than committing a platform binary into this repository.
