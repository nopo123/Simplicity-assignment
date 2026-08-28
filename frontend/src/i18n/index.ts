import i18next, { use } from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "src/lang/en/translation.json";
import skTranslations from "src/lang/sk/translation.json";

export enum LANGUAGE {
  EN = "en",
  SK = "sk",
}

export const SUPPORTED_LANGUAGES: string[] = Object.values(LANGUAGE);

export const getBrowserLanguage = (languages: string[]): string => {
  const browserLanguage = navigator.language.split("-")[0];

  return languages.includes(browserLanguage) ? browserLanguage : LANGUAGE.EN;
};

use(initReactI18next).init({
  debug: false,
  resources: {
    en: { translation: enTranslations },
    sk: { translation: skTranslations },
  },
  lng: getBrowserLanguage(SUPPORTED_LANGUAGES),
  fallbackLng: LANGUAGE.EN,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
