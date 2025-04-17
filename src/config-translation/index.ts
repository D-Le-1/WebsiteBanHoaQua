import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEN from '../locales/en/translation.json'
import translationVI from '../locales/vi/translation.json'

// Khai báo resource
const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
}

// Cấu hình i18next
i18next
  .use(LanguageDetector)         // Thêm language detector trước
  .use(initReactI18next)         // Kết nối với react
  .init({
    resources,
    fallbackLng: 'en',           // Nếu không tìm được, fallback về 'en'
    debug: true,                 // Bật log ra console nếu cần debug

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false         // React đã xử lý việc escape
    }
  })

export default i18next
