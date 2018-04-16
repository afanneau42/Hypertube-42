
import moment from 'moment';

const filtersDefaultState = {
    page: 1,
    f_title: '',
    f_rating_min: 0,
    f_rating_max: 10,
    f_genre: '',
    f_year_min: '',
    f_year_max: '',
    f_suggest: 4,
    sort_by: 'suggest_pos',
    sort_order: 1
}

export default (state = filtersDefaultState, action) => {
    switch (action.type) {
        case 'NEXT_PAGE':
            const { page: nextPage } = action;
            return { ...state, page: nextPage + 1 };
        case 'SET_TITLE':
            return {
                ...state,
                f_title: action.f_title,
                page: 1,
                f_suggest: ''
            };
        case 'SET_SORT':
            return {
                ...state,
                sort_by: action.sortBy,
                sort_order: action.sortOrder,
                page: 1
            };
        case 'SET_RATINGS':
            return {
                ...state,
                f_rating_min: action.min,
                f_rating_max: action.max,
                f_suggest: ''
            }
        case 'SET_PERIOD': {
            return {
                ...state,
                f_year_min: action.min,
                f_year_max: action.max,
                f_suggest: ''
            }
        }
        case 'SET_GENRE': {
            return {
                ...state,
                f_genre: action.f_genre,
                f_suggest: ''
            }
        }
        case 'RESET_FILTERS':
            return {
                ...state,
                page: 1,
                f_title: '',
                f_rating_min: 0,
                f_rating_max: 10,
                f_genre: '',
                f_year_min: 1900,
                f_year_max: 2018,
                f_suggest: 4,
                sort_by: 'suggest_pos',
                sort_order: 1
            };
        default:
            return state;
    }
}