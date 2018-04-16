import { userConstants } from '../constantes';

const initialState = {
    error: false,
    login: false,
    success: false
}

//Reducer de la page Login
export default (state = initialState, action) => {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                ...state,
                login: true,
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                ...state,
                login: false,
                token: action.token,
                success: true
            }
        case userConstants.LOGIN_FAILURE:
            return {
                error: true,
                login: false,
                error: true,
            };
        case userConstants.LOGOUT:
            return {
                ...initialState
            };

        case 'RESET_GREETINGS':
            return {
                ...initialState
            }
        default:
            return state;
    }
}