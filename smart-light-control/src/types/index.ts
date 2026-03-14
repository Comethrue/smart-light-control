// 设备信息类型
export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  ip: string;
  port: number;
  connected: boolean;
  firmware: string;
  signal?: number;
  online?: boolean;
}

// 设备状态类型
export interface DeviceStatus {
  mode: 'auto' | 'manual';
  power: boolean;
  brightness: number;
  presence: boolean;
  timestamp: number;
}

// 应用设置类型
export interface AppSettings {
  darkMode: boolean;
  language: 'zh_CN' | 'en_US';
  autoReconnect: boolean;
  refreshInterval: number;
}

// 日志条目类型
export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// 搜索到的设备类型
export interface DiscoveredDevice {
  deviceId: string;
  deviceName: string;
  ip: string;
  port: number;
  signal: number;
  online: boolean;
}

// 控制命令类型
export interface ControlCommand {
  command: 'setMode' | 'setBrightness' | 'setPower';
  value: 'auto' | 'manual' | number | boolean;
  timestamp: number;
}

// WebSocket消息类型
export interface WSMessage {
  type: 'statusUpdate' | 'presenceDetected' | 'error' | 'pong';
  data?: Partial<DeviceStatus>;
  message?: string;
}

// 粒子特效类型
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

// 轨迹点类型
export interface TrailPoint {
  id: string;
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}
