# Render notebooks statically first

Accepted: notebook bundles are authored as Hugo content and rendered during the build, following the working HugoBlox pattern already present in the starter. A future live-kernel adapter can be added behind the same content boundary without making local site builds depend on a running notebook service.

## Consequences

Markdown, LaTeX, and notebook artifacts remain reviewable and deployable as static files. Live execution is intentionally a later adapter rather than a prerequisite for the starter site.
