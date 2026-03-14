import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './Header';
import { StarBackground } from '../StarBackground';
import { LightBackground } from '../LightBackground';
import { useSettingsStore } from '../../stores/settingsStore';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { darkMode } = useSettingsStore();

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-transparent text-gray-900'}`}>
      {/* 动态背景 - 根据模式切换 */}
      {darkMode ? <StarBackground /> : <LightBackground />}

      {/* 顶部导航 */}
      <Header />

      {/* 主内容区域 - 可滚动 */}
      <main className="relative pt-16 pb-8 min-h-screen overflow-y-auto z-10">
        <div className="max-w-[1000px] mx-auto px-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
