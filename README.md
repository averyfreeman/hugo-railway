# Railway-CV

Railway-CV is a reusable Hugo theme and a hiring-first developer portfolio for Avery Freeman. The root site demonstrates the theme with curated case studies, a static public-repository gallery, a canonical Blog archive, and profile pages. It keeps the Signal CV visual system and Hugo's static-first publishing workflow.

## Run the portfolio

Requires Hugo Extended 0.166 or newer plus Node.js and pnpm. Install the root Node dependencies for Pagefind and the theme dependencies for Tailwind CSS and DaisyUI:

```bash
pnpm install
pnpm --dir themes/railway-cv install
```

```bash
pnpm dev
```

Open `http://localhost:1313/`. The production build and local search index are:

```bash
pnpm run build:search
```

This builds the static site first, then Pagefind indexes the local output. Visitors do not need a GitHub API request for the repository gallery.

## Portfolio content

- `/portfolio/` starts with five case studies, then lists the checked-in public repository snapshot from `data/portfolio/repositories.json`.
- `/case-studies/<slug>/` explains a project's problem, ownership, decisions, and evidence, with links to source and related writing.
- `/posts/` is the canonical archive for 71 published posts. Its original year/month/slug paths and `/wp-content/uploads/` media paths are preserved.
- `/about/` and `/skills/` contain Avery's profile and experience.
- `/policy/` is a reserved stub. Three source policy notes remain excluded from public routes.

The fictional research starter stays under [`themes/railway-cv/examples/signal-cv-research-demo/`](themes/railway-cv/examples/signal-cv-research-demo/). The portfolio root uses owner-verified copy and public GitHub/LinkedIn contact links.

## Theme structure

- `themes/railway-cv/` contains the reusable Signal CV presentation, layouts, shortcodes, and example site.
- `content/` holds Avery's public portfolio, case studies, and Blog content.
- `data/home.yaml` provides editable homepage copy.
- `data/portfolio/repositories.json` is a reviewed static projection of public GitHub fields.
- `static/` holds local post media and cached repository previews.
- `mcp-hugo-server-go/` is the local Hugo MCP server source; `plugins/hugo-railway/` launches it for this workspace.

## Checks

```bash
pnpm test
pnpm run build:search
pnpm run check:portfolio
```

The repository filter state is shareable through `q`, `language`, and `focus`. The complete collection remains visible in generated HTML without JavaScript. Search uses the Pagefind index generated from the static build. `pnpm dev` and `pnpm run build` compile the theme's selected DaisyUI components before Hugo starts.

## Migration record

The VitePress source repository remains read-only. The reviewed promotion is recorded in [`docs/migrations/vitepress/promotion-manifest.json`](docs/migrations/vitepress/promotion-manifest.json); the former `_2` staging routes and asset namespace have been removed from the public build. The one-shot promotion script is retained at `scripts/promote-portfolio-content.mjs` for provenance and should not be rerun over the canonical content.

See [`CONTEXT.md`](CONTEXT.md) and [`docs/adr/`](docs/adr/) for the architecture and content-boundary decisions.
