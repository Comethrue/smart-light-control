// 格式化时间戳
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 格式化日期时间
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 验证IP地址格式
export const isValidIP = (ip: string): boolean => {
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipPattern.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

// 验证端口范围
export const isValidPort = (port: number): boolean => {
  return port >= 1 && port <= 65535;
};

// 生成随机设备ID
export const generateDeviceId = (): string => {
  return `ESP_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

// 生成随机亮度
export const generateRandomBrightness = (): number => {
  return Math.floor(Math.random() * 101);
};

// 计算灯光颜色（根据亮度从暖黄到冷白）
export const getBrightnessColor = (brightness: number): string => {
  // 亮度低时偏暖黄，亮度高时偏冷白
  const warmR = 255;
  const warmG = 200;
  const warmB = 100;
  
  const coolR = 255;
  const coolG = 255;
  const coolB = 255;
  
  const ratio = brightness / 100;
  
  const r = Math.round(warmR + (coolR - warmR) * ratio);
  const g = Math.round(warmG + (coolG - warmG) * ratio);
  const b = Math.round(warmB + (coolB - warmB) * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// 计算发光强度
export const getGlowIntensity = (brightness: number, power: boolean): string => {
  if (!power || brightness === 0) {
    return '0 0 0 rgba(255, 200, 100, 0)';
  }
  
  const intensity = brightness / 100;
  const blur = 20 + intensity * 40;
  const spread = 5 + intensity * 15;
  const alpha = 0.3 + intensity * 0.5;
  const color = getBrightnessColor(brightness);
  
  return `0 0 ${blur}px ${spread}px rgba(255, 200, 100, ${alpha}), 0 0 ${blur * 2}px ${spread * 2}px ${color.replace('rgb', 'rgba').replace(')', `, ${alpha * 0.5})`)}`;
};

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// 限制数值范围
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// 延迟函数
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 生成唯一ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
