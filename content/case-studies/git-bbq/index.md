---
title: Git BBQ
description: Agent-ready repository scaffolding for explicit architecture and Git habits.
repository: git-bbq
focus: AI developer tooling
order: 1
summary: Agent-ready repository scaffolding that turns architecture decisions, vocabulary, and Git habits into inspectable project infrastructure.
tags:
  - Codex
  - ADR
  - Git workflow
related_posts:
  - /posts/2026/09/git-bbq-and-long-running-tasks-for-codex/
---

<p class="case-study-kicker">AI developer tooling · Codex · architecture records</p>

Git BBQ is a repository scaffold and working method for projects where the code is only one part of the deliverable. It gives an agent and its human collaborator a shared vocabulary, explicit architecture records, and a visible Git workflow policy.

## The problem

Agent-assisted development can move quickly while quietly losing the reasoning that made a change safe. The result is a repository with good code but weak memory: terminology drifts, decisions disappear into chat, and Git mutations become difficult to audit.

## What I owned

- A TypeScript-aware bootstrap path for new repositories.
- A root `CONTEXT.md` for domain vocabulary and boundaries.
- Numbered ADRs with an index that can be validated and projected.
- `.githabits.yaml` as an explicit policy for commits, tags, remotes, and pushes.
- A workflow that keeps previews, approvals, and versioned history visible.

## Design decisions

The scaffold treats project language and Git behavior as first-class artifacts. An ADR explains why a boundary exists; `CONTEXT.md` explains what the project means; the Git policy explains how changes become history. These documents are deliberately small enough to read before acting and structured enough for tooling to validate.

## Evidence and outcome

The result is a repository an agent can enter without reconstructing every decision from old conversation turns. Architecture changes have a durable home, Git operations are policy-driven, and a new collaborator can inspect the same record before making a change.

## Links

- [Source repository on GitHub](https://github.com/averyfreeman/git-bbq)
- [Full portfolio collection](/portfolio/)
