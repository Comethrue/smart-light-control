import type { DeviceInfo, DeviceStatus, DiscoveredDevice } from '../types';
import { generateDeviceId, delay } from '../utils/helpers';

// 模拟设备状态
let mockDeviceState: DeviceStatus = {
  mode: 'manual',
  power: false,
  brightness: 50,
  presence: false,
  timestamp: Date.now(),
};

// 模拟设备信息
const mockDeviceInfo: DeviceInfo = {
  deviceId: 'ESP_MOCK001',
  deviceName: '智能灯光控制器',
  ip: '192.168.1.100',
  port: 8080,
  connected: true,
  firmware: 'v1.2.3',
  signal: -45,
  online: true,
};

// 模拟设备服务
export const mockDevice = {
  // 获取设备状态
  async getStatus(): Promise<DeviceStatus> {
    await delay(100);
    return { ...mockDeviceState, timestamp: Date.now() };
  },

  // 获取设备信息
  async getInfo(): Promise<DeviceInfo> {
    await delay(100);
    return { ...mockDeviceInfo };
  },

  // 设置模式
  async setMode(mode: 'auto' | 'manual'): Promise<void> {
    await delay(50);
    mockDeviceState = { ...mockDeviceState, mode, timestamp: Date.now() };
  },

  // 设置亮度
  async setBrightness(brightness: number): Promise<void> {
    await delay(50);
    mockDeviceState = { 
      ...mockDeviceState, 
      brightness: Math.max(0, Math.min(100, brightness)),
      timestamp: Date.now() 
    };
  },

  // 设置电源
  async setPower(power: boolean): Promise<void> {
    await delay(50);
    mockDeviceState = { ...mockDeviceState, power, timestamp: Date.now() };
  },

  // 设置人体检测状态
  async setPresence(presence: boolean): Promise<void> {
    await delay(50);
    mockDeviceState = { ...mockDeviceState, presence, timestamp: Date.now() };
  },

  // 重置状态
  reset(): void {
    mockDeviceState = {
      mode: 'manual',
      power: false,
      brightness: 50,
      presence: false,
      timestamp: Date.now(),
    };
  },

  // 获取当前状态引用（用于模拟）
  getStateRef(): DeviceStatus {
    return mockDeviceState;
  },

  // 更新状态（用于模拟）
  updateState(updates: Partial<DeviceStatus>): void {
    mockDeviceState = { ...mockDeviceState, ...updates, timestamp: Date.now() };
  },
};

// 模拟设备搜索
export const scanForDevices = async (): Promise<DiscoveredDevice[]> => {
  await delay(2000); // 模拟扫描延迟
  
  // 返回模拟的设备列表
  return [
    {
      deviceId: 'ESP_MOCK001',
      deviceName: '智能灯光控制器',
      ip: '192.168.1.100',
      port: 8080,
      signal: -45,
      online: true,
    },
    {
      deviceId: generateDeviceId(),
      deviceName: '卧室灯光',
      ip: '192.168.1.101',
      port: 8080,
      signal: -55,
      online: true,
    },
    {
      deviceId: generateDeviceId(),
      deviceName: '客厅灯光',
      ip: '192.168.1.102',
      port: 8080,
      signal: -65,
      online: false,
    },
  ];
};

// 模拟连接设备
export const connectToDevice = async (ip: string, port: number): Promise<DeviceInfo> => {
  await delay(500); // 模拟连接延迟
  
  return {
    deviceId: generateDeviceId(),
    deviceName: '智能灯光控制器',
    ip,
    port,
    connected: true,
    firmware: 'v1.2.3',
    signal: -50,
    online: true,
  };
};
