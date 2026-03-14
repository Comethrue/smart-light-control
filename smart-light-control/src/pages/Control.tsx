import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Power,
  RefreshCw,
  Sun,
  User,
  Zap,
  AlertCircle,
  Wifi,
  Activity,
} from 'lucide-react';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { useDeviceStore } from '../stores/deviceStore';
import { useUIStore } from '../stores/uiStore';
import { useSettingsStore } from '../stores/settingsStore';
import { networkManager } from '../services/networkManager';
import { getBrightnessColor } from '../utils/helpers';
import { useTranslation } from '../i18n';

export const Control: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { deviceInfo, deviceState, updateDeviceState } = useDeviceStore();
  const { addLog, loading, setLoading, error, setError } = useUIStore();
  const { refreshInterval, darkMode } = useSettingsStore();
  const [localBrightness, setLocalBrightness] = useState(deviceState.brightness);

  useEffect(() => {
    setLocalBrightness(deviceState.brightness);
  }, [deviceState.brightness]);

  useEffect(() => {
    networkManager.setCallbacks({
      onStatusUpdate: (status) => updateDeviceState(status),
      onError: (err) => {
        setError(err);
        addLog(err, 'error');
      },
    });

    if (deviceInfo?.connected) {
      networkManager.startPolling(refreshInterval);
    }

    return () => networkManager.stopPolling();
  }, [deviceInfo?.connected, refreshInterval, updateDeviceState, addLog, setError]);

  const handleRefresh = useCallback(async () => {
    if (!deviceInfo?.connected) return;
    setLoading(true);
    try {
      await networkManager.getStatus();
      addLog(t('msg_status_refreshed'), 'success');
    } catch {
      addLog(t('msg_refresh_failed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [deviceInfo?.connected, setLoading, addLog, t]);

  const handleModeChange = useCallback(async (isAuto: boolean) => {
    if (!deviceInfo?.connected) return;
    const mode = isAuto ? 'auto' : 'manual';
    try {
      await networkManager.setMode(mode);
      updateDeviceState({ mode });
      addLog(isAuto ? t('msg_mode_switched_auto') : t('msg_mode_switched_manual'), 'success');
    } catch {
      addLog(t('msg_mode_switch_failed'), 'error');
    }
  }, [deviceInfo?.connected, updateDeviceState, addLog, t]);

  const handlePowerChange = useCallback(async (power: boolean) => {
    if (!deviceInfo?.connected) return;
    try {
      await networkManager.setPower(power);
      updateDeviceState({ power });
      addLog(power ? t('msg_light_on') : t('msg_light_off'), power ? 'success' : 'info');
    } catch {
      addLog(t('msg_power_control_failed'), 'error');
    }
  }, [deviceInfo?.connected, updateDeviceState, addLog, t]);

  const handleBrightnessChange = useCallback((brightness: number) => {
    setLocalBrightness(brightness);
  }, []);

  const handleBrightnessCommit = useCallback(async (brightness: number) => {
    if (!deviceInfo?.connected) return;
    try {
      await networkManager.setBrightness(brightness);
      updateDeviceState({ brightness });
    } catch {
      addLog(t('msg_brightness_failed'), 'error');
    }
  }, [deviceInfo?.connected, updateDeviceState, addLog, t]);

  const handlePresetBrightness = useCallback(async (brightness: number) => {
    if (!deviceInfo?.connected) return;
    try {
      await networkManager.setBrightness(brightness);
      if (!deviceState.power && brightness > 0) {
        await networkManager.setPower(true);
        updateDeviceState({ power: true });
      }
      updateDeviceState({ brightness });
      setLocalBrightness(brightness);
    } catch {
      addLog(t('msg_set_failed'), 'error');
    }
  }, [deviceInfo?.connected, deviceState.power, updateDeviceState, addLog, t]);

  const isConnected = deviceInfo?.connected ?? false;
  const isAutoMode = deviceState.mode === 'auto';
  const displayBrightness = localBrightness;

  // 未连接提示
  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm px-6"
        >
          <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center transition-colors duration-500 ${
            darkMode ? 'bg-gradient-card border-gradient' : 'bg-white border border-gray-200 shadow-lg'
          }`}>
            <AlertCircle className={`w-12 h-12 ${darkMode ? 'text-white/30' : 'text-gray-400'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-4 tracking-wide transition-colors duration-500 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('control_not_connected')}</h2>
          <p className={`mb-10 transition-colors duration-500 ${
            darkMode ? 'text-white/50' : 'text-gray-500'
          }`}>{t('control_not_connected_desc')}</p>
          <Button
            variant="blue"
            onClick={() => navigate('/connect')}
            className="px-8 py-3"
          >
            {t('control_connect_device')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* 主控制区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-sm rounded-3xl p-6 hover-lift transition-colors duration-500 ${
          darkMode ? 'bg-gradient-card border-gradient' : 'bg-white border border-gray-200 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className={`text-sm transition-colors duration-500 ${
              darkMode ? 'text-white/50' : 'text-gray-500'
            }`}>{deviceInfo?.ip}:{deviceInfo?.port}</span>
          </div>
          <div className="feature-tag">
            <Wifi className="w-3 h-3" />
            {t('status_online')}
          </div>
        </div>

        {/* 灯泡可视化 */}
        <div className="flex flex-col items-center py-8">
          <motion.div
            className="relative"
            animate={{
              scale: deviceState.power ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 2, repeat: deviceState.power ? Infinity : 0 }}
          >
            {/* 亮色模式下的背景光晕 */}
            {!darkMode && deviceState.power && (
              <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-60"
                style={{
                  background: `radial-gradient(circle, ${getBrightnessColor(displayBrightness)} 0%, transparent 70%)`,
                  transform: 'scale(1.8)',
                }}
              />
            )}
            <Lightbulb
              className="w-32 h-32 transition-all duration-500 relative z-10"
              style={{
                color: deviceState.power 
                  ? darkMode 
                    ? getBrightnessColor(displayBrightness)
                    : `hsl(45, ${60 + displayBrightness * 0.4}%, ${40 + displayBrightness * 0.25}%)`  // 低亮度更暗淡，高亮度更鲜艳
                  : darkMode ? '#404040' : '#9ca3af',
                filter: deviceState.power
                  ? darkMode
                    ? `drop-shadow(0 0 ${20 + displayBrightness * 0.4}px ${getBrightnessColor(displayBrightness)})`
                    : `drop-shadow(0 0 ${30 + displayBrightness * 0.5}px hsl(45, 100%, 50%)) drop-shadow(0 0 ${15 + displayBrightness * 0.3}px hsl(35, 100%, 55%))`
                  : 'none',
              }}
            />
          </motion.div>

          {/* 亮度数值 */}
          <div className="mt-6 text-center">
            <span className={`stat-number ${darkMode ? '' : 'text-gray-800'}`}>
              {deviceState.power ? displayBrightness : 0}
            </span>
            <span className="text-2xl text-gray-500 ml-1">%</span>
          </div>
          <p className={`mt-2 transition-colors duration-500 ${
            darkMode ? 'text-white/40' : 'text-gray-500'
          }`}>
            {deviceState.power ? (isAutoMode ? t('control_auto_running') : t('control_manual_mode_text')) : t('control_light_off')}
          </p>
        </div>

        {/* 电源按钮 */}
        <motion.button
          onClick={() => handlePowerChange(!deviceState.power)}
          className={`
            w-full py-4 rounded-2xl font-medium text-lg transition-all duration-300
            flex items-center justify-center gap-3
            ${deviceState.power
              ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
              : darkMode 
                ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }
          `}
          whileTap={{ scale: 0.98 }}
        >
          <Power className="w-6 h-6" />
          {deviceState.power ? t('control_power_off') : t('control_power_on')}
        </motion.button>
      </motion.div>

      {/* 数据统计 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('stat_current_brightness'), value: `${displayBrightness}%`, icon: Sun },
          { label: t('stat_run_mode'), value: isAutoMode ? t('stat_auto') : t('stat_manual'), icon: Activity },
          { label: t('stat_presence'), value: deviceState.presence ? t('stat_present') : t('stat_absent'), icon: User },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`rounded-2xl p-4 text-center transition-colors duration-500 ${
              darkMode ? 'bg-gradient-card border-gradient' : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${darkMode ? 'text-primary' : 'text-blue-500'}`} />
            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 亮度控制 */}
      {!isAutoMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 transition-colors duration-500 ${
            darkMode ? 'bg-gradient-card border-gradient' : 'bg-white border border-gray-200 shadow-lg'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sun className={`w-5 h-5 ${darkMode ? 'text-primary' : 'text-blue-500'}`} />
            <span className={`font-medium tracking-wide ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('control_brightness_adjust')}
            </span>
          </div>

          <Slider
            value={displayBrightness}
            onChange={handleBrightnessChange}
            onChangeEnd={() => handleBrightnessCommit(localBrightness)}
            showValue
          />

          <div className="grid grid-cols-4 gap-3 mt-6">
            {[25, 50, 75, 100].map((preset) => (
              <motion.button
                key={preset}
                onClick={() => handlePresetBrightness(preset)}
                className={`
                  py-3 rounded-xl font-medium text-sm transition-all
                  ${displayBrightness === preset
                    ? 'bg-primary text-black font-semibold'
                    : darkMode 
                      ? 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                {preset}%
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 模式切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-6 transition-colors duration-500 ${
          darkMode ? 'bg-gradient-card border-gradient' : 'bg-white border border-gray-200 shadow-lg'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className={`w-5 h-5 ${darkMode ? 'text-primary' : 'text-blue-500'}`} />
          <span className={`font-medium tracking-wide ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('control_mode')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => handleModeChange(false)}
            className={`
              py-4 rounded-2xl font-medium transition-all flex flex-col items-center gap-2
              ${!isAutoMode
                ? 'bg-primary/20 text-primary border border-primary/30'
                : darkMode 
                  ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }
            `}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-6 h-6" />
            {t('control_manual_mode')}
          </motion.button>
          <motion.button
            onClick={() => handleModeChange(true)}
            className={`
              py-4 rounded-2xl font-medium transition-all flex flex-col items-center gap-2
              ${isAutoMode
                ? 'bg-primary/20 text-primary border border-primary/30'
                : darkMode 
                  ? 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }
            `}
            whileTap={{ scale: 0.98 }}
          >
            <User className="w-6 h-6" />
            {t('control_auto_mode')}
          </motion.button>
        </div>

        {isAutoMode && (
          <div className={`mt-4 p-4 rounded-xl border transition-colors duration-500 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                {t('control_presence_status')}
              </span>
              <span className={`text-sm font-medium ${deviceState.presence ? 'text-green-400' : darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                {deviceState.presence ? t('control_presence_detected') : t('control_presence_none')}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 快捷操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button
          variant="primary"
          onClick={handleRefresh}
          loading={loading}
          icon={<RefreshCw className="w-4 h-4" />}
          fullWidth
          className="py-4"
        >
          {t('control_refresh_status')}
        </Button>
        <Button
          variant="gold"
          onClick={() => handlePresetBrightness(100)}
          icon={<Sun className="w-4 h-4" />}
          fullWidth
          className="btn-glow py-4"
        >
          {t('control_max_brightness')}
        </Button>
      </motion.div>
    </div>
  );
};
