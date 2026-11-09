#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(new URL(import.meta.url).pathname, '..', '..')
const PUBLIC = path.join(ROOT, 'public')

async function walk(directory) {
  let entries
  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  } catch {
    return []
  }
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else files.push(fullPath)
  }
  return files
}

const files = await walk(PUBLIC)
const htmlFiles = files.filter((file) => file.endsWith('.html'))
const posts = htmlFiles.filter((file) => file.startsWith(path.join(PUBLIC, 'posts') + path.sep)
  && path.basename(path.dirname(file)) !== 'posts')
const casePages = htmlFiles.filter((file) => file.startsWith(path.join(PUBLIC, 'case-studies') + path.sep)
  && path.basename(path.dirname(file)) !== 'case-studies')

assert.equal(posts.length, 71, `Expected 71 canonical post pages, got ${posts.length}`)
assert.equal(casePages.length, 5, `Expected 5 case-study pages, got ${casePages.length}`)
assert.ok(await fs.stat(path.join(PUBLIC, 'posts/index.xml')), 'Blog RSS output is missing')
assert.ok(await fs.stat(path.join(PUBLIC, 'pagefind/pagefind.js')), 'Pagefind local index is missing')

const allHtml = (await Promise.all(htmlFiles.map((file) => fs.readFile(file, 'utf8')))).join('\n')
assert.doesNotMatch(allHtml, /\/(?:articles_2|projects_2|about_2|skills_2|policy_2|vitepress_2)(?:\/|["?#]|$)/, 'Temporary migration routes leaked into public HTML')
assert.doesNotMatch(allHtml, /hello@example\.com|Mara Voss|Scholar/, 'Fictional demo identity leaked into the public build')
assert.match(allHtml, /This section is reserved for future public policy work\./, 'Policy stub is missing')
assert.doesNotMatch(allHtml, /Exploratory public policy notes|Health(?:care)? can work and still make profit|stadium public equity/i, 'Excluded policy notes leaked into the public build')

const home = await fs.readFile(path.join(PUBLIC, 'index.html'), 'utf8')
assert.match(home, /I build practical tools/, 'Homepage role/value statement is missing')
assert.match(home, /View the portfolio/, 'Homepage portfolio action is missing')
assert.match(home, /linkedin\.com\/in\/averyfreeman/, 'Homepage LinkedIn action is missing')
assert.match(home, /selected case studies/i, 'Homepage case studies are missing')
assert.equal([...home.matchAll(/class=(?:"note-row"|'note-row'|note-row(?=[\s>]))/g)].length, 4, 'Homepage should show four recent posts')
assert.equal([...home.matchAll(/class=["']recent-repository signal-surface["']/g)].length, 4, 'Homepage should show four recent repositories')

const portfolio = await fs.readFile(path.join(PUBLIC, 'portfolio/index.html'), 'utf8')
const repositoryNames = [...portfolio.matchAll(/data-repository-card[^>]*data-name=(?:"([^"]+)"|([^\s>]+))/g)]
  .map((match) => match[1] ?? match[2])
assert.equal(repositoryNames.length, 60, `Expected 60 repository cards, got ${repositoryNames.length}`)
assert.ok(portfolio.includes('name=q') && portfolio.includes('name=language') && portfolio.includes('name=focus'), 'Labeled repository filter controls are missing')
assert.match(portfolio, /repository-preview-fallback/, 'Missing-preview fallback is absent from the rendered collection')

const projection = JSON.parse(await fs.readFile(path.join(ROOT, 'data/portfolio/repositories.json'), 'utf8'))
const expectedPinned = projection.repositories.filter((repo) => repo.pinned)
  .sort((a, b) => a.pinned_order - b.pinned_order).map((repo) => repo.name)
assert.deepEqual(repositoryNames.slice(0, expectedPinned.length), expectedPinned, 'Pinned repositories are not first in configured order')
assert.ok(await fs.stat(path.join(PUBLIC, 'case-studies/index.html')), 'Case-study index is missing')
assert.ok(await fs.stat(path.join(PUBLIC, 'posts/index.html')), 'Canonical Blog archive is missing')
const blog = await fs.readFile(path.join(PUBLIC, 'posts/index.html'), 'utf8')
assert.match(blog, /71 posts · newest first/, 'The no-JavaScript Blog archive does not expose all published posts')
assert.equal([...blog.matchAll(/class=(?:"post-row"|'post-row'|post-row(?=[\s>]))/g)].length, 71, 'The Blog archive should render every published post in HTML')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const caseSourceFiles = (await walk(path.join(ROOT, 'content/case-studies')))
  .filter((file) => file.endsWith('.md') && path.basename(file) !== '_index.md')
for (const sourceFile of caseSourceFiles) {
  const source = await fs.readFile(sourceFile, 'utf8')
  const repositoryName = source.match(/^repository:\s*(.+)$/m)?.[1]?.trim()
  const focus = source.match(/^focus:\s*(.+)$/m)?.[1]?.trim()
  assert.ok(repositoryName && focus, `Case study needs repository and focus metadata: ${sourceFile}`)
  const repository = projection.repositories.find((repo) => repo.name.toLocaleLowerCase() === repositoryName.toLocaleLowerCase())
  assert.ok(repository, `Case study repository is missing from the public projection: ${repositoryName}`)
  const cardPattern = new RegExp(`<article\\b[^>]*data-name=(?:["'])?${escapeRegExp(repository.name)}(?=["'\\s>])[^>]*>[\\s\\S]*?<\\/article>`)
  const card = portfolio.match(cardPattern)?.[0]
  assert.ok(card, `Repository card is missing for case study ${repositoryName}`)
  const caseSlug = path.basename(path.dirname(sourceFile))
  assert.ok(card.includes(`data-focus="${focus}"`), `Repository card is missing case-study focus ${focus}`)
  const caseHref = `/case-studies/${caseSlug}/`
  assert.match(card, new RegExp(`href=(?:["'])?${escapeRegExp(caseHref)}(?=["'\\s>])`), `Repository card does not link to case study ${caseSlug}`)
  const casePage = await fs.readFile(path.join(PUBLIC, 'case-studies', caseSlug, 'index.html'), 'utf8')
  assert.ok(casePage.includes(repository.html_url), `Case study ${caseSlug} is missing its repository evidence link`)
}
assert.equal(caseSourceFiles.length, 5, `Expected five case-study repository matches, got ${caseSourceFiles.length}`)

const policyHtml = htmlFiles.filter((file) => file.startsWith(path.join(PUBLIC, 'policy') + path.sep))
assert.equal(policyHtml.length, 1, `Expected only the policy stub, found ${policyHtml.length} policy pages`)

for (const htmlFile of htmlFiles) {
  const html = await fs.readFile(htmlFile, 'utf8')
  const localMedia = [...html.matchAll(/(?:src|href)=(?:"([^"]+)"|([^\s>]+))/g)]
    .map((match) => match[1] ?? match[2])
    .filter((url) => url.startsWith('/wp-content/uploads/') || url.startsWith('/repository-previews/') || url.startsWith('/post-thumbnails/'))
  for (const url of localMedia) {
    assert.ok(await fs.stat(path.join(PUBLIC, url.slice(1))), `Missing local media ${url} referenced by ${htmlFile}`)
  }
}

const browserScripts = (await Promise.all(files.filter((file) => /\.(?:mjs?|js)$/i.test(file)).map((file) => fs.readFile(file, 'utf8')))).join('\n')
assert.doesNotMatch(browserScripts, /api\.github\.com|XMLHttpRequest|fetch\s*\([^)]*github\.com/i, 'A visitor-side GitHub API request was found')

console.log(`Verified ${posts.length} posts, ${casePages.length} case studies, 60 repositories, pinned order, case-study matching, homepage highlights, media, RSS, Pagefind, and the public-content boundary.`)
