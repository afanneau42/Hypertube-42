import axios from 'axios';
import config from '../config/config';
import { moviesConstants } from '../constantes';

//GET_MOVIES
export const moviesActions = {
    getMovies,
    getMovieById,
    getFilteredMovie,
    resetLastPage,
    emptyMoviesById,
    emptyMoviesList
}

function getMovies(filters) {

    console.log("MOVIE REGULAR");
    const {
        page,
        f_title,
        f_rating_min,
        f_rating_max,
        f_genre,
        f_year,
        f_suggest,
        sort_by,
        suggest_pos,
        sort_order
    } = filters;
    let url = `${config.apiUrl}/api/movies?page=${page}&f_suggest=${f_suggest}&f_title=${f_title}&sort_by=${sort_by}&sort_order=${sort_order}`;
    f_rating_min !== 0 && f_rating_max !== 10 ? url = `${url}&f_rating_min=${f_rating_min}&f_rating_max=${f_rating_max}` : url;
    f_genre !== '' ? url = `${url}&f_genre=${f_genre}` : url;
    const options = {
        url,
        method: 'GET',
        headers: { 'x-access-token': localStorage.jwtToken ? localStorage.jwtToken : undefined }
    }
    return dispatch => {
        dispatch({ type: moviesConstants.MOVIES_REQUEST });

        axios(options)
            .then(res => res.data)
            .then(moviesList => {
                dispatch({ type: moviesConstants.MOVIES_SUCCESS, moviesList });
            })
            .catch(error => {
                dispatch({ type: moviesConstants.MOVIES_FAILURE });
            })
    }
}

function getFilteredMovie(filters) {
    const {
        page,
        f_title,
        f_rating_min,
        f_rating_max,
        f_genre,
        f_year_min,
        f_year_max,
        f_suggest,
        sort_by,
        suggest_pos,
        sort_order,
    } = filters;
    console.table(filters)
    // const url = `${config.apiUrl}/api/movies?page=${page}`



    const url = f_suggest === '' ?
        `${config.apiUrl}/api/movies?page=${page}&f_suggest=${f_suggest}&sort_by=${sort_by}&sort_order=${sort_order}&f_title=${f_title}&f_rating_min=${f_rating_min}&f_rating_max=${f_rating_max}&f_year_min=${f_year_min}&f_year_max=${f_year_max}&f_genre=${f_genre}`
        : `${config.apiUrl}/api/movies?page=${page}&f_suggest=${f_suggest}&f_title=${f_title}&sort_by=${sort_by}&sort_order=${sort_order}`;
    console.log(url);
    const options = {
        url,
        method: 'GET',
        headers: { 'x-access-token': localStorage.jwtToken ? localStorage.jwtToken : undefined }
    }

    return dispatch => {
        dispatch({ type: moviesConstants.MOVIES_REQUEST });

        console.log("GET FILTERED");
        // console.log(url);

        axios(options)
            .then(res => {
                console.log("GET RESPONSE FILTERED", res);
                if (res.data.error)
                    disptach({ type: moviesConstants.MOVIES_FAILURE });
                else {
                    const moviesList = res.data
                    dispatch({
                        type: moviesConstants.MOVIE_FILTER_SUCCESS,
                        moviesList
                    })
                }
            })
            .catch(error => {
                dispatch({ type: moviesConstants.MOVIES_FAILURE });
            })

    }
}

function getMovieById(id) {
    return dispatch => {

        const reload = (id) => {
            dispatch({
                type: moviesConstants.MOVIES_REQUEST
            });
            axios.get(`${config.apiUrl}/api/movies/byId?id=${id}`)
                .then(res => {
                    console.log("MOVIE ITEEEEEEEEM", res)
                    if (res.data.error)
                        dispatch({ type: moviesConstants.MOVIES_FAILURE })
                    const movieItem = res.data
                    if (movieItem.casting.length !== 0) {
                        dispatch({ type: moviesConstants.MOVIE_ITEM_SUCCESS, movieItem });
                    } else {
                        reload(id)
                    }
                }).catch(e => {
                    console.log("MOVIE ITEM ERROR", e)
                    dispatch({ type: moviesConstants.MOVIES_FAILURE })
                })
        }

        reload(id)
    }
}

function emptyMoviesById() {
    return {
        type: 'EMPTY_MOVIE_ITEM'
    }
}

function emptyMoviesList() {
    return {
        type: 'EMPTY_MOVIE_LIST'
    }
}

function resetLastPage(lastPage) {
    return {
        type: 'RESET_LAST_PAGE'
    }
}