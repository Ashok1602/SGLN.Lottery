import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationFR from './locales/fr/translation.json';
import translationENG from './locales/eng/translation.json';

// the translations
const resources = {
   fr: {
    translation: translationFR
  },
   eng: {
    translation: translationENG
  }
};

const DEFAULT_LANGUAGE = `${process.env.REACT_APP_DEFAULT_LANGUAGE}`;

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE, // use en if detected lng is not available

    // keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;