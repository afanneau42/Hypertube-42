import { userConstants } from "../constantes";

const defaultState = {
  error: '',
  success: false,
  loading: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { loading: true };
    case userConstants.REGISTER_SUCCESS:
      return { loading: false, success: true };
    case userConstants.REGISTER_FAILURE:
      return {
        loading: false,
        error: action.error
      };
    case 'RESET_GREETINGS':
      return {
        ...defaultState
      }
    default:
      return state;
  }
};
