import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  RefreshCw,
  Clock,
  Trash2,
  RotateCcw,
  Info,
  Shield,
  FileText,
  Mail,
  ChevronRight,
  Cpu,
  Wifi,
  Moon,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';
import { useSettingsStore } from '../stores/settingsStore';
import { useDeviceStore } from '../stores/deviceStore';
import { useUIStore } from '../stores/uiStore';
import { useTranslation } from '../i18n';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    language,
    darkMode,
    autoReconnect,
    refreshInterval,
    setLanguage,
    toggleDarkMode,
    setAutoReconnect,
    setRefreshInterval,
    resetSettings,
  } = useSettingsStore();
  const { deviceInfo, reset: resetDevice } = useDeviceStore();
  const { clearLogs, addLog } = useUIStore();

  // 确认对话框状态
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 清除缓存
  const handleClearCache = useCallback(() => {
    localStorage.removeItem('device-storage');
    clearLogs();
    addLog(t('msg_cache_cleared'), 'success');
    setShowClearConfirm(false);
  }, [clearLogs, addLog, t]);

  // 重置所有设置
  const handleResetAll = useCallback(() => {
    resetSettings();
    resetDevice();
    clearLogs();
    addLog(t('msg_settings_reset'), 'warning');
    setShowResetConfirm(false);
  }, [resetSettings, resetDevice, clearLogs, addLog, t]);

  // 刷新间隔选项
  const refreshIntervalOptions = [
    { value: 1000, label: t('interval_1s') },
    { value: 3000, label: t('interval_3s') },
    { value: 5000, label: t('interval_5s') },
    { value: 10000, label: t('interval_10s') },
  ];

  // 关于链接
  const aboutLinks = [
    { icon: <Shield className="w-5 h-5" />, label: t('settings_privacy'), path: '/privacy' },
    { icon: <FileText className="w-5 h-5" />, label: t('settings_terms'), path: '/terms' },
    { icon: <Mail className="w-5 h-5" />, label: t('settings_support'), path: '/support' },
    { icon: <Info className="w-5 h-5" />, label: t('settings_about_app'), path: '/about' },
  ];

  return (
    <div className="space-y-4">
      {/* 应用设置 */}
      <Card title={t('settings_app')} icon={<RefreshCw className="w-5 h-5" />} delay={0}>
        <div className="space-y-4">
          {/* 语言选择 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('settings_language')}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('settings_language_desc')}</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'zh_CN' | 'en_US')}
              className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-primary
                ${darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-gray-800 border-gray-200'}`}
            >
              <option value="zh_CN">简体中文</option>
              <option value="en_US">English</option>
            </select>
          </div>

          <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

          {/* 夜间模式 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <Moon className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('settings_night_mode')}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('settings_night_mode_desc')}</p>
              </div>
            </div>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </div>

          <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

          {/* 自动重连 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('settings_auto_reconnect')}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('settings_auto_reconnect_desc')}</p>
              </div>
            </div>
            <Switch checked={autoReconnect} onChange={setAutoReconnect} />
          </div>

          <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

          {/* 刷新间隔 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('settings_refresh_interval')}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('settings_refresh_interval_desc')}</p>
              </div>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-primary
                ${darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-gray-800 border-gray-200'}`}
            >
              {refreshIntervalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 设备信息 */}
      {deviceInfo && (
        <Card title={t('settings_device_info')} icon={<Cpu className="w-5 h-5" />} delay={1}>
          <div className="space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-gray-500 text-sm">{t('settings_device_id')}</span>
              <span className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>{deviceInfo.deviceId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 text-sm">{t('settings_device_name')}</span>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{deviceInfo.deviceName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 text-sm">{t('settings_firmware')}</span>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{deviceInfo.firmware}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 text-sm">{t('settings_ip_address')}</span>
              <span className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>{deviceInfo.ip}:{deviceInfo.port}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 text-sm">{t('settings_connection_status')}</span>
              <span className={`text-sm flex items-center gap-1 ${deviceInfo.connected ? 'text-success' : 'text-danger'}`}>
                <Wifi className="w-3 h-3" />
                {deviceInfo.connected ? t('connected') : t('disconnected')}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* 数据管理 */}
      <Card title={t('settings_data_management')} icon={<Trash2 className="w-5 h-5" />} delay={2}>
        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={() => setShowClearConfirm(true)}
            icon={<Trash2 className="w-4 h-4" />}
            fullWidth
          >
            {t('settings_clear_cache')}
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowResetConfirm(true)}
            icon={<RotateCcw className="w-4 h-4" />}
            fullWidth
          >
            {t('settings_reset_all')}
          </Button>
        </div>
      </Card>

      {/* 关于信息 */}
      <Card title={t('settings_about')} icon={<Info className="w-5 h-5" />} delay={3}>
        <div className="space-y-1">
          {/* 版本号 */}
          <div className="flex items-center justify-between py-3">
            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('settings_version')}</span>
            <span className="text-gray-500 text-sm">v1.0.0</span>
          </div>

          {/* 链接列表 */}
          {aboutLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center justify-between py-3 border-t
                ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'}
                -mx-4 px-4 transition-colors text-left`}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{link.icon}</span>
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{link.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          ))}
        </div>
      </Card>

      {/* 版权信息 */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">{t('app_name')}</p>
        <p className="text-xs text-gray-500 mt-1">{t('settings_platform')}</p>
        <p className="text-xs text-gray-500 mt-1">{t('settings_copyright')}</p>
      </div>

      {/* 清除缓存确认对话框 */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`rounded-2xl p-6 max-w-sm w-full ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('dialog_clear_cache_title')}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {t('dialog_clear_cache_desc')}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowClearConfirm(false)} fullWidth>
                {t('cancel')}
              </Button>
              <Button variant="danger" onClick={handleClearCache} fullWidth>
                {t('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 重置设置确认对话框 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`rounded-2xl p-6 max-w-sm w-full ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('dialog_reset_title')}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {t('dialog_reset_desc')}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowResetConfirm(false)} fullWidth>
                {t('cancel')}
              </Button>
              <Button variant="danger" onClick={handleResetAll} fullWidth>
                {t('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
