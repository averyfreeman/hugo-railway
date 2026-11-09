# Make the Hugo root a hiring-first portfolio demo

Accepted: the Hugo root publishes Avery Freeman's developer portfolio and demonstrates the reusable Railway-CV theme. The homepage answers a hiring reader's first questions with a role, value statement, Portfolio action, and LinkedIn link; the page then leads into three case studies, recent published writing, and recently updated public repositories. Keep the Signal CV visual identity and progressive motion. Preserve the fictional research demo under `themes/railway-cv/examples/`.

Publish case studies as Hugo bundles at `/case-studies/<slug>/` with `repository`, `focus`, `order`, `summary`, and `tags` front matter. `/portfolio/` presents the five curated pathways before the complete public repository collection. Build that collection from the checked-in public-only projection in `data/portfolio/repositories.json`, pin in configured order, and keep search, language, and focus filters in shareable `q`, `language`, and `focus` URL parameters. No visitor-side GitHub requests are part of the contract.

Promote 70 recovered historical posts and one later-authored post explicitly marked `type: post` and `status: publish` to the canonical `/posts/` archive. Keep original year/month/slug routes and `/wp-content/uploads/` media paths. Publish Avery's About and Skills pages. Reserve `/policy/` as a minimal stub and exclude the three policy notes until an explicit content decision. Keep the source VitePress repository read-only.

## Consequences

The root site becomes a realistic owner-specific theme demonstration rather than a fictional research sample. The theme examples retain that sample for reuse. Case studies separate durable project narratives from freshness-oriented repository metadata; the checked-in snapshot can age until deliberately refreshed. The blog remains available through Hugo's static output and Pagefind. Public claims and contact links stay grounded in the reviewed profile source, and proposed usability checks are not treated as measured conversion results.
