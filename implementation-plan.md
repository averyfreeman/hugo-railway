# Implementation plan

This projection is derived from Matt-native context and ADR documents.

## Problem

Build a hiring-first Hugo developer portfolio that demonstrates the reusable Railway-CV theme and a portable Hugo MCP server packaged as a Codex plugin and MCPB.

## Languages

go

## Decisions

- [Keep the site, theme, and MCP server in one fresh-history monorepo](docs/adr/0001-monorepo-boundaries.md) — 
- [Render notebooks statically first](docs/adr/0002-static-first-notebook-rendering.md) — 
- [Use progressive signal motion for the theme](docs/adr/0003-progressive-signal-motion.md) — 
- [Protect the demo while staging the VitePress migration](docs/adr/0004-protected-demo-staged-vitepress-migration.md) — 
- [Make the Hugo root a hiring-first portfolio demo](docs/adr/0005-hiring-first-hugo-portfolio.md) — 
