import config from '../config/config';
import axios from 'axios';
import { userConstants } from '../constantes'
import { history } from '../config/history';


export const userActions = {
    register,
    login,
    logout,
    getInfoFromToken,
    getInfoById,
    delete: _delete,
    updateUserInfos,
    resetGreetings,
    ForgottenPassword
};

function register(user) {
    const request = (user) => ({ type: userConstants.REGISTER_REQUEST, user });
    const success = (user) => ({ type: userConstants.REGISTER_SUCCESS, user });
    const failure = (error) => ({ type: userConstants.REGISTER_FAILURE, error });

    return dispatch => {
        dispatch(request());
        axios.post(`http://localhost:3000/api/auth/register`, user)
            .then(res => {
                // console.log(res.data);
                if (res.data.auth === true) {
                    dispatch(success());
                    history.push('/login');
                }
                else {
                    const error = res.data.err
                    // console.log(error);
                    dispatch(failure(error));
                    // console.log(res);
                    // localStorage.setItem('jwtToken', token)
                }
            })
            .catch()
    };
}

function login({ username, password }) {
    const request = () => ({ type: userConstants.LOGIN_REQUEST });
    const success = (token) => ({ type: userConstants.LOGIN_SUCCESS, token });
    const failure = () => ({ type: userConstants.LOGIN_FAILURE });
    return dispatch => {
        axios.post(`${config.connectUrl}/api/auth/login`, { username, password })
            .then(res => {
                const { token, auth } = res.data;
                // console.log(res);
                if (auth === false || token === undefined)
                    dispatch(failure());
                else {
                    dispatch(success(token));
                    localStorage.setItem('jwtToken', token);
                    history.push('/browse');
                }
            }).catch(error => {
                dispatch(failure());
            })

    }
};

function logout() {
    return { type: userConstants.LOGOUT };
}

function getInfoFromToken(token) {
    return dispatch => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/api/auth/me',
            headers: { 'x-access-token': token }
        }
        axios(options)
            .then(res => {
                // console.log('INFO TOKEN DEBUGG', res);
                if (res.data.error)
                    dispatch({ type: "TOKEN_EMPTY" });
                else {
                    const session = res.data
                    dispatch({
                        type: "INFO_FROM_TOKEN",
                        session
                    })
                }
            })
            .catch();
    }
}

function getInfoById(id) {
    return dispatch => {
        console.log("GETINFOBYID : ", id);
        axios(`${config.connectUrl}/api/users/${id}`)
            .then(res => {
                // console.log(res.data);
                dispatch({
                    type: "INFO_FROM_ID",
                    item: { ...res.data }
                })
            })
            .catch()
    }
}

function _delete(id) {
    const request = id => ({ type: userConstants.DELETE_REQUEST, id });
    const success = id => ({ type: userConstants.DELETE_SUCCESS, id });
    const failure = error => ({ type: userConstants.DELETE_FAILURE, error });
    return dispatch => {
        dispatch(request(id));
        axios
            .post(`${config.connectUrl}/`, id)
            .then(user => dispatch(success(id)))
            .catch(error => dispatch(failure(id, error)));
    }
}

function updateUserInfos(id, user) {
    // console.log("ACTION UPDATE", user)
    const request = () => ({ type: userConstants.UPDATE_REQUEST });
    const success = (session) => ({ type: userConstants.UPDATE_SUCCESS, session });
    const failure = error => ({ type: userConstants.UPDATE_FAILURE, error });
    const { jwtToken: token } = localStorage
    return dispatch => {
        const options = {
            url: `${config.connectUrl}/api/users/${id}`,
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            data: {
                ...user
            }
        }
        // console.log('options', options)
        dispatch(request);
        axios(options)
            .then(res => {
                // console.log("Salut c'est ACTION", res.data);
                dispatch(success(res.data))
            })
            .catch(err => dispatch(failure(err)));
    }
}

function ForgottenPassword(email) {
    // console.log(email);
    // const url = `${config.connectUrl}/api/auth/forgot`
    const options = {
        'email': email,

    }
    return dispatch => {
        axios.post(`${config.connectUrl}/api/auth/forgot`, options)
            .then(res => {
                // console.log(res);
                if (res.data !== "Password updated")
                    dispatch({ type: "FORGOT_PASSWORD_ERROR", error: res.data });
                else
                    dispatch({ type: "FORGOT_PASSWORD_SUCCESS", success: res.data })
            }).catch()
    }
}

function resetGreetings() {
    return {
        type: 'RESET_GREETINGS'
    }
}