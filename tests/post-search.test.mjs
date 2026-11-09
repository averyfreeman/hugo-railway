import assert from 'node:assert/strict'
import test from 'node:test'
import { isPublishedPostUrl } from '../themes/railway-cv/assets/js/post-search.mjs'

test('local archive search accepts canonical post routes only', () => {
  assert.equal(isPublishedPostUrl('/posts/2025/04/portfolio-update/'), true)
  assert.equal(isPublishedPostUrl('https://averyfreeman.com/posts/2024/11/geospatial-analysis/'), true)
  assert.equal(isPublishedPostUrl('/posts/'), false)
  assert.equal(isPublishedPostUrl('/case-studies/geospatial-map-of-lobby-funders/'), false)
  assert.equal(isPublishedPostUrl('/skills/'), false)
  assert.equal(isPublishedPostUrl('not a url'), false)
})
