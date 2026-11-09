---
title: Codex Long-Running Tasks
description: Bounded and resumable repository work with checkpoints and recovery.
repository: codex-long-running-task-plugin
focus: Durable automation
order: 2
summary: Bounded, resumable repository work with checkpoints, verification, recovery, and clear ownership of the working tree.
tags:
  - Codex
  - Recovery
  - Automation
related_posts:
  - /posts/2026/09/git-bbq-and-long-running-tasks-for-codex/
---

<p class="case-study-kicker">Durable automation · Codex · recovery design</p>

Codex Long-Running Tasks turns a large repository request into bounded, verifiable slices that can continue after interruption. The focus is not merely keeping a process alive; it is making progress recoverable and evidence-based.

## The problem

Long implementation sessions are vulnerable to timeouts, browser failures, context compaction, and partial edits. A task that only reports “still working” is hard to trust and harder to resume.

## What I owned

- The task and slice model for bounded repository work.
- Checkpoints tied to successful verification rather than elapsed time.
- Explicit recovery and resume behavior after a failed slice.
- Logs and status that distinguish progress, failure, and required input.
- Guardrails around worktrees, commits, and user-owned changes.

## Design decisions

Each slice has a concrete outcome and a verification contract. A checkpoint is created only after that contract passes, so resuming means starting from known-good state rather than guessing which edits were complete. The workflow also separates task orchestration from the repository’s own Git policy.

## Evidence and outcome

The project makes interruption an ordinary state with a path forward. A failed browser check can be recorded without pretending the slice succeeded, while independently verified code can still be recovered and reviewed. That distinction is useful anywhere automation must operate on valuable source trees.

## Links

- [Source repository on GitHub](https://github.com/averyfreeman/Codex-long-running-task-plugin)
- [Full portfolio collection](/portfolio/)
