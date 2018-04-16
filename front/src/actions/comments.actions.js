import config from '../config/config';
import axios from 'axios';
import { userActions } from '../actions';

export const commentActions = {
    getCommentsByMovie,
    postComment,
}

function getCommentsByMovie(movie_id) {
    return dispatch => {
        const url = `${config.apiUrl}/api/comments/byId?id=${movie_id}`
        axios
            .get(url)
            .then(res => {
                // console.log("COMMENTS REPONSE BY MOVIE", res);
                if (res.data.error) {
                    // console.log("AND THERE WE ARE ALALA", res);
                    dispatch({ type: 'THERE_IS_NO_COMMENTS' })
                }
                else
                    return res.data
            })
            .then(comments => {
                if (comments === undefined) {
                    return;
                }
                const allInfo = comments[0] !== undefined ? comments.map(comment => {
                    let info = axios.get(`${config.connectUrl}/api/users/${comment.author_id}`)
                        .then(res => {
                            const { username = 'Anonymous', picture = '/images/default_user.png' } = res.data;
                            const data = { ...comment, username, picture };
                            return data;
                        })
                        .catch();
                    return info;
                }) : null;
                allInfo ? Promise.all(allInfo)
                    .then(data => {
                        dispatch({ type: 'GET_ALL_COMMENTS_BY_MOVIE', comments: [...data.reverse()] });
                    }) : null

            })
            .catch()
    }
}

function postComment({ movie_id, author_id, comment, username = 'Anonymous', picture = '/images/default_user.png' }) {
    // console.log('post comment');
    return dispatch => {
        const { jwtToken: token } = localStorage
        const options = {
            method: 'POST',
            url: `${config.apiUrl}/api/comments?movie_id=${movie_id}&author_id=${author_id}&comment=${comment}`,
            headers: {
                'x-access-token': token
            }
        }
        axios(options)
            .then(res => {
                // console.log(res.data);
                if (res.data.error)
                    dispatch({ type: 'POST_COMMENT_FAILED', error: res.data.error });
                else {
                    const content = { ...res.data, username, picture };
                    // console.log('comment action concat', content);
                    dispatch({ type: 'POST_COMMENT_SUCCESS', content });
                }
            }).catch()
    }
}