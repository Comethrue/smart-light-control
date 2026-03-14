import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Lightbulb, Wifi, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { path: '/', label: '控制', icon: <Lightbulb className="w-5 h-5" /> },
  { path: '/connect', label: '连接', icon: <Wifi className="w-5 h-5" /> },
  { path: '/simulation', label: '场景', icon: <Sparkles className="w-5 h-5" /> },
  { path: '/settings', label: '设置', icon: <Settings className="w-5 h-5" /> },
];

export const TabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="bg-dark-bg/90 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-[1000px] mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className="relative flex flex-col items-center justify-center flex-1 h-full"
                >
                  <motion.div
                    className={`
                      flex flex-col items-center gap-1 p-2 rounded-xl
                      transition-all duration-300
                      ${isActive 
                        ? 'text-primary' 
                        : 'text-gray-500 hover:text-white'
                      }
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* 图标 */}
                    <motion.span
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      style={{
                        filter: isActive ? 'drop-shadow(0 0 8px rgba(212, 165, 116, 0.5))' : 'none',
                      }}
                    >
                      {tab.icon}
                    </motion.span>
                    
                    {/* 标签 */}
                    <span className="text-xs font-medium">{tab.label}</span>
                    
                    {/* 活动指示器 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-0 w-8 h-0.5 bg-primary rounded-full"
                        style={{
                          boxShadow: '0 0 10px rgba(212, 165, 116, 0.6)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
