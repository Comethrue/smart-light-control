import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale } from 'lucide-react';

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      number: '01',
      title: '服务提供',
      content: '本应用按"现状"提供，不提供任何明示或暗示的保证：',
      items: ['不保证服务的不间断性', '不保证服务的安全性', '不保证服务的准确性', '不保证服务的适用性'],
    },
    {
      number: '02',
      title: '责任限制',
      content: '对于因使用本应用而导致的任何损失，我们不承担责任：',
      items: ['直接损失（如设备损坏）', '间接损失（如利润损失）', '数据丢失或损坏', '业务中断或停止'],
    },
    {
      number: '03',
      title: '网络安全',
      content: '设备的稳定性和安全性取决于网络环境和使用方式：',
      items: ['请确保在安全的网络环境下使用', '定期更新设备固件', '使用强密码保护网络', '对于因网络安全问题导致的损失，我们不承担责任'],
    },
    {
      number: '04',
      title: '服务变更',
      content: '我们保留以下权利，恕不另行通知：',
      items: ['修改服务内容', '暂停服务', '终止服务', '调整服务条款'],
    },
    {
      number: '05',
      title: '使用限制',
      content: '本应用的使用受到以下限制：',
      items: ['仅供个人学习和研究使用', '不得用于任何商业目的', '不得用于任何非法用途', '不得侵犯他人知识产权'],
    },
    {
      number: '06',
      title: '知识产权',
      content: '本应用及其所控制的智能灯光控制系统均受相关知识产权法律法规保护：',
      items: ['硬件设备设计', '固件软件程序', '通信协议', '用户界面设计'],
      extra: '未经授权，不得复制、修改、分发或用于商业用途。',
    },
    {
      number: '07',
      title: '第三方链接',
      content: '本应用可能包含第三方链接：',
      items: ['我们对这些链接的内容不承担责任', '第三方网站有其自己的隐私政策', '访问第三方链接风险自担'],
    },
    {
      number: '08',
      title: '法律适用',
      content: '本免责声明受中华人民共和国法律管辖：',
      items: ['如发生争议，应通过友好协商解决', '协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼', '本免责声明的最终解释权归开发者所有'],
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

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 
          flex items-center justify-center border border-primary/20">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">使用条款</h1>
        <p className="text-gray-500 text-sm mt-1">Terms of Service</p>
      </motion.div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-primary font-mono text-sm">{section.number}</span>
              <h2 className="text-white font-medium">{section.title}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{section.content}</p>
            {section.items.length > 0 && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.extra && (
              <p className="text-gray-400 text-sm mt-3">{section.extra}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 底部 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 pt-6 border-t border-dark-border"
      >
        <p className="text-gray-500 text-sm">© 2026 Smart Classroom</p>
        <p className="text-gray-600 text-xs mt-1">Last updated: 2026-02-21</p>
      </motion.div>
    </div>
  );
};
