#!/usr/bin/env node

import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import YAML from 'yaml'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_SOURCE = path.resolve(ROOT, '../merged-portfolio-blog-site')
const STAGED_ROOTS = [
  'content/articles_2',
  'content/projects_2',
  'content/about_2',
  'content/skills_2',
  'content/policy_2',
  'content/vitepress-migration',
  'data/vitepress_2',
  'static/vitepress_2',
  'docs/migrations/vitepress',
]
const PROTECTED_ROOTS = [
  'content/articles',
  'content/projects',
  'content/notebooks',
  'content/publications',
  'data/home.yaml',
  'themes/railway-cv/examples',
  'themes/railway-cv/layouts/home.html',
  'themes/railway-cv/layouts/partials/site-header.html',
  'themes/railway-cv/layouts/partials/site-footer.html',
]

function usage() {
  console.log([
    'Usage: pnpm content:sync -- [options]',
    '',
    '  --source <path>       VitePress repository (default: ' + DEFAULT_SOURCE + ')',
    '  --check               Validate and report without writing files',
    '  --refresh             Allow updates inside the existing migration namespace',
    '  --skip-repositories   Do not fetch the GitHub repository snapshot',
    '  --help                Show this help',
  ].join('\n'))
}

function parseArgs(argv) {
  const options = {
    source: process.env.VITEPRESS_SOURCE || DEFAULT_SOURCE,
    check: false,
    refresh: false,
    skipRepositories: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    } else if (argument === '--check') {
      options.check = true
    } else if (argument === '--refresh') {
      options.refresh = true
    } else if (argument === '--skip-repositories') {
      options.skipRepositories = true
    } else if (argument === '--source') {
      options.source = argv[++index]
    } else if (argument.startsWith('--source=')) {
      options.source = argument.slice('--source='.length)
    } else {
      throw new Error('Unknown argument: ' + argument)
    }
  }
  if (!options.source) throw new Error('--source requires a path.')
  options.source = path.resolve(options.source)
  return options
}

function relativeToRoot(relativePath) {
  const absolute = path.resolve(ROOT, relativePath)
  const relative = path.relative(ROOT, absolute)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Refusing to write outside the Hugo repository: ' + relativePath)
  }
  return { relative, absolute }
}

function isWithin(relativePath, rootPath) {
  const target = path.resolve(ROOT, relativePath)
  const root = path.resolve(ROOT, rootPath)
  const relative = path.relative(root, target)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function isStagedPath(relativePath) {
  return STAGED_ROOTS.some((rootPath) => isWithin(relativePath, rootPath))
}

function isProtectedPath(relativePath) {
  return PROTECTED_ROOTS.some((rootPath) => isWithin(relativePath, rootPath))
}

async function ensureSource(source) {
  const required = [
    'docs/posts',
    'docs/policy',
    'docs/about.md',
    'docs/skills.md',
    'docs/portfolio.md',
    'docs/public',
  ]
  const missing = required
    .map((entry) => path.join(source, entry))
    .filter((entry) => !existsSync(entry))
  if (missing.length) {
    throw new Error(['The VitePress source is missing required paths:', ...missing].join('\n'))
  }
}

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walkFiles(absolute))
    else if (entry.isFile()) files.push(absolute)
  }
  return files.sort()
}

function parseFrontmatter(contents, sourcePath) {
  if (!contents.startsWith('---')) return { data: {}, body: contents }
  const close = contents.indexOf('\n---', 3)
  if (close < 0) throw new Error('Frontmatter is not closed: ' + sourcePath)
  let bodyStart = close + 4
  if (contents[bodyStart] === '\n') bodyStart += 1
  return {
    data: YAML.parse(contents.slice(4, close)) || {},
    body: contents.slice(bodyStart),
  }
}

function parseYaml(contents) {
  return YAML.parse(contents) || {}
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')
}

function rewriteRootPath(value, fromRoot, toRoot) {
  if (typeof value !== 'string') return value
  const expression = new RegExp(
    "(^|[\\s\"'(=])" + escapeRegExp(fromRoot) + "(?=(?:/|[\"')\\s]|$))",
    'g',
  )
  return value.replace(expression, (_, prefix) => prefix + toRoot)
}

function rewriteStagedPaths(value) {
  if (typeof value !== 'string') return value
  const mappings = [
    ['/posts', '/articles_2'],
    ['/portfolio', '/projects_2'],
    ['/about', '/about_2'],
    ['/skills', '/skills_2'],
    ['/policy', '/policy_2'],
    ['/wp-content', '/vitepress_2/wp-content'],
    ['/post-thumbnails', '/vitepress_2/post-thumbnails'],
    ['/repository-previews', '/vitepress_2/repository-previews'],
    ['/policy-thumbnails', '/vitepress_2/policy-thumbnails'],
  ]
  return mappings.reduce(
    (result, mapping) => rewriteRootPath(result, mapping[0], mapping[1]),
    value,
  )
}

function removeVueArtifacts(body) {
  return body
    .replace(/<script\s+setup[^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<(?:PostToc|PolicyToc|RepositoryGrid)\b[^>]*\/?>\s*/gi, '')
    // VitePress code-block line highlighting attributes are not valid Hugo
    // Goldmark fence syntax. Keep the language and drop only the hint.
    .replace(/^(```[^\n{]+)\{[^}\n]*\}$/gm, '$1')
    .trim()
}

function setIfDefined(target, key, value) {
  if (value !== undefined && value !== null && value !== '') target[key] = value
}

function normalizePost(frontmatter, body, sourcePath) {
  const data = {
    title: frontmatter.title || 'Untitled article',
    layout: 'migration-single',
    migration_source: 'vitepress',
    migration_kind: 'article',
    source_path: sourcePath,
    draft: false,
  }
  setIfDefined(data, 'description', frontmatter.description || frontmatter.preview)
  setIfDefined(data, 'summary', frontmatter.preview || frontmatter.description)
  setIfDefined(data, 'date', frontmatter.date)
  setIfDefined(data, 'author', frontmatter.author)
  setIfDefined(data, 'slug', frontmatter.slug)
  setIfDefined(data, 'categories', frontmatter.categories)
  setIfDefined(data, 'tags', frontmatter.tags)
  setIfDefined(data, 'thumbnail', rewriteStagedPaths(frontmatter.thumbnail))
  setIfDefined(data, 'thumbnail_alt', frontmatter.thumbnailAlt || frontmatter.title)
  setIfDefined(data, 'thumbnail_width', frontmatter.thumbnailWidth)
  setIfDefined(data, 'thumbnail_height', frontmatter.thumbnailHeight)
  setIfDefined(data, 'thumbnail_aspect', frontmatter.thumbnailAspect)
  setIfDefined(data, 'thumbnail_status', frontmatter.thumbnailStatus)
  setIfDefined(data, 'site_timezone', frontmatter.siteTimezone)
  setIfDefined(data, 'source_wp_id', frontmatter.wpId)
  setIfDefined(data, 'source_guid', frontmatter.sourceGuid)
  setIfDefined(data, 'source_status', frontmatter.status)
  setIfDefined(data, 'source_type', frontmatter.type)
  return { data, body: rewriteStagedPaths(body) }
}

function normalizePolicy(frontmatter, body, sourcePath) {
  const data = {
    title: frontmatter.title || 'Untitled policy note',
    layout: 'migration-single',
    migration_source: 'vitepress',
    migration_kind: 'policy',
    working_note: true,
    draft: false,
    source_path: sourcePath,
  }
  setIfDefined(data, 'description', frontmatter.description)
  setIfDefined(data, 'summary', frontmatter.description)
  setIfDefined(data, 'thumbnail', rewriteStagedPaths(frontmatter.thumbnail))
  setIfDefined(data, 'thumbnail_alt', frontmatter.thumbnailAlt || frontmatter.title)
  setIfDefined(data, 'policy_hero', rewriteStagedPaths(frontmatter.policyHero))
  setIfDefined(data, 'policy_hero_alt', frontmatter.policyHeroAlt)
  // One migrated policy note contains an escaped Markdown heading from its
  // source prompt. Normalize headings only in policy notes; article bodies
  // intentionally retain escaped shell/code examples.
  const normalizedBody = body.replace(/^\\(#{1,6}\s)/gm, '$1')
  return { data, body: rewriteStagedPaths(normalizedBody) }
}

function normalizeProfile(frontmatter, body, sourcePath) {
  const data = {
    title: frontmatter.title || 'Profile',
    layout: 'migration-single',
    migration_source: 'vitepress',
    migration_kind: 'profile',
    draft: false,
    source_path: sourcePath,
  }
  setIfDefined(data, 'description', frontmatter.description)
  return { data, body: rewriteStagedPaths(body) }
}

function renderPage(data, body) {
  return [
    '---',
    YAML.stringify(data, { lineWidth: 0 }).trimEnd(),
    '---',
    '',
    body.trim(),
    '',
  ].join('\n')
}

function addOutput(plan, relativePath, value, kind) {
  const target = relativeToRoot(relativePath)
  if (isProtectedPath(target.relative)) {
    throw new Error('Protected demo path appeared in migration output: ' + target.relative)
  }
  if (!isStagedPath(target.relative)) {
    throw new Error('Migration output is outside the staged namespace: ' + target.relative)
  }
  plan.outputs.push({
    relative: target.relative,
    absolute: target.absolute,
    value,
    kind: kind || 'text',
  })
}

async function addFileTree(plan, sourceDirectory, targetDirectory) {
  if (!existsSync(sourceDirectory)) return 0
  const files = await walkFiles(sourceDirectory)
  for (const sourceFile of files) {
    addOutput(
      plan,
      path.join(targetDirectory, path.relative(sourceDirectory, sourceFile)),
      sourceFile,
      'copy',
    )
  }
  return files.length
}

async function normalizeMarkdownFile(plan, sourceFile, destination, normalizer) {
  const contents = await fs.readFile(sourceFile, 'utf8')
  const parsed = parseFrontmatter(contents, sourceFile)
  const sourcePath = path.relative(plan.source, sourceFile)
  const normalized = normalizer(parsed.data, removeVueArtifacts(parsed.body), sourcePath)
  addOutput(plan, destination, renderPage(normalized.data, normalized.body))
}

async function importPosts(plan) {
  const directory = path.join(plan.source, 'docs/posts')
  const files = (await walkFiles(directory)).filter((file) => file.endsWith('.md'))
  let count = 0
  for (const sourceFile of files) {
    const relative = path.relative(directory, sourceFile)
    if (relative === 'index.md') {
      await normalizeMarkdownFile(plan, sourceFile, 'content/articles_2/_index.md', (frontmatter, body, sourcePath) => ({
        data: {
          title: frontmatter.title || 'Articles',
          description: frontmatter.description || 'Imported technical notes from the VitePress archive.',
          layout: 'migration-list',
          migration_source: 'vitepress',
          migration_kind: 'article-index',
          source_path: sourcePath,
        },
        body: rewriteStagedPaths(body),
      }))
      continue
    }
    const destination = path.join(
      'content/articles_2',
      relative.replace(/\.md$/i, ''),
      'index.md',
    )
    await normalizeMarkdownFile(plan, sourceFile, destination, normalizePost)
    count += 1
  }
  return count
}

async function importPolicies(plan) {
  const directory = path.join(plan.source, 'docs/policy')
  const files = (await walkFiles(directory)).filter((file) => file.endsWith('.md'))
  let count = 0
  for (const sourceFile of files) {
    const relative = path.relative(directory, sourceFile)
    if (relative === 'index.md') {
      await normalizeMarkdownFile(plan, sourceFile, 'content/policy_2/_index.md', (frontmatter, body, sourcePath) => ({
        data: {
          title: frontmatter.title || 'Policy working notes',
          description: frontmatter.description || 'Exploratory public policy notes.',
          layout: 'migration-list',
          migration_source: 'vitepress',
          migration_kind: 'policy-index',
          source_path: sourcePath,
        },
        body: rewriteStagedPaths(body),
      }))
      continue
    }
    const destination = path.join(
      'content/policy_2',
      relative.replace(/\.md$/i, ''),
      'index.md',
    )
    await normalizeMarkdownFile(plan, sourceFile, destination, normalizePolicy)
    count += 1
  }
  return count
}

async function importProfilePage(plan, sourcePath, destination) {
  await normalizeMarkdownFile(
    plan,
    path.join(plan.source, sourcePath),
    destination,
    normalizeProfile,
  )
}

async function getGithubSnapshot(plan) {
  const attributes = parseYaml(await fs.readFile(
    path.join(plan.source, 'docs/user-attributes.yaml'),
    'utf8',
  ))
  const username = attributes.github && attributes.github.username
  if (!username) throw new Error('docs/user-attributes.yaml does not define github.username.')

  const github = await import(pathToFileURL(path.join(plan.source, 'docs/api/github.js')).href)
  const previews = await import(pathToFileURL(path.join(plan.source, 'docs/api/repository-previews.js')).href)
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }
    : {}
  const repositories = await github.fetchGithubRepositories(username, { headers })
  let pinned = []
  try {
    pinned = await github.fetchGithubPinnedRepositoryNames(username, { headers })
  } catch (error) {
    plan.warnings.push('Pinned repository ordering was unavailable: ' + error.message)
  }
  const pinnedKeys = pinned.map((value) => String(value).toLowerCase())
  const sorted = github.sortGithubRepositories(repositories, pinned)
  const publicRoot = path.join(plan.source, 'docs/public')
  const records = sorted.map((repository, index) => {
    const nameKey = String(repository.name || '').toLowerCase()
    const fullNameKey = String(repository.full_name || '').toLowerCase()
    const pinnedOrder = pinnedKeys.findIndex((value) => value === nameKey || value === fullNameKey)
    const preview = previews.repositoryPreviewPath(repository)
    const previewFile = preview ? path.join(publicRoot, preview.slice(1)) : null
    return {
      name: repository.name || repository.full_name,
      full_name: repository.full_name,
      description: repository.description || '',
      html_url: repository.html_url || '',
      homepage: repository.homepage || '',
      language: repository.language || '',
      stargazers_count: repository.stargazers_count || 0,
      forks_count: repository.forks_count || 0,
      updated_at: repository.updated_at || '',
      pinned: pinnedOrder >= 0,
      pinned_order: pinnedOrder >= 0 ? pinnedOrder : index,
      preview: preview && previewFile && existsSync(previewFile)
        ? rewriteStagedPaths(preview)
        : '',
    }
  })
  return {
    generated_at: new Date().toISOString(),
    source: 'GitHub public repository snapshot',
    username,
    pinned_repositories: pinned,
    repositories: records,
  }
}

function migrationHub() {
  return [
    '---',
    'title: "VitePress migration review"',
    'description: "A non-destructive staging area for imported VitePress content beside the existing Hugo demo."',
    'layout: migration-hub',
    'migration_source: vitepress',
    '---',
    '',
    'This temporary review surface keeps the existing demo sections separate and unchanged until a later reconciliation decision.',
    '',
    '- [Imported articles](/articles_2/)',
    '- [Imported projects](/projects_2/)',
    '- [Imported About page](/about_2/)',
    '- [Imported skills and experience](/skills_2/)',
    '- [Imported policy working notes](/policy_2/)',
    '',
  ].join('\n')
}

async function buildPlan(source, options) {
  await ensureSource(source)
  const plan = { source, outputs: [], warnings: [], counts: {} }
  plan.counts.articles = await importPosts(plan)
  plan.counts.policies = await importPolicies(plan)
  await importProfilePage(plan, 'docs/about.md', 'content/about_2/index.md')
  await importProfilePage(plan, 'docs/skills.md', 'content/skills_2/index.md')
  addOutput(plan, 'content/projects_2/_index.md', renderPage({
    title: 'Examples of my work',
    description: 'Public GitHub repositories staged from the VitePress portfolio.',
    layout: 'migration-projects',
    migration_source: 'vitepress',
    migration_kind: 'projects-index',
    source_path: 'docs/portfolio.md',
  }, 'These are the kinds of things I like to build when a problem is interesting enough to deserve a real tool: developer utilities, Linux and infrastructure projects, automation, data and civic-information experiments, AI and agent tooling, and small web apps. Some are polished, some are experiments, and all are staged here as direct links to public GitHub repositories.\n\nThe original VitePress portfolio presented those repositories as a lightweight collection of links with cached README previews. This staged Hugo collection preserves that behavior for review; repository cards link directly to GitHub and do not create artificial project pages.'))
  addOutput(plan, 'content/vitepress-migration/_index.md', migrationHub())
  plan.counts.profile_pages = 2
  plan.counts.public_assets = await addFileTree(plan, path.join(source, 'docs/public'), 'static/vitepress_2')
  plan.counts.reference_assets = await addFileTree(plan, path.join(source, 'docs/assets'), 'docs/migrations/vitepress/source-assets')
  if (!options.skipRepositories) {
    const snapshot = await getGithubSnapshot(plan)
    plan.counts.repositories = snapshot.repositories.length
    addOutput(plan, 'data/vitepress_2/repositories.json', JSON.stringify(snapshot, null, 2) + '\n')
  } else {
    plan.counts.repositories = 0
    plan.warnings.push('Repository snapshot skipped by request.')
  }
  const manifest = {
    generated_at: new Date().toISOString(),
    source_repository: source,
    source_documents: {
      articles: 'docs/posts',
      policy: 'docs/policy',
      profile: ['docs/about.md', 'docs/skills.md', 'docs/portfolio.md'],
    },
    counts: plan.counts,
    staged_roots: STAGED_ROOTS,
    protected_roots: PROTECTED_ROOTS,
    excluded_source_documents: [
      'docs/index.md',
      'docs/skills-generic.md',
      'docs/adr',
      'docs/components',
      'docs/api',
      'node_modules',
      '.vitepress/cache',
      '.vitepress/dist',
    ],
    warnings: plan.warnings,
  }
  addOutput(plan, 'docs/migrations/vitepress/staging-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
  return plan
}

function checkExistingOutputs(plan, refresh) {
  const existing = plan.outputs.filter((output) => existsSync(output.absolute))
  if (!existing.length || refresh) return
  const outsideNamespace = existing.filter((output) => !isStagedPath(output.relative))
  if (outsideNamespace.length) {
    throw new Error([
      'Existing output escaped the migration namespace:',
      ...outsideNamespace.map((entry) => entry.relative),
    ].join('\n'))
  }
  throw new Error([
    'Migration output already exists. Use --refresh to update only staged files:',
    ...existing.slice(0, 30).map((entry) => entry.relative),
  ].join('\n'))
}

async function writePlan(plan) {
  for (const output of plan.outputs) {
    await fs.mkdir(path.dirname(output.absolute), { recursive: true })
    if (output.kind === 'copy') await fs.copyFile(output.value, output.absolute)
    else await fs.writeFile(output.absolute, output.value, 'utf8')
  }
}

function printSummary(plan, mode) {
  console.log(mode + ' VitePress migration staging')
  console.log('source: ' + plan.source)
  console.log('articles: ' + plan.counts.articles)
  console.log('policy notes: ' + plan.counts.policies)
  console.log('profile pages: ' + plan.counts.profile_pages)
  console.log('repositories: ' + plan.counts.repositories)
  console.log('public assets: ' + plan.counts.public_assets)
  console.log('reference assets: ' + plan.counts.reference_assets)
  console.log('outputs: ' + plan.outputs.length)
  for (const warning of plan.warnings) console.warn('warning: ' + warning)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const plan = await buildPlan(options.source, options)
  if (!options.check) checkExistingOutputs(plan, options.refresh)
  if (!options.check) await writePlan(plan)
  printSummary(plan, options.check ? 'Checked' : 'Wrote')
}

main().catch((error) => {
  console.error('content:sync failed: ' + error.message)
  process.exitCode = 1
})
