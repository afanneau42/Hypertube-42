import { languageConstants } from "../constantes";
import axios from "axios";
import config from "../config/config";
// import translate from 'google-translate-api';

export const setLanguage = language => ({
  type: languageConstants.LANGUAGE_SET,
  language
});

export const resetTranslation = () => ({
  type: "RESET_TRANSLATION"
})

export const getVersion = (lang, { synopsis, genre }) => {
  return dispatch => {
    axios
      .get(`${config.connectUrl}/api/translate`, {
        params: {
          lang: lang,
          str: synopsis
        }
      })
      .then(res => {
        // console.log("Get Version", res);
        dispatch({ type: "TRANSLATE_SYNOPSIS", payload: res.data })
      })
      .catch(error => { return; });
    const genres = !genre ? undefined : genre.map(e =>
      axios.get(`${config.connectUrl}/api/translate`, {
        params: {
          lang: lang,
          str: e
        }
      })
    );
    Promise.all(genres)
      .then(res =>
        dispatch({
          type: "TRANSLATE_GENRE",
          payload: res.map(genre => genre.data)
        })
      )
      .catch(error => console.log());
  };
};
///api/translate?lang='les 2 premieres lettres de la langue'&str='le texte a traduire'
