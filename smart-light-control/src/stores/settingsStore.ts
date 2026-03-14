import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  // Actions
  toggleDarkMode: () => void;
  setLanguage: (lang: 'zh_CN' | 'en_US') => void;
  setAutoReconnect: (value: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  darkMode: true, // 默认开启夜间模式
  language: 'zh_CN',
  autoReconnect: true,
  refreshInterval: 3000,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          // 更新 document class
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        }),

      setLanguage: (lang) => set({ language: lang }),

      setAutoReconnect: (value) => set({ autoReconnect: value }),

      setRefreshInterval: (interval) => set({ refreshInterval: interval }),

      resetSettings: () => {
        document.documentElement.classList.remove('dark');
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        // 恢复深色模式状态
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
