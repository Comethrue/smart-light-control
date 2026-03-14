import { useSettingsStore } from '../stores/settingsStore';
import { translations, type TranslationKey } from './translations';

export const useTranslation = () => {
  const { language } = useSettingsStore();
  
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.zh_CN[key] || key;
  };
  
  return { t, language };
};
