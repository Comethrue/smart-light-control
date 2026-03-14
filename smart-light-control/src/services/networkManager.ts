import axios, { AxiosInstance } from 'axios';
import type { DeviceStatus, DeviceInfo } from '../types';

// ESP8266 设备通信管理器
class NetworkManager {
  private client: AxiosInstance | null = null;
  private baseUrl: string = '';
  private deviceIP: string = '';
  private devicePort: number = 80;
  private isConnected: boolean = false;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  
  // 回调函数
  private onStatusUpdate: ((status: Partial<DeviceStatus>) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  // 初始化连接
  initialize(ip: string, port: number = 80): void {
    this.deviceIP = ip;
    this.devicePort = port;
    this.baseUrl = `http://${ip}:${port}`;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[NetworkManager] 初始化连接: ${this.baseUrl}`);
  }

  // 测试设备连接
  async testConnection(): Promise<boolean> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    try {
      // ESP8266 通常使用简单的 /status 或 / 端点
      const response = await this.client.get('/status', { timeout: 3000 });
      this.isConnected = true;
      this.onConnectionChange?.(true);
      console.log('[NetworkManager] 连接成功:', response.data);
      return true;
    } catch (error) {
      console.log('[NetworkManager] 连接测试失败:', error);
      // 尝试其他常见端点
      try {
        const response = await this.client.get('/', { timeout: 3000 });
        if (response.status === 200) {
          this.isConnected = true;
          this.onConnectionChange?.(true);
          return true;
        }
      } catch {
        // 忽略
      }
      this.isConnected = false;
      this.onConnectionChange?.(false);
      return false;
    }
  }

  // 获取设备状态
  async getStatus(): Promise<DeviceStatus> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    try {
      const response = await this.client.get('/status');
      const data = response.data;
      
      // 解析ESP8266返回的状态数据
      // 假设ESP8266返回格式: { mode: "auto"|"manual", power: 0|1, brightness: 0-100, presence: 0|1 }
      const status: DeviceStatus = {
        mode: data.mode === 'auto' || data.mode === 1 ? 'auto' : 'manual',
        power: Boolean(data.power || data.on || data.state),
        brightness: Number(data.brightness || data.level || data.dim || 0),
        presence: Boolean(data.presence || data.motion || data.pir),
        timestamp: Date.now(),
      };
      
      this.onStatusUpdate?.(status);
      return status;
    } catch (error) {
      console.error('[NetworkManager] 获取状态失败:', error);
      throw error;
    }
  }

  // 获取设备信息
  async getInfo(): Promise<DeviceInfo> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    try {
      const response = await this.client.get('/info');
      const data = response.data;
      
      return {
        deviceId: data.id || data.deviceId || data.chip_id || `ESP_${this.deviceIP.replace(/\./g, '')}`,
        deviceName: data.name || data.deviceName || '智能灯光控制器',
        ip: this.deviceIP,
        port: this.devicePort,
        connected: true,
        firmware: data.firmware || data.version || 'v1.0.0',
        signal: data.rssi || data.signal || -50,
        online: true,
      };
    } catch {
      // 如果获取info失败，返回基本信息
      return {
        deviceId: `ESP_${this.deviceIP.replace(/\./g, '')}`,
        deviceName: '智能灯光控制器',
        ip: this.deviceIP,
        port: this.devicePort,
        connected: this.isConnected,
        firmware: 'v1.0.0',
        signal: -50,
        online: this.isConnected,
      };
    }
  }

  // 设置模式
  async setMode(mode: 'auto' | 'manual'): Promise<void> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    try {
      // 尝试多种常见的API格式
      await this.client.get(`/mode?value=${mode}`).catch(() => 
        this.client!.post('/mode', { mode }).catch(() =>
          this.client!.get(`/set?mode=${mode}`)
        )
      );
      console.log(`[NetworkManager] 设置模式: ${mode}`);
    } catch (error) {
      console.error('[NetworkManager] 设置模式失败:', error);
      this.onError?.('设置模式失败');
      throw error;
    }
  }

  // 设置亮度
  async setBrightness(brightness: number): Promise<void> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    const value = Math.max(0, Math.min(100, Math.round(brightness)));

    try {
      // 尝试多种常见的API格式
      await this.client.get(`/brightness?value=${value}`).catch(() =>
        this.client!.post('/brightness', { brightness: value }).catch(() =>
          this.client!.get(`/set?brightness=${value}`).catch(() =>
            this.client!.get(`/dim?value=${value}`)
          )
        )
      );
      console.log(`[NetworkManager] 设置亮度: ${value}%`);
    } catch (error) {
      console.error('[NetworkManager] 设置亮度失败:', error);
      this.onError?.('设置亮度失败');
      throw error;
    }
  }

  // 设置电源
  async setPower(power: boolean): Promise<void> {
    if (!this.client) {
      throw new Error('未初始化连接');
    }

    try {
      const value = power ? 1 : 0;
      // 尝试多种常见的API格式
      await this.client.get(`/power?value=${value}`).catch(() =>
        this.client!.post('/power', { power: value }).catch(() =>
          this.client!.get(`/set?power=${value}`).catch(() =>
            this.client!.get(power ? '/on' : '/off')
          )
        )
      );
      console.log(`[NetworkManager] 设置电源: ${power ? '开' : '关'}`);
    } catch (error) {
      console.error('[NetworkManager] 设置电源失败:', error);
      this.onError?.('设置电源失败');
      throw error;
    }
  }

  // 开始轮询状态
  startPolling(interval: number = 3000): void {
    this.stopPolling();
    
    this.pollingInterval = setInterval(async () => {
      if (this.isConnected && this.client) {
        try {
          await this.getStatus();
        } catch {
          console.log('[NetworkManager] 轮询状态失败');
        }
      }
    }, interval);
    
    console.log(`[NetworkManager] 开始轮询, 间隔: ${interval}ms`);
  }

  // 停止轮询
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('[NetworkManager] 停止轮询');
    }
  }

  // 设置回调函数
  setCallbacks(callbacks: {
    onStatusUpdate?: (status: Partial<DeviceStatus>) => void;
    onConnectionChange?: (connected: boolean) => void;
    onError?: (error: string) => void;
  }): void {
    this.onStatusUpdate = callbacks.onStatusUpdate ?? null;
    this.onConnectionChange = callbacks.onConnectionChange ?? null;
    this.onError = callbacks.onError ?? null;
  }

  // 获取连接状态
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // 获取设备IP
  getDeviceIP(): string {
    return this.deviceIP;
  }

  // 断开连接
  disconnect(): void {
    this.stopPolling();
    this.isConnected = false;
    this.client = null;
    this.onConnectionChange?.(false);
    console.log('[NetworkManager] 已断开连接');
  }
}

// 导出单例
export const networkManager = new NetworkManager();
