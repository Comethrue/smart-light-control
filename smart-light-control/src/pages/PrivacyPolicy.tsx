import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Mail, Phone } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      number: '01',
      title: '信息收集',
      content: '本应用仅收集必要的设备连接信息，用于实现设备控制功能：',
      items: ['设备IP地址', '端口号', '连接状态'],
    },
    {
      number: '02',
      title: '信息使用',
      content: '收集的信息仅用于以下目的：',
      items: ['建立和维护与设备的连接', '提供设备控制服务', '改善用户体验'],
    },
    {
      number: '03',
      title: '信息存储',
      content: '所有设备连接数据仅存储在您的本地设备中，不会上传至任何服务器。数据存储遵循以下原则：',
      items: ['仅在本地缓存中存储', '用户可随时清除缓存', '应用卸载后自动清除'],
    },
    {
      number: '04',
      title: '信息保护',
      content: '我们采取合理的技术措施保护您的信息安全：',
      items: ['数据加密存储', '访问权限控制', '防止信息泄露、丢失或被滥用'],
    },
    {
      number: '05',
      title: '信息共享',
      content: '我们不会向任何第三方共享您的个人信息，包括：',
      items: ['不与广告商共享', '不与分析服务共享', '不与其他第三方服务共享'],
    },
    {
      number: '06',
      title: '用户权利',
      content: '您有权：',
      items: ['访问您的个人信息', '更正您的个人信息', '删除您的个人信息'],
      extra: '如需行使这些权利，请通过设置中的"清除缓存"功能实现。',
    },
    {
      number: '07',
      title: '政策更新',
      content: '我们可能会不时更新本隐私政策。更新后的政策将在应用内公布，并立即生效。建议您定期查看本隐私政策，了解我们如何保护您的信息。',
      items: [],
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
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">隐私政策</h1>
        <p className="text-gray-500 text-sm mt-1">Privacy Policy</p>
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

        {/* 联系方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary font-mono text-sm">08</span>
            <h2 className="text-white font-medium">联系我们</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">如您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm">927662037@qq.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">13326403939</span>
            </div>
          </div>
        </motion.div>
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
