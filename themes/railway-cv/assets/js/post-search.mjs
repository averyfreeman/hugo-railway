function plainText(html) {
  return String(html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function isPublishedPostUrl(url) {
  try {
    const segments = new URL(url, 'https://portfolio.invalid').pathname.split('/').filter(Boolean)
    return segments[0] === 'posts' && segments.length >= 4
  } catch {
    return false
  }
}

function initializePostSearch() {
  const input = document.querySelector('[data-post-search]')
  const resultsList = document.querySelector('[data-post-search-results]')
  const status = document.querySelector('[data-post-search-status]')
  const clearButton = document.querySelector('[data-post-search-clear]')
  if (!input || !resultsList || !status) return

  let pagefindPromise
  let requestNumber = 0
  let debounceTimer

  const clearResults = () => {
    resultsList.replaceChildren()
  }

  const runSearch = async (query) => {
    const currentRequest = ++requestNumber
    const normalized = query.trim()
    clearResults()
    if (normalized.length < 2) {
      status.textContent = 'Search the local archive by title or content.'
      return
    }

    status.textContent = 'Searching published pages…'
    try {
      pagefindPromise ??= import('/pagefind/pagefind.js')
      const pagefind = await pagefindPromise
      const response = await pagefind.search(normalized)
      const resultRecords = await Promise.all(response.results.map((result) => result.data()))
      const postRecords = resultRecords.filter((record) => isPublishedPostUrl(record.url))
      if (currentRequest !== requestNumber) return

      if (!postRecords.length) {
        status.textContent = 'No matching posts found.'
        return
      }

      status.textContent = `${postRecords.length} matching post${postRecords.length === 1 ? '' : 's'}; showing up to 8.`
      postRecords.slice(0, 8).forEach((record) => {
        const item = document.createElement('li')
        item.className = 'post-search-result'
        const link = document.createElement('a')
        link.href = record.url
        link.textContent = record.meta?.title || 'Published post'
        const excerpt = document.createElement('p')
        excerpt.textContent = plainText(record.excerpt)
        item.append(link, excerpt)
        resultsList.append(item)
      })
    } catch {
      if (currentRequest !== requestNumber) return
      status.textContent = 'Local search is unavailable. Browse the complete post archive below.'
    }
  }

  input.addEventListener('input', () => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => runSearch(input.value), 160)
  })
  clearButton?.addEventListener('click', () => {
    input.value = ''
    runSearch('')
    input.focus()
  })
}

if (typeof document !== 'undefined') initializePostSearch()
