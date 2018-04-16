import { moviesConstants } from "../constantes";

const movieDefaultState = {
  moviesList: [],
  movieItem: {},
  loading: false,
  error: false,
  lastPage: 0
};

export default (state = movieDefaultState, action) => {

  switch (action.type) {
    case moviesConstants.MOVIES_REQUEST:
      return { ...state, loading: true };

    case moviesConstants.MOVIES_SUCCESS:
      if (action.moviesList[0]) {

        let newMovieList = state.moviesList.filter(e => (
          JSON.stringify(e) !== JSON.stringify(action.moviesList)
        ));
        // console.table(state.moviesList);
        // console.table(action.moviesList);
        // console.table(newMovieList);
        newMovieList.push(action.moviesList);
        return {
          ...state,
          moviesList: newMovieList,
          lastPage: 0,
          loading: false
        };
      } else {
        return { ...state, lastPage: 1, loading: false };
      }

    case moviesConstants.MOVIE_ITEM_SUCCESS:
      return {
        ...state,
        movieItem: action.movieItem,
        loading: false,
      };

    case "EMPTY_MOVIE_ITEM": {
      return { ...state, movieItem: {} };
    }

    case 'EMPTY_MOVIE_LIST': {
      return {
        ...state,
        moviesList: []
      }
    }

    case moviesConstants.MOVIE_FILTER_SUCCESS:
      let newMovieList = [];
      newMovieList.push(action.moviesList);
      return {
        ...state,
        moviesList: newMovieList,
        loading: false,
        error: false
      };

    case moviesConstants.MOVIES_FAILURE:
      return {
        ...state,
        moviesList: [],
        error: true,
        loading: false
      };

    case "RESET_LAST_PAGE":
      return { ...state, lastPage: 0 };

    case "TRANSLATE_SYNOPSIS":
      return {
        ...state,
        movieItem: {
          ...state.movieItem,
          synopsis: action.payload,
        }
      };

    case "TRANSLATE_GENRE":
      return {
        ...state,
        movieItem: { ...state.movieItem, genre: action.payload }
      };
    default:
      return state;
  }
};
