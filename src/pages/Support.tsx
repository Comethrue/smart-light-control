import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Mail, Phone, Clock, Copy, Check, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = useCallback((text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  }, [feedback]);

  const faqs = [
    { question: '无法连接设备？', answer: '请检查设备是否通电，确保手机与设备在同一WiFi网络，检查IP地址和端口是否正确。' },
    { question: '设备响应缓慢？', answer: '可能是网络延迟导致，请检查网络连接质量，尝试重启设备和路由器。' },
    { question: '应用崩溃？', answer: '请尝试清除应用缓存，或刷新页面重新加载。' },
    { question: '亮度调节不生效？', answer: '请检查设备是否在手动模式，确保设备电源已开启。' },
  ];

  const techSupport = ['应用版本号', '设备型号和固件版本', '问题详细描述', '相关截图（如有）'];
  const commitments = ['24小时内响应邮件咨询', '工作时间内及时接听电话', '提供详细的技术指导', '持续优化产品体验'];

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
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">技术支持</h1>
        <p className="text-gray-500 text-sm mt-1">Contact Support</p>
      </motion.div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* 联系方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">01</span>
            <h2 className="text-white font-medium">联系信息</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">如遇到问题，请通过以下方式联系技术支持：</p>
          
          <div className="space-y-3">
            {/* 邮箱 */}
            <div className="flex items-center justify-between bg-dark-elevated rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-gray-500 text-xs">邮箱</p>
                  <p className="text-white text-sm">927662037@qq.com</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy('927662037@qq.com', 'email')}
                className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-400 text-sm
                  hover:text-white hover:border-primary/30 transition-colors flex items-center gap-1"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copiedEmail ? '已复制' : '复制'}
              </button>
            </div>

            {/* 电话 */}
            <div className="flex items-center justify-between bg-dark-elevated rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-gray-500 text-xs">电话</p>
                  <p className="text-white text-sm">13326403939</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy('13326403939', 'phone')}
                className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-400 text-sm
                  hover:text-white hover:border-primary/30 transition-colors flex items-center gap-1"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copiedPhone ? '已复制' : '复制'}
              </button>
            </div>

            {/* 工作时间 */}
            <div className="flex items-center gap-3 bg-dark-elevated rounded-lg p-4">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-gray-500 text-xs">工作时间</p>
                <p className="text-white text-sm">周一至周五 9:00-18:00</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 常见问题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">02</span>
            <h2 className="text-white font-medium">常见问题</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">以下是用户常见问题及解决方案：</p>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark-elevated rounded-lg p-4">
                <p className="text-white text-sm font-medium mb-2">{faq.question}</p>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 技术支持需要的信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">03</span>
            <h2 className="text-white font-medium">技术支持</h2>
          </div>
          <p className="text-gray-400 text-sm mb-3">如需技术支持，请提供以下信息：</p>
          <ul className="space-y-2">
            {techSupport.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 服务承诺 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">04</span>
            <h2 className="text-white font-medium">服务承诺</h2>
          </div>
          <p className="text-gray-400 text-sm mb-3">我们承诺：</p>
          <ul className="space-y-2">
            {commitments.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 反馈建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-card border border-dark-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-mono text-sm">05</span>
            <h2 className="text-white font-medium">反馈建议</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">如有任何建议或反馈，欢迎告诉我们：</p>
          
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="请输入您的建议或反馈..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-dark-elevated border border-dark-border
              text-white text-sm placeholder-gray-500 resize-none
              focus:outline-none focus:border-primary transition-colors"
          />
          
          <Button
            variant="gold"
            onClick={handleSubmitFeedback}
            disabled={!feedback.trim() || submitted}
            icon={submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            fullWidth
            className="mt-3"
          >
            {submitted ? '已提交' : '提交反馈'}
          </Button>
        </motion.div>
      </div>

      {/* 底部 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8 pt-6 border-t border-dark-border"
      >
        <p className="text-gray-500 text-sm">© 2026 Smart Classroom</p>
        <p className="text-gray-600 text-xs mt-1">We're here to help!</p>
      </motion.div>
    </div>
  );
};
