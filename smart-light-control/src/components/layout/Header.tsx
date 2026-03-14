import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Lightbulb, Wifi, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeviceStore } from '../../stores/deviceStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n';

interface TabItem {
  path: string;
  labelKey: string;
  icon: React.ReactNode;
}

const tabsConfig: TabItem[] = [
  { path: '/', labelKey: 'nav_control', icon: <Lightbulb className="w-4 h-4" /> },
  { path: '/connect', labelKey: 'nav_connect', icon: <Wifi className="w-4 h-4" /> },
  { path: '/simulation', labelKey: 'nav_simulation', icon: <Sparkles className="w-4 h-4" /> },
  { path: '/settings', labelKey: 'nav_settings', icon: <Settings className="w-4 h-4" /> },
];

const pageTitleKeys: Record<string, string> = {
  '/': 'page_light_control',
  '/connect': 'page_device_connect',
  '/settings': 'page_system_settings',
  '/simulation': 'page_scene_simulation',
  '/privacy': 'page_privacy_policy',
  '/terms': 'page_terms',
  '/support': 'page_tech_support',
  '/about': 'page_about',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { deviceInfo } = useDeviceStore();
  const { darkMode } = useSettingsStore();
  const { t } = useTranslation();
  
  const isConnected = deviceInfo?.connected ?? false;
  const isInfoPage = ['/privacy', '/terms', '/support', '/about'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
      {/* 毛玻璃背景层 */}
      <div className={`absolute inset-0 backdrop-blur-xl transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-black/95 via-black/80 to-transparent' 
          : 'bg-gradient-to-b from-white/95 via-white/80 to-transparent'
      }`} />
      
      {/* 动态光晕效果 */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px]"
        style={{
          background: darkMode 
            ? 'linear-gradient(90deg, transparent, rgba(212,165,116,0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-4">
        {/* 主导航区域 */}
        <div className="flex items-center justify-between h-14">
          {/* Logo + 品牌 */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors duration-500 ${
              darkMode 
                ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20'
                : 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20'
            }`}>
              <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-primary' : 'text-blue-500'}`} />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-base font-semibold tracking-wide transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>{t('header_smart_classroom')}</h1>
              <p className={`text-[10px] -mt-0.5 tracking-wider transition-colors duration-500 ${
                darkMode ? 'text-white/40' : 'text-gray-500'
              }`}>{t('header_subtitle')}</p>
            </div>
          </motion.div>

          {/* 中间导航标签 */}
          {!isInfoPage && (
            <nav className={`flex items-center gap-1 backdrop-blur-md rounded-full p-1.5 border transition-colors duration-500 ${
              darkMode 
                ? 'bg-white/5 border-white/10'
                : 'bg-gray-100/80 border-gray-200/50'
            }`}>
              {tabsConfig.map((tab, index) => {
                const isActive = location.pathname === tab.path;
                
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className="relative"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full
                        transition-all duration-300 relative
                        ${isActive 
                          ? darkMode ? 'text-primary' : 'text-blue-600'
                          : darkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      {/* 活动态背景 */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBg"
                          className={`absolute inset-0 rounded-full transition-colors duration-500 ${
                            darkMode 
                              ? 'bg-primary/15 border border-primary/30'
                              : 'bg-blue-500/15 border border-blue-500/30'
                          }`}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10 text-sm font-medium tracking-wide hidden sm:block">
                        {t(tab.labelKey as any)}
                      </span>
                      
                      {/* 活动态光点 */}
                      {isActive && (
                        <motion.span
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                            darkMode ? 'bg-primary' : 'bg-blue-500'
                          }`}
                          layoutId="activeNavDot"
                          style={{ boxShadow: darkMode 
                            ? '0 0 8px rgba(212,165,116,0.8)' 
                            : '0 0 8px rgba(59,130,246,0.8)' 
                          }}
                        />
                      )}
                    </motion.div>
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* 信息页面标题 */}
          {isInfoPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`font-medium transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {t(pageTitleKeys[location.pathname] as any)}
            </motion.div>
          )}

          {/* 右侧状态 */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-green-400 font-medium tracking-wide hidden sm:block">
                  {t('connected')}
                </span>
              </div>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-500 ${
                darkMode 
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  darkMode ? 'bg-white/40' : 'bg-gray-400'
                }`} />
                <span className={`text-xs tracking-wide hidden sm:block ${
                  darkMode ? 'text-white/50' : 'text-gray-500'
                }`}>
                  {t('disconnected')}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-dark-bg/0 pointer-events-none" />
    </header>
  );
};
