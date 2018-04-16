import { combineReducers } from 'redux';
import login from './login.reducer';
import register from './register.reducer';
import movies from './movies.reducer';
import users from './users.reducer';
import filters from './filters.reducers'
import language from './language.reducer';
import comments from './comments.reducer';

const rootReducer = combineReducers({
    login,
    register,
    users,
    movies,
    filters,
    language,
    comments
});

export default rootReducer;