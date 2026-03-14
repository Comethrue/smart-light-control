import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Info, Lightbulb, RefreshCw, Smartphone, Search, 
  Settings, BarChart3, Cpu, Wifi, Code, Palette, Zap, Check
} from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <RefreshCw className="w-5 h-5" />, text: '自动/手动模式切换' },
    { icon: <Lightbulb className="w-5 h-5" />, text: '亮度手动调节' },
    { icon: <Smartphone className="w-5 h-5" />, text: '远程设备控制' },
    { icon: <Search className="w-5 h-5" />, text: '设备自动发现' },
    { icon: <Settings className="w-5 h-5" />, text: '设备手动连接' },
    { icon: <BarChart3 className="w-5 h-5" />, text: '设备状态监控' },
  ];

  const techSpecs = [
    { label: '硬件核心', value: 'ESP8266 WiFi模组' },
    { label: '通信协议', value: 'HTTP REST API + WebSocket' },
    { label: '开发框架', value: 'React + TypeScript' },
    { label: 'UI设计', value: '现代科技感界面' },
    { label: '响应速度', value: '实时设备状态更新' },
  ];

  const requirements = [
    '现代浏览器（Chrome、Firefox、Safari等）',
    '网络连接正常',
    '与设备在同一WiFi网络',
    '设备已通电并正常运行',
  ];

  const changelog = [
    {
      version: 'v1.0.0',
      date: '2026-02-21',
      title: '初始版本',
      changes: [
        '支持自动/手动模式切换',
        '支持亮度手动调节',
        '支持设备自动发现',
        '支持设备手动连接',
        '现代科技感UI设计',
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </motion.button>

      {/* 应用信息头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 
          flex items-center justify-center border border-primary/30 shadow-glow-gold">
          <Lightbulb className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">智能教室</h1>
        <p className="text-gray-500 text-sm mt-1">Smart Classroom</p>
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-primary text-sm font-medium">版本 1.0.0</span>
        </div>
        <p className="text-gray-400 text-sm mt-3">智能灯光控制系统</p>
      </motion.div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* 应用介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">01</span>
            <h2 className="text-white font-medium">应用介绍</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            智能教室是一款专为控制光感自动调节亮度灯照系统设计的Web应用。
          </p>
          <p className="text-gray-400 text-sm mb-4">主要功能：</p>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-dark-elevated rounded-lg p-3">
                <span className="text-primary">{feature.icon}</span>
                <span className="text-gray-300 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 技术特点 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">02</span>
            <h2 className="text-white font-medium">技术特点</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">本应用采用先进技术，确保稳定可靠的控制体验：</p>
          <div className="space-y-3">
            {techSpecs.map((spec, index) => (
              <div key={index} className="flex items-center justify-between bg-dark-elevated rounded-lg p-3">
                <span className="text-gray-500 text-sm">{spec.label}</span>
                <span className="text-white text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 系统要求 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">03</span>
            <h2 className="text-white font-medium">系统要求</h2>
          </div>
          <p className="text-gray-400 text-sm mb-3">使用本应用需要满足以下条件：</p>
          <ul className="space-y-2">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 更新日志 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">04</span>
            <h2 className="text-white font-medium">更新日志</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">版本更新记录：</p>
          
          {changelog.map((log, index) => (
            <div key={index} className="bg-dark-elevated rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-mono text-sm">{log.version}</span>
                <span className="text-gray-500 text-xs">{log.date}</span>
              </div>
              <p className="text-white text-sm font-medium mb-2">{log.title}</p>
              <ul className="space-y-1">
                {log.changes.map((change, i) => (
                  <li key={i} className="text-gray-400 text-sm">- {change}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 底部 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 pt-6 border-t border-dark-border"
      >
        <p className="text-gray-500 text-sm">© 2026 Smart Classroom</p>
        <p className="text-gray-600 text-xs mt-1">智能灯光控制系统</p>
      </motion.div>
    </div>
  );
};
