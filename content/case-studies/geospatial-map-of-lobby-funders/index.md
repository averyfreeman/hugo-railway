---
title: Geospatial Map of Lobby Funders
description: A civic-data visualization project combining Python analysis, geospatial boundaries, and animated timelines.
repository: geospatial-map-of-lobby-funders
focus: Civic data visualization
order: 5
summary: A Nucamp honors project that combines geospatial data, animated timelines, Python analysis, and reproducible containerized rendering.
tags:
  - GeoPandas
  - Matplotlib
  - Containers
related_posts:
  - /posts/2024/06/graphing-numbers-with-geospatial-boundaries-using-geopandas-and-matplotlib/
---

<p class="case-study-kicker">Civic data visualization · GeoPandas · reproducible rendering</p>

This project visualizes money reported by out-of-state organizations lobbying Washington residents and lawmakers. It began as a Nucamp Backend, SQL and DevOps with Python honors project and grew into a deeper exploration of public data, geospatial boundaries, and animated storytelling.

## The problem

The source disclosure data is tabular and difficult to read as a geographic or temporal story. A useful presentation needed to preserve the numbers while making the movement of money across states and years visible.

## What I owned

- Narrowing and typing the public disclosure dataset with Python and Pandas.
- Pivoting the data by state and year for comparison.
- Joining the numeric data to US Census boundary files with GeoPandas.
- Rendering a consistent animated timeline with Matplotlib.
- Exploring a containerized renderer so the output could be reproduced consistently.

## Design decisions

The visualization keeps the data preparation explicit: select the meaningful columns, normalize missing values, aggregate by state and year, then join to geographic boundaries. The animation shows each year before ending on the aggregate, preserving the temporal explanation instead of presenting only a final map.

## Evidence and outcome

The project became a working animated map and companion bar-chart story, not only a notebook calculation. It also marks a useful learning edge: I went beyond the course’s data portion to learn the NumPy, Pandas, GeoPandas, and Matplotlib techniques needed to make the public data legible.

## Links

- [Source repository on GitHub](https://github.com/averyfreeman/geospatial-map-of-lobby-funders)
- [Historical blog post](/posts/2024/06/graphing-numbers-with-geospatial-boundaries-using-geopandas-and-matplotlib)
- [Full portfolio collection](/portfolio/)
