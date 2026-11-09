# Signal CV theme layer

This directory is the reusable presentation layer for the root Signal CV Hugo site. It started from the HugoBlox Academic CV starter and now owns the self-contained templates, CSS tokens, progressive motion, and content primitives used by the demo.

## Theme responsibilities

- dark charcoal surfaces with crisp grid lines and violet/mint/amber signal accents;
- DaisyUI component CSS compiled at build time from the Signal CV tokens, with no DaisyUI runtime JavaScript;
- responsive header, hero terminal, stats, work cards, notes index, and content layouts;
- static-first notebook bundle shortcode for page-local `.ipynb` artifacts;
- Markdown-friendly article, project, publication, and notebook pages;
- no JavaScript framework or remote asset dependency.

The root project owns `content/`, `data/home.yaml`, and the canonical build commands. The original Academic CV sample content is preserved under [`examples/academic-cv-content`](examples/academic-cv-content) for reference but is not loaded into the root build.

## Reuse

Copy this directory into another Hugo project as `themes/railway-cv`, set `theme = 'railway-cv'`, and provide the `data/home.yaml` shape used by `layouts/home.html`. The root `README.md` documents the full demo workflow.

The upstream license and attribution remain in [`LICENSE.md`](LICENSE.md). Railway is a visual reference only; this theme's copy, marks, and assets are original.
