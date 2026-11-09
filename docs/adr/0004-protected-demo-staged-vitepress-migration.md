# Protect the demo while staging the VitePress migration

Accepted: the existing Railway-inspired demo is a reviewable artifact, not an empty placeholder. VitePress material is imported beside it under temporary `_2` sections and a namespaced static/data area. The migration tool refuses protected demo paths, never writes to the VitePress source repository, and refreshes only its own staged outputs. Reconciliation, canonical route selection, and homepage changes are deferred until the demo and migration can be reviewed together.

Superseded by [ADR 0005](0005-hiring-first-hugo-portfolio.md). The review period is complete: the root site now publishes Avery's portfolio, while the fictional research demo is preserved in `themes/railway-cv/examples/`. The temporary `_2` routes have been removed.

## Consequences

The repository temporarily contains parallel demo and migration routes. This costs a small amount of duplicated navigation and styling, but it makes the migration reversible and keeps the existing examples, homepage, and Railway-inspired landing work intact. Source/process documents remain references rather than published pages, while the migration manifest records counts and excluded material for later reconciliation.
