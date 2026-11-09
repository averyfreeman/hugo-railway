# Railway-CV Monorepo Context

This repository contains a reusable Hugo theme, Avery Freeman's hiring-first portfolio demo, and a local MCP server integration for agent-assisted static publishing.

## Site architecture

**Portfolio demo site**:
The Hugo root at `./` demonstrates the theme with Avery's public portfolio, five case studies, a published Blog archive, and profile pages.
_Avoid_: theme, empty starter

**Theme layer**:
The reusable presentation and content model at `themes/railway-cv/`.
_Avoid_: root website

**Theme example site**:
The fictional research sample under `themes/railway-cv/examples/signal-cv-research-demo/`, kept as a portable theme demonstration.
_Avoid_: public portfolio content

**Case study**:
A Hugo content bundle at `/case-studies/<slug>/` that explains a project's problem, ownership, decisions, and evidence, then links to source and relevant writing.
_Avoid_: repository card, resume claim

**Repository projection**:
The checked-in public-only GitHub metadata at `data/portfolio/repositories.json`, rendered as HTML during the Hugo build and filtered in the browser.
_Avoid_: live GitHub profile query

**Published post**:
A source-reviewed article at `/posts/<year>/<month>/<slug>/`; the archive contains 70 recovered historical posts and one later-authored post explicitly marked published.
_Avoid_: staging import, temporary `_2` route

## Editorial tooling

**Static-first notebook**:
An `.ipynb` or other notebook artifact rendered during the Hugo build, with an optional path reserved for a future live kernel adapter.
_Avoid_: interactive notebook, runtime notebook

**MCP workspace**:
The Hugo project paths exposed to the local `mcp-hugo-server-go` process: site output, project root, content root, and public URL.
_Avoid_: server root, site root (when referring to the whole project)

**Local plugin**:
The Codex plugin in `plugins/hugo-railway/` that launches the repo-bound MCP workspace and can be surfaced through the user's local marketplace.
_Avoid_: extension, integration

## Public-content boundary

The root site publishes the five curated case studies, the 60-record public repository projection, 71 explicitly published blog posts, and Avery's About and Skills pages. `/policy/` is a minimal reserved stub; the three policy notes remain outside public routes until there is an explicit content decision. The VitePress source repository is read-only during promotion.

## Design language

**Signal surface**:
A charcoal panel with a thin border, restrained glow, and clear grid alignment used for content and portfolio cards.
_Avoid_: ornamental box, forest-art theme

**Progressive motion**:
CSS-first motion that keeps content visible without JavaScript, enhanced by observers when available, and disabled for reduced-motion preferences.
_Avoid_: animation everywhere, hidden-until-JavaScript content
