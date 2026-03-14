import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Wifi,
  WifiOff,
  Signal,
  Link2,
  Unlink,
  Plus,
  Trash2,
  Router,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useDeviceStore } from '../stores/deviceStore';
import { useUIStore } from '../stores/uiStore';
import { useSettingsStore } from '../stores/settingsStore';
import { networkManager } from '../services/networkManager';
import { isValidIP, isValidPort } from '../utils/helpers';
import { useTranslation } from '../i18n';
import type { DiscoveredDevice } from '../types';

export const Connect: React.FC = () => {
  const {
    deviceInfo,
    savedDevices,
    setDeviceInfo,
    addSavedDevice,
    removeSavedDevice,
    disconnect,
  } = useDeviceStore();
  const { addLog } = useUIStore();
  const { darkMode } = useSettingsStore();
  const { t } = useTranslation();

  // 手动连接表单
  const [manualIP, setManualIP] = useState('192.168.4.1');
  const [manualPort, setManualPort] = useState('80');
  const [connecting, setConnecting] = useState(false);
  const [ipError, setIpError] = useState('');
  const [portError, setPortError] = useState('');

  // 连接设备
  const handleConnect = useCallback(async (ip: string, port: number, deviceName?: string) => {
    setConnecting(true);
    addLog(`${t('msg_connecting')} ${ip}:${port}...`, 'info');

    try {
      // 初始化网络管理器
      networkManager.initialize(ip, port);
      
      // 测试连接
      const connected = await networkManager.testConnection();
      
      if (connected) {
        // 获取设备信息
        const info = await networkManager.getInfo();
        info.connected = true;
        if (deviceName) info.deviceName = deviceName;
        
        setDeviceInfo(info);
        addSavedDevice(info);
        addLog(t('msg_connect_success'), 'success');
        
        // 获取初始状态
        try {
          await networkManager.getStatus();
        } catch {
          // 忽略初始状态获取失败
        }
      } else {
        addLog(t('msg_connect_failed'), 'error');
      }
    } catch (error) {
      addLog(`${t('msg_connect_failed')}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setConnecting(false);
    }
  }, [setDeviceInfo, addSavedDevice, addLog, t]);

  // 手动连接
  const handleManualConnect = useCallback(async () => {
    // 验证输入
    setIpError('');
    setPortError('');

    if (!isValidIP(manualIP)) {
      setIpError(t('connect_ip_invalid'));
      return;
    }

    const portNum = parseInt(manualPort, 10);
    if (!isValidPort(portNum)) {
      setPortError(t('connect_port_range'));
      return;
    }

    await handleConnect(manualIP, portNum);
  }, [manualIP, manualPort, handleConnect, t]);

  // 断开连接
  const handleDisconnect = useCallback(() => {
    networkManager.disconnect();
    disconnect();
    addLog(t('msg_disconnected'), 'info');
  }, [disconnect, addLog, t]);

  // 删除保存的设备
  const handleRemoveSaved = useCallback((deviceId: string) => {
    removeSavedDevice(deviceId);
    addLog(t('msg_device_saved_removed'), 'info');
  }, [removeSavedDevice, addLog, t]);

  // 信号强度图标
  const getSignalIcon = (signal: number) => {
    if (signal > -50) return <Signal className="w-4 h-4 text-success" />;
    if (signal > -70) return <Signal className="w-4 h-4 text-warning" />;
    return <Signal className="w-4 h-4 text-danger" />;
  };

  const isConnected = deviceInfo?.connected ?? false;

  return (
    <div className="space-y-4">
      {/* 当前连接状态 */}
      {isConnected && deviceInfo && (
        <Card delay={0}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('connect_current_connection')}
              </p>
              <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                {t('connect_device_working')}
              </p>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl space-y-3 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-success" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{deviceInfo.deviceName}</p>
                  <p className={`text-xs font-mono ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                    {deviceInfo.ip}:{deviceInfo.port}
                  </p>
                </div>
              </div>
              <Badge variant="success" dot pulse size="sm">{t('connected')}</Badge>
            </div>
            
            <div className={`flex items-center gap-4 text-xs pt-2 border-t ${darkMode ? 'text-white/40 border-white/10' : 'text-gray-500 border-gray-200'}`}>
              <span>ID: {deviceInfo.deviceId}</span>
              <span>{t('settings_firmware')}: {deviceInfo.firmware}</span>
              {deviceInfo.signal && (
                <span className="flex items-center gap-1">
                  {getSignalIcon(deviceInfo.signal)}
                  {deviceInfo.signal} dBm
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="danger"
            onClick={handleDisconnect}
            icon={<Unlink className="w-4 h-4" />}
            fullWidth
            className="mt-4"
          >
            {t('disconnect')}
          </Button>
        </Card>
      )}

      {/* 手动连接 */}
      <Card title={t('connect')} icon={<Plus className="w-5 h-5" />} delay={1}>
        <div className="space-y-4">
          <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            {t('connect_device_desc')}
          </p>
          
          <div>
            <label className={`block text-sm mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              {t('connect_ip_address')}
            </label>
            <input
              type="text"
              value={manualIP}
              onChange={(e) => {
                setManualIP(e.target.value);
                setIpError('');
              }}
              placeholder="192.168.4.1"
              className={`
                w-full px-4 py-3 rounded-xl
                font-mono
                placeholder-opacity-30
                focus:outline-none focus:border-primary
                transition-colors duration-200
                ${darkMode 
                  ? `bg-white/5 border ${ipError ? 'border-danger' : 'border-white/10'} text-white placeholder-white/30`
                  : `bg-white border ${ipError ? 'border-danger' : 'border-gray-200'} text-gray-800 placeholder-gray-400`
                }
              `}
            />
            {ipError && (
              <p className="text-xs text-danger mt-1">{ipError}</p>
            )}
          </div>
          
          <div>
            <label className={`block text-sm mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              {t('connect_port')}
            </label>
            <input
              type="number"
              value={manualPort}
              onChange={(e) => {
                setManualPort(e.target.value);
                setPortError('');
              }}
              placeholder="80"
              className={`
                w-full px-4 py-3 rounded-xl
                font-mono
                placeholder-opacity-30
                focus:outline-none focus:border-primary
                transition-colors duration-200
                ${darkMode 
                  ? `bg-white/5 border ${portError ? 'border-danger' : 'border-white/10'} text-white placeholder-white/30`
                  : `bg-white border ${portError ? 'border-danger' : 'border-gray-200'} text-gray-800 placeholder-gray-400`
                }
              `}
            />
            {portError && (
              <p className="text-xs text-danger mt-1">{portError}</p>
            )}
          </div>
          
          <div className="flex justify-center pt-6 pb-2">
            <Button
              variant="blue"
              onClick={handleManualConnect}
              loading={connecting}
              disabled={isConnected}
              icon={connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              className="px-10 py-3"
            >
              {connecting ? t('connecting') : isConnected ? t('connected') : t('connect')}
            </Button>
          </div>
        </div>
      </Card>

      {/* 连接提示 */}
      <Card delay={2}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tech/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Router className="w-4 h-4 text-tech" />
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('connect_tips_title')}
            </p>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
              <li>{t('connect_tip_1')}</li>
              <li>{t('connect_tip_2')}</li>
              <li>{t('connect_tip_3')}</li>
              <li>{t('connect_tip_4')}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 已保存的设备 */}
      {savedDevices.length > 0 && (
        <Card title={t('connect_history')} icon={<Router className="w-5 h-5" />} delay={3}>
          <div className="space-y-2">
            {savedDevices.map((device: typeof savedDevices[0]) => (
              <motion.div
                key={device.deviceId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Wifi className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {device.deviceName}
                    </p>
                    <p className={`text-xs font-mono ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                      {device.ip}:{device.port}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={() => handleConnect(device.ip, device.port, device.deviceName)}
                    disabled={connecting || (isConnected && deviceInfo?.deviceId === device.deviceId)}
                    icon={<Link2 className="w-3 h-3" />}
                  >
                    {t('connect')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSaved(device.deviceId)}
                    icon={<Trash2 className="w-3 h-3 text-danger" />}
                  >
                    {''}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
