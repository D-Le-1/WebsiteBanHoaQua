import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';

// Khai báo resource
const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

// Xóa i18nextLng khỏi localStorage khi load trang
localStorage.removeItem('i18nextLng');

// Cấu hình i18next
i18next
  .use(initReactI18next) // Kết nối với React
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định là 'vi'
    fallbackLng: 'vi', // Fallback về 'vi' nếu có lỗi
    debug: true, // Bật log để debug
    interpolation: {
      escapeValue: false // React đã xử lý escape
    }
  });

export default i18next;