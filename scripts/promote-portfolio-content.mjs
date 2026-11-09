#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import YAML from 'yaml'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SOURCE = path.resolve(ROOT, '../merged-portfolio-blog-site')
const CONTENT = path.join(ROOT, 'content')

function rewriteRootPath(value, fromRoot, toRoot) {
  if (typeof value !== 'string') return value
  const escaped = fromRoot.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')
  const expression = new RegExp(`(^|[\\s"'(=])${escaped}(?=(?:/|["')\\s]|$))`, 'g')
  return value.replace(expression, (_, prefix) => prefix + toRoot)
}

function canonicalize(value) {
  const mappings = [
    ['/articles_2', '/posts'],
    ['/projects_2', '/portfolio'],
    ['/about_2', '/about'],
    ['/skills_2', '/skills'],
    ['/policy_2', '/policy'],
    ['/vitepress_2/wp-content', '/wp-content'],
    ['/vitepress_2/post-thumbnails', '/post-thumbnails'],
    ['/vitepress_2/repository-previews', '/repository-previews'],
  ]
  return mappings.reduce((result, [fromRoot, toRoot]) => rewriteRootPath(result, fromRoot, toRoot), value)
}

function parsePage(source) {
  const split = source.indexOf('\n---', 3)
  if (!source.startsWith('---') || split < 0) throw new Error('Invalid front matter')
  const data = YAML.parse(source.slice(4, split)) || {}
  return { data, body: source.slice(split + 4).replace(/^\n/, '') }
}

function writePage(frontmatter, body) {
  return `---\n${YAML.stringify(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.trim()}\n`
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath)
  }
  return files.sort()
}

async function copyDemoExamples() {
  const examples = path.join(ROOT, 'themes/railway-cv/examples/signal-cv-research-demo')
  const exampleContent = path.join(examples, 'content')
  for (const section of ['articles', 'projects', 'notebooks', 'publications']) {
    await fs.cp(path.join(CONTENT, section), path.join(exampleContent, section), { recursive: true })
  }
  await fs.copyFile(path.join(CONTENT, '_index.md'), path.join(exampleContent, '_index.md'))
  await fs.mkdir(path.join(examples, 'data'), { recursive: true })
  await fs.copyFile(path.join(ROOT, 'data/home.yaml'), path.join(examples, 'data/home.yaml'))
  await fs.writeFile(path.join(examples, 'hugo.toml'), [
    "baseURL = 'http://localhost:1313/'",
    "title = 'Signal CV — Research systems in public'",
    "theme = 'railway-cv'",
    "themesDir = '../../../'",
    "disableKinds = ['taxonomy', 'term']",
    '',
    '[markup.goldmark.renderer]',
    'unsafe = true',
    '',
  ].join('\n'))
  await fs.writeFile(path.join(examples, 'README.md'), [
    '# Signal CV research demo',
    '',
    'This fictional research portfolio shows how the Railway-CV theme can present projects, articles, notebooks, and a publication bundle. Its sample identity and content are illustrative.',
    '',
    'From this directory, run `hugo server --themesDir ../../../ --theme railway-cv` to preview it with Hugo installed.',
    '',
  ].join('\n'))
}

async function promotePosts() {
  const stagedRoot = path.join(CONTENT, 'articles_2')
  const files = (await walk(stagedRoot)).filter((file) => !file.endsWith(`${path.sep}_index.md`))
  let promoted = 0
  for (const sourceFile of files) {
    const relative = path.relative(stagedRoot, sourceFile)
    const parsed = parsePage(await fs.readFile(sourceFile, 'utf8'))
    if (parsed.data.source_type !== 'post' || parsed.data.source_status !== 'publish') continue

    const directory = relative.replace(/[\\/]index\.md$/i, '').replace(/\.md$/i, '')
    const target = path.join(CONTENT, 'posts', directory, 'index.md')
    const frontmatter = {}
    for (const key of [
      'title', 'description', 'summary', 'date', 'author', 'slug', 'categories', 'tags',
      'thumbnail', 'thumbnail_alt', 'thumbnail_width', 'thumbnail_height', 'thumbnail_aspect',
    ]) {
      if (parsed.data[key] !== undefined) frontmatter[key] = parsed.data[key]
    }
    frontmatter.type = 'post'
    frontmatter.status = 'publish'
    frontmatter.url = `/posts/${directory.replaceAll(path.sep, '/')}/`
    for (const key of ['thumbnail']) {
      if (frontmatter[key]) frontmatter[key] = canonicalize(frontmatter[key])
    }
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, writePage(frontmatter, canonicalize(parsed.body)))
    promoted += 1
  }
  if (promoted !== 71) throw new Error(`Expected 71 explicitly published posts; promoted ${promoted}.`)
  return promoted
}

async function promoteProfile() {
  const siteContent = YAML.parse(await fs.readFile(path.join(SOURCE, 'docs/content/site-content.yaml'), 'utf8'))
  const pages = siteContent.site.pages
  const about = canonicalize(pages.about.bodyMarkdown)
  const skills = canonicalize(pages.skills.bodyMarkdown)
  await fs.writeFile(path.join(CONTENT, 'about.md'), writePage({
    title: pages.about.title,
    description: 'A systems-minded builder working across software, infrastructure, security, operations, and business.',
    layout: 'profile',
  }, about))
  await fs.writeFile(path.join(CONTENT, 'skills.md'), writePage({
    title: pages.skills.title,
    description: 'Experience, selected projects, education, and technical skills.',
    layout: 'profile',
  }, skills))
}

async function promoteCaseStudies() {
  const sourceDirectory = path.join(SOURCE, 'docs/case-studies')
  const files = (await walk(sourceDirectory)).filter((file) => !file.endsWith(`${path.sep}index.md`))
  const relatedPosts = {
    'git-bbq': ['/posts/2026/09/git-bbq-and-long-running-tasks-for-codex/'],
    'codex-long-running-task-plugin': ['/posts/2026/09/git-bbq-and-long-running-tasks-for-codex/'],
    'geospatial-map-of-lobby-funders': ['/posts/2024/06/graphing-numbers-with-geospatial-boundaries-using-geopandas-and-matplotlib/'],
  }
  for (const sourceFile of files) {
    const parsed = parsePage(await fs.readFile(sourceFile, 'utf8'))
    const slug = path.basename(sourceFile, '.md')
    delete parsed.data.pageClass
    delete parsed.data.renderPageTitle
    parsed.data.related_posts = relatedPosts[slug] || []
    const target = path.join(CONTENT, 'case-studies', slug, 'index.md')
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, writePage(parsed.data, canonicalize(parsed.body)))
  }
  if (files.length !== 5) throw new Error(`Expected 5 case studies; found ${files.length}.`)
  return files.length
}

async function promoteRepositories() {
  const staged = JSON.parse(await fs.readFile(path.join(ROOT, 'data/vitepress_2/repositories.json'), 'utf8'))
  const allowed = [
    'name', 'full_name', 'description', 'html_url', 'homepage', 'language',
    'stargazers_count', 'forks_count', 'updated_at', 'pinned', 'pinned_order', 'preview',
  ]
  const repositories = staged.repositories.map((record) => Object.fromEntries(
    allowed.filter((key) => record[key] !== undefined).map((key) => [
      key,
      key === 'preview' ? canonicalize(record[key]) : record[key],
    ]),
  ))
  const result = {
    generated_at: staged.generated_at,
    source: 'Checked-in public GitHub repository snapshot; no visitor-side API requests',
    username: 'averyfreeman',
    pinned_repositories: staged.pinned_repositories,
    repositories,
  }
  await fs.mkdir(path.join(ROOT, 'data/portfolio'), { recursive: true })
  await fs.writeFile(path.join(ROOT, 'data/portfolio/repositories.json'), `${JSON.stringify(result, null, 2)}\n`)
  return repositories.length
}

async function promoteAssets() {
  const source = path.join(ROOT, 'static/vitepress_2')
  for (const directory of ['wp-content', 'post-thumbnails', 'repository-previews']) {
    const target = path.join(ROOT, 'static', directory)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.cp(path.join(source, directory), target, { recursive: true, force: true })
  }
}

async function removeStaging() {
  for (const relative of [
    'content/articles_2', 'content/projects_2', 'content/about_2', 'content/skills_2',
    'content/policy_2', 'content/vitepress-migration', 'content/articles', 'content/projects',
    'content/notebooks', 'content/publications', 'data/vitepress_2', 'static/vitepress_2',
  ]) await fs.rm(path.join(ROOT, relative), { recursive: true, force: true })
  await fs.rm(path.join(ROOT, 'docs/migrations/vitepress/staging-manifest.json'), { force: true })
}

async function main() {
  await copyDemoExamples()
  const posts = await promotePosts()
  const caseStudies = await promoteCaseStudies()
  const repositories = await promoteRepositories()
  await promoteProfile()
  await promoteAssets()
  await removeStaging()
  console.log(`Promoted ${posts} published posts, ${caseStudies} case studies, and ${repositories} public repositories.`)
}

main().catch((error) => {
  console.error(`Portfolio promotion failed: ${error.message}`)
  process.exitCode = 1
})
