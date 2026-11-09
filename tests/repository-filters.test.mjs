import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterRepositories,
  matchesRepository,
  readRepositoryFilters,
  withRepositoryFilters,
} from '../themes/railway-cv/assets/js/repository-filters.mjs'

const repositories = [
  {
    name: 'Git-BBQ',
    fullName: 'averyfreeman/Git-BBQ',
    description: 'Agent-ready repository scaffolding',
    language: 'Go',
    focuses: ['AI developer tooling'],
    tags: ['ADR', 'Git workflow'],
  },
  {
    name: 'geospatial-map-of-lobby-funders',
    fullName: 'averyfreeman/geospatial-map-of-lobby-funders',
    description: 'Civic data visualization with animated maps',
    language: 'Python',
    focuses: ['Civic data visualization'],
    tags: ['GeoPandas', 'Matplotlib'],
  },
]

test('search covers repository text, case-study focus, and tags', () => {
  assert.equal(matchesRepository(repositories[0], { q: 'agent-ready' }), true)
  assert.equal(matchesRepository(repositories[0], { q: 'ADR' }), true)
  assert.equal(matchesRepository(repositories[1], { q: 'civic data' }), true)
  assert.equal(matchesRepository(repositories[1], { q: 'missing topic' }), false)
})

test('language and focus filters combine and use case-insensitive matching', () => {
  assert.deepEqual(filterRepositories(repositories, {
    language: 'go',
    focus: 'AI developer tooling',
  }).map((repo) => repo.name), ['Git-BBQ'])
  assert.deepEqual(filterRepositories(repositories, {
    language: 'Go',
    focus: 'Civic data visualization',
  }), [])
})

test('shareable filters read q, language, and focus parameters', () => {
  assert.deepEqual(readRepositoryFilters('?q=agent&language=Go&focus=AI+developer+tooling'), {
    q: 'agent',
    language: 'Go',
    focus: 'AI developer tooling',
  })
})

test('filter updates replace only the portfolio keys and preserve other query state', () => {
  const next = withRepositoryFilters(new URLSearchParams('page=2&language=Python&focus=Old'), {
    q: 'map',
    language: '',
    focus: 'Civic data visualization',
  })
  assert.equal(next.get('page'), '2')
  assert.equal(next.get('q'), 'map')
  assert.equal(next.get('language'), null)
  assert.equal(next.get('focus'), 'Civic data visualization')
})

test('empty values clear every portfolio filter without dropping unrelated parameters', () => {
  const next = withRepositoryFilters(new URLSearchParams('q=old&language=Go&focus=AI&page=2'), {})
  assert.equal(next.toString(), 'page=2')
})
