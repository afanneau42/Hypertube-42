import { commentActions } from "../actions/comments.actions";

const commentDefaultState = {
    content: [],
    posted: false,
    error: false,
}

export default (state = commentDefaultState, action) => {
    switch (action.type) {
        case 'THERE_IS_NO_COMMENTS':
            return {
                ...commentDefaultState
            }
        case 'GET_ALL_COMMENTS_BY_MOVIE':
            return {
                ...state,
                content: action.comments
            }
        case 'POST_COMMENT_FAILED':
            return {
                ...state,
                error: action.error
            }
        case 'POST_COMMENT_SUCCESS':
            return {
                ...state,
                posted: true,
                content: [...state.content, action.content]
            }
        default:
            return state;
    }
} 