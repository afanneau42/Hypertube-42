import { userConstants } from '../constantes';

const userInitialState = {
  session: {},
  items: {},
  error: false,
}

export default (state = userInitialState, action) => {
  switch (action.type) {
    case "INFO_FROM_TOKEN":
      return {
        ...state,
        session: { ...action.session }
      }

    case "TOKEN_EMPTY":
      return {
        ...state,
        errorToken: true
      }
    case "INFO_FROM_ID":
      return {
        ...state,
        items: { ...action.item }
      }

    case "REQUEST_FAILURE": {
      return {
        ...state,
        error: true
      }
    }

    case userConstants.LOGOUT: {
      return {
        ...userInitialState
      }
    }
    case userConstants.UPDATE_SUCCESS:
      return {
        ...state, session: { ...action.session }
      }

    case userConstants.DELETE_REQUEST://Ici on fait la requete pour supprimer un user.
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id ?
            { ...user, deleting: true }
            : user) // On renvoit une copie modifié ou l'objet user est complété par un objet deleting true
      };

    case userConstants.DELETE_SUCCESS: // Cas de succès pour le requete de suppression de user
      return {
        items: state.items.filter(user =>
          user.id !== action.id) //on renvoit simplement une copie de l'objet sans le user.
      };

    case userConstants.DELETE_FAILURE://Echec de la requete de suppression
      return {
        ...state, items: state.items.map(user => {
          if (user.id === action.id) {
            const { deleting, ...userCopy } = user;//on fait une copie du user sans la mention deleting stocke dans une const a part
            return { ...userCopy, deleteError: action.error }// et on renvoie la copie de l'objet user avec une nouvelle mention deleteError. 
          }
          return user;
        })
      };

    case "FORGOT_PASSWORD_SUCCESS":
      return {
        ...state,
        session: {
          success: action.success
        }
      }
    case "FORGOT_PASSWORD_ERROR":
      return {
        ...state,
        session: { error: action.error }
      }
    default:
      return state;
  }
}
