export const filtersActions = {
    setTitleFilter,
    setSortFilter,
    setGenreFilter,
    setPeriod,
    setRatingsFilter,
    nextPage,
    resetFilters
}

function resetFilters() {
    return {
        type: 'RESET_FILTERS'
    }
}

function setTitleFilter(f_title) {
    return {
        type: 'SET_TITLE',
        f_title
    }
}

function setPeriod({ min, max }) {
    return {
        type: 'SET_PERIOD',
        min,
        max
    }
}

function setSortFilter({ sortBy, sortOrder }) {
    return {
        type: 'SET_SORT',
        sortBy,
        sortOrder
    }
}

function setRatingsFilter({ min, max }) {
    return {
        type: 'SET_RATINGS',
        min,
        max
    }
}

function setGenreFilter(f_genre) {
    return {
        type: 'SET_GENRE',
        f_genre
    }
}

function nextPage(page = 1) {
    return {
        type: 'NEXT_PAGE',
        page
    }
}