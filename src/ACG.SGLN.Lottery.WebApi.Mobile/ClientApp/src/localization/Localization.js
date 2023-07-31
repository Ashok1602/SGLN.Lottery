/* eslint-disable prettier/prettier */
import I18n from 'i18n-js';
import {I18nManager} from 'react-native';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}
I18nManager.allowRTL(I18n.locale in I18n.translations);
//Default language
I18n.locale = 'fr-FR';
// I18n.locale = 'en-EN';
// I18n.locale = 'ar-ma';
I18n.fallbacks = true;

//list of languages that will be supported by app
I18n.translations = {
  fr, //french
  en, //english
  ar, //arabic
};
I18nManager.isRTL ? I18nManager.forceRTL(true) : I18nManager.forceRTL(false);
I18n.start = I18nManager.isRTL ? 'right' : 'left';
I18n.end = I18nManager.isRTL ? 'left' : 'right';

export default I18n;
