import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import config from "../../config";
import uz from '../../assets/lang/uz.json'
import ru from '../../assets/lang/ru.json'

const resources = {
    UZ: {translation: uz},
    RU: {translation: ru}
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: window.localStorage.getItem('lang') || config.DEFAULT_APP_LANG,
        fallbackLng: window.localStorage.getItem('lang') || config.DEFAULT_APP_LANG,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
