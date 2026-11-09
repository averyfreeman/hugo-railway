---
title: Git BBQ, Long-Running Tasks, and a Much Better Way to Use Codex
description: A very casual tour of Git BBQ, Long-Running Tasks, Matt Pocock's skills, and the little Personalization tweak that makes agent-assisted engineering feel much more deliberate.
summary: Git BBQ gives coding agents durable project context, ADR scaffolding, validation, and explicit Git habits. Add Long-Running Tasks and Codex gets a much better way to carry careful work across turns.
date: 2026-09-22T19:00:00Z
author: Avery Freeman
slug: git-bbq-and-long-running-tasks-for-codex
categories:
  - Engineering
  - AI
thumbnail: /repository-previews/averyfreeman--git-bbq.webp
thumbnail_alt: Git BBQ repository README preview
thumbnail_width: 1440
thumbnail_height: 900
thumbnail_aspect: 1.6
type: post
status: publish
url: /posts/2026/09/git-bbq-and-long-running-tasks-for-codex/
---

# Git BBQ, Long-Running Tasks, and a much better way to use Codex

I have become the person who wants the agent to tell me what it thinks the
project is before it starts touching files.

Not a 40-page requirements document. Just the useful stuff: what the project
means, what decisions have already been made, which Git operations need a
human, and how we know the work is actually finished.

That is why I like [Git BBQ](https://github.com/averyfreeman/Git-BBQ). It gives
those answers a home inside the repository instead of leaving them scattered
through an old chat window.

## What Git BBQ actually does

Git BBQ is a Go-first scaffolding and repository-lifecycle tool for coding-agent
projects. It does not call a model and it does not try to replace the host
agent's architecture work. It gives that work a useful shape:

- CONTEXT.md for the words and concepts the project needs to keep straight.
- docs/adr/ for decisions that should survive the current conversation.
- .agents/skills/ for focused language and Git workflow guidance.
- .githabits.yaml for explicit rules around Git operations.
- Generated contract, plan, and ADR-index projections that can be checked.

That sounds pretty sensible on paper. It becomes much more convincing when an
agent has to pick up a repository it did not create and can read the project
vocabulary and decisions instead of guessing.

## A real example: Secure-Web-Printer

The old example was basically “make a portable project scaffold.” That is not
something I would actually sit down to build. A better example is a project
with a job to do.

Suppose I am creating Secure-Web-Printer: a Go HTTPS server with an embedded
Let's Encrypt ACME requester, HTMX and Markdown templates, and release builds
for macOS, Linux, and Windows on both x86_64 and ARM64.

First, compile Git BBQ itself. Then use that binary to scaffold the project,
record the release decision, generate the projections, and validate everything:

~~~bash
go build -o ./git-bbq ./cmd/git-bbq

./git-bbq init \
  --name Secure-Web-Printer \
  --problem "Build Secure-Web-Printer, a Go HTTPS server with an embedded Let's Encrypt ACME requester, HTMX and Markdown templates, and release binaries for aarch64-darwin, gnu-linux-x86_64, gnu-linux-aarch64, Windows x86_64, and Windows aarch64." \
  --language go \
  ./Secure-Web-Printer

./git-bbq adr new \
  --title "Set Secure-Web-Printer release targets" \
  --context "Secure-Web-Printer needs one release matrix for its Go HTTPS server across macOS arm64, Linux x86_64 and arm64, and Windows x86_64 and arm64." \
  --decision "Use darwin/arm64 (aarch64-darwin), linux/amd64 (gnu-linux-x86_64), linux/arm64 (gnu-linux-aarch64), windows/amd64 (Windows x86_64), and windows/arm64 (Windows aarch64)." \
  --why "The names make the release promise readable while Go's GOOS and GOARCH pairs keep builds reproducible." \
  ./Secure-Web-Printer

./git-bbq project ./Secure-Web-Printer
./git-bbq validate ./Secure-Web-Printer
~~~

There is no imaginary target flag in this example. Git BBQ records the project
problem and the decision; the actual Go module, HTTPS server, ACME integration,
templates, and release pipeline still belong to Secure-Web-Printer.

### The documents you actually get

The commands above are useful because they leave behind concrete files, not
just a cheerful “done” message. After the full sequence, the project contains:

~~~text
Secure-Web-Printer/
├── .agents/
│   ├── mattpocock/DEPENDENCY.yaml
│   └── skills/
│       ├── githabits/SKILL.md
│       └── go/SKILL.md
├── .gitbbq/
│   ├── .gitignore
│   ├── hooks.json
│   ├── ownership.json
│   └── session.json
├── .gitbbq-manifest.yaml
├── .githabits.yaml
├── AGENTS.md
├── CLAUDE.md
├── CONTEXT-MAP.md
├── CONTEXT.md
├── architecture-contract.yaml
├── docs/
│   └── adr/
│       ├── 0001-set-secure-web-printer-release-targets.md
│       └── index.json
└── implementation-plan.md
~~~

CONTEXT.md and CONTEXT-MAP.md give the project a shared vocabulary. AGENTS.md
and CLAUDE.md route host agents to it. The manifest records the problem,
language profile, pinned Matt dependency, and hooks. .githabits.yaml makes the
Git policy visible.

The file under docs/adr/ is the actual architectural decision: the release
targets are not a vague wish buried in a prompt. The architecture contract,
implementation plan, and ADR index are generated projections, so they can be
rebuilt from the source documents. validate checks the whole arrangement
without creating a second source of truth.

That distinction is the part I keep wanting from agent tooling: decisions that
are readable by people, and projections that are convenient for tools.

### The five release targets

The friendly release labels map to Go's GOOS and GOARCH values like this:

| Release label | GOOS | GOARCH |
| --- | --- | --- |
| aarch64-darwin | darwin | arm64 |
| gnu-linux-x86_64 | linux | amd64 |
| gnu-linux-aarch64 | linux | arm64 |
| Windows x86_64 | windows | amd64 |
| Windows aarch64 | windows | arm64 |

Once the project has a go.mod and an application entry point, the builds can
stay pleasantly boring:

~~~bash
mkdir -p dist
GOOS=darwin GOARCH=arm64 go build -o dist/Secure-Web-Printer-aarch64-darwin ./...
GOOS=linux GOARCH=amd64 go build -o dist/Secure-Web-Printer-gnu-linux-x86_64 ./...
GOOS=linux GOARCH=arm64 go build -o dist/Secure-Web-Printer-gnu-linux-aarch64 ./...
GOOS=windows GOARCH=amd64 go build -o dist/Secure-Web-Printer-windows-x86_64.exe ./...
GOOS=windows GOARCH=arm64 go build -o dist/Secure-Web-Printer-windows-aarch64.exe ./...
~~~

Those commands are application work. Git BBQ's role is to make the promise and
the reasoning around it visible before somebody starts shipping binaries.

## Give Matt Pocock the credit

Git BBQ builds on ideas from [Matt Pocock's skills repository](https://github.com/mattpocock/skills),
and he deserves real credit for making the underlying engineering habits so
practical.

The useful bit is not ceremony for ceremony's sake. The skills push an agent to
clarify the vocabulary, ask about the design, work in smaller feedback loops,
and write down the decisions that would otherwise disappear. The
[grill-me](https://github.com/mattpocock/skills/tree/main/mattpocock-productivity-grilling)
and
[grill-with-docs](https://github.com/mattpocock/skills/tree/main/mattpocock-engineering-grill-with-docs)
patterns are especially good at catching the “wait, that is not what I meant”
problem before it turns into an afternoon of rework.

Git BBQ is my way of giving those habits a repository-shaped place to live.

## When one conversation is not enough

Some work is not difficult because one line is mysterious. It is difficult
because there are several sensible steps, a verification pass, a browser check,
and a decent chance the context window will run out before the work is done.

That is where [Codex Long-Running Tasks](https://github.com/averyfreeman/Codex-long-running-task-plugin)
fits.

The [@Long-Running Tasks](plugin://long-running-tasks-plugin@long-running-tasks-plugin-marketplace)
plugin turns an explicit TASK.md and strict PLAN.md into bounded slices. A
slice has a goal, acceptance criteria, and verification. It works in a retained
worktree and branch, keeps the base branch out of the blast radius, and pauses
when the task hits a real risk or ambiguity.

When a slice succeeds, the plan records progress and the work can get a
checkpoint or annotated tag. When the context window gets tight, the next slice
can continue from the repository state instead of relying on a fresh session to
remember everything. That is not magic; it is just a much better way to handle
work that is bigger than one sitting.

## My favorite small productivity upgrade: Personalization

If you use Codex regularly, tell it these are your defaults once instead of
repeating them in every project request.

In ChatGPT/Codex, open **Settings → Personalization → Codex instructions**,
paste something like this, and save it:

~~~text
# Repository workflow

- For every repository task, use @Git BBQ to establish or update project context,
  ADRs, implementation plans, and explicit Git workflow policy. Validate the
  architecture projections before treating the work as complete.
- If a task will span multiple turns or context windows, use @Long-Running Tasks
  with an explicit TASK.md, strict PLAN.md, bounded verification, and recoverable
  checkpoints. Never merge, push, or publish automatically.
- Keep repository instructions, architectural decisions, and verification results
  auditable in the project rather than leaving them only in chat history.
~~~

In a client that supports plugin links, use [@Git BBQ](plugin://git-bbq@git-bbq-local)
and [@Long-Running Tasks](plugin://long-running-tasks-plugin@long-running-tasks-plugin-marketplace)
in those instructions. The plugin names are reminders to invoke the tools; you
still need to install or enable the plugins first. Personalization also does
not override a repository's own instructions, so a project can add tighter
rules when it needs them.

For reference:

- [Git BBQ on GitHub](https://github.com/averyfreeman/Git-BBQ)
- [Codex Long-Running Tasks on GitHub](https://github.com/averyfreeman/Codex-long-running-task-plugin)

## Why bother?

Because “the agent made something” is a pretty low bar.

The better outcome is that the agent understood the project, asked about the
ambiguous parts, recorded the decisions, made a bounded change, ran the checks,
and left a trail another human can follow. Git BBQ gives that process a home.
Long-Running Tasks gives it a way to keep moving when the work takes longer
than a single conversation.

Give it a try on a small project. Let the agent ask a few annoying-but-useful
questions before it starts, and see how much less often you have to say, “No,
no, that is not what I meant.”

For the project walkthroughs, see the [Git BBQ case study](/case-studies/git-bbq/) and the [Codex Long-Running Tasks case study](/case-studies/codex-long-running-task-plugin/).
