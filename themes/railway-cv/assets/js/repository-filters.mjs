export const FILTER_KEYS = ['q', 'language', 'focus']

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase()

export function readRepositoryFilters(search) {
  const params = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(String(search ?? '').replace(/^\?/, ''))
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, params.get(key)?.trim() ?? '']))
}

export function withRepositoryFilters(searchParams, filters) {
  const params = new URLSearchParams(searchParams)
  FILTER_KEYS.forEach((key) => params.delete(key))
  FILTER_KEYS.forEach((key) => {
    const value = String(filters[key] ?? '').trim()
    if (value) params.set(key, value)
  })
  return params
}

export function matchesRepository(repository, filters = {}) {
  const query = normalize(filters.q)
  const language = normalize(filters.language)
  const focus = normalize(filters.focus)
  const searchText = normalize(repository.searchText ?? [
    repository.name,
    repository.fullName,
    repository.description,
    repository.language,
    repository.caseStudyTitle,
    repository.focus,
    ...(repository.tags ?? []),
  ].join(' '))
  const focuses = Array.isArray(repository.focuses)
    ? repository.focuses.map(normalize)
    : String(repository.focus ?? '').split('|').map(normalize).filter(Boolean)
  return (!query || searchText.includes(query))
    && (!language || normalize(repository.language) === language)
    && (!focus || focuses.includes(focus))
}

export function filterRepositories(repositories, filters = {}) {
  return repositories.filter((repository) => matchesRepository(repository, filters))
}

function initializeRepositoryFilters() {
  const panel = document.querySelector('[data-repository-filters]')
  const grid = document.querySelector('[data-repository-grid]')
  if (!panel || !grid) return

  const cards = [...grid.querySelectorAll('[data-repository-card]')]
  const queryInput = panel.querySelector('[data-filter-query]')
  const languageSelect = panel.querySelector('[data-filter-language]')
  const focusSelect = panel.querySelector('[data-filter-focus]')
  const status = document.querySelector('[data-filter-status]')
  const emptyState = document.querySelector('[data-filter-empty]')
  const clearButton = panel.querySelector('[data-filter-clear]')
  const languageValues = new Set([...languageSelect.options].map((option) => option.value))
  const focusValues = new Set([...focusSelect.options].map((option) => option.value))

  const readControls = () => ({
    q: queryInput.value.trim(),
    language: languageSelect.value,
    focus: focusSelect.value,
  })

  const applyFilters = ({ updateUrl = true } = {}) => {
    const filters = readControls()
    let visible = 0
    cards.forEach((card) => {
      const matches = matchesRepository({
        name: card.dataset.name,
        language: card.dataset.language,
        focuses: (card.dataset.focus ?? '').split('|').filter(Boolean),
        searchText: card.dataset.search,
      }, filters)
      card.hidden = !matches
      if (matches) visible += 1
    })
    if (status) status.textContent = visible === cards.length
      ? `Showing all ${cards.length} repositories.`
      : `Showing ${visible} of ${cards.length} repositories.`
    if (emptyState) emptyState.hidden = visible > 0

    if (updateUrl) {
      const params = withRepositoryFilters(new URLSearchParams(window.location.search), filters)
      const query = params.toString()
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
      window.history.replaceState(null, '', nextUrl)
    }
  }

  const setFromUrl = () => {
    const filters = readRepositoryFilters(window.location.search)
    queryInput.value = filters.q
    languageSelect.value = languageValues.has(filters.language) ? filters.language : ''
    focusSelect.value = focusValues.has(filters.focus) ? filters.focus : ''
    applyFilters({ updateUrl: false })
  }

  panel.addEventListener('input', applyFilters)
  panel.addEventListener('change', applyFilters)
  clearButton?.addEventListener('click', () => {
    queryInput.value = ''
    languageSelect.value = ''
    focusSelect.value = ''
    applyFilters()
    queryInput.focus()
  })
  window.addEventListener('popstate', setFromUrl)
  setFromUrl()
}

if (typeof document !== 'undefined') initializeRepositoryFilters()
