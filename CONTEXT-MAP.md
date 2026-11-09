# Context Map

Railway-CV is a small monorepo with one shared vocabulary context. The Hugo root publishes Avery Freeman's hiring-first developer portfolio; the fictional research sample remains a theme example.

- [Railway-CV Monorepo Context](./CONTEXT.md): names and boundaries shared by the portfolio site, reusable theme, and local MCP workspace.

## Relationships

- **Portfolio site → Theme layer**: the root Hugo site consumes `themes/railway-cv/` as its reusable presentation layer.
- **Theme layer → Example site**: `themes/railway-cv/examples/signal-cv-research-demo/` preserves the fictional Signal CV research sample as a portable theme demonstration.
- **Local plugin → MCP workspace**: `plugins/hugo-railway/` launches `mcp-hugo-server-go/` with the root site's `public/`, project, and content paths.
- **MCP workspace → Demo site**: the server reads and writes the same Markdown bundles that Hugo builds into the static site.
