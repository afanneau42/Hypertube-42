import { languageConstants, userConstants } from "../constantes"

const languageDefaultState = {
    lang: 'en',
    translated: false
}

export default (state = languageDefaultState, action) => {
    switch (action.type) {

        case "INFO_FROM_TOKEN":
            return action.session.language ? { ...state, lang: action.session.language } : state

        case languageConstants.LANGUAGE_SET:
            return { ...state, lang: action.language }

        case userConstants.UPDATE_SUCCESS:
            return { ...state, lang: action.session.language }

        case userConstants.LOGOUT:
            return { ...languageDefaultState }

        case "TRANSLATE_SYNOPSIS":
            return {
                ...state,
                translated: true
            }
        case "RESET_TRANSLATION":
            return {
                ...state,
                translated: false
            }
        default:
            return state
    }
}