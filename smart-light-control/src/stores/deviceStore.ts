import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeviceInfo, DeviceStatus, DiscoveredDevice } from '../types';

interface DeviceState {
  // 设备信息
  deviceInfo: DeviceInfo | null;
  // 设备状态
  deviceState: DeviceStatus;
  // 已发现的设备列表
  discoveredDevices: DiscoveredDevice[];
  // 保存的设备列表
  savedDevices: DeviceInfo[];
  
  // Actions
  setDeviceInfo: (info: DeviceInfo | null) => void;
  updateDeviceState: (state: Partial<DeviceStatus>) => void;
  setDiscoveredDevices: (devices: DiscoveredDevice[]) => void;
  addSavedDevice: (device: DeviceInfo) => void;
  removeSavedDevice: (deviceId: string) => void;
  disconnect: () => void;
  reset: () => void;
}

const initialDeviceState: DeviceStatus = {
  mode: 'manual',
  power: false,
  brightness: 50,
  presence: false,
  timestamp: Date.now(),
};

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      deviceInfo: null,
      deviceState: initialDeviceState,
      discoveredDevices: [],
      savedDevices: [],

      setDeviceInfo: (info) => set({ deviceInfo: info }),

      updateDeviceState: (newState) =>
        set((state) => ({
          deviceState: {
            ...state.deviceState,
            ...newState,
            timestamp: Date.now(),
          },
        })),

      setDiscoveredDevices: (devices) => set({ discoveredDevices: devices }),

      addSavedDevice: (device) =>
        set((state) => {
          const exists = state.savedDevices.some(
            (d) => d.deviceId === device.deviceId
          );
          if (exists) {
            return {
              savedDevices: state.savedDevices.map((d) =>
                d.deviceId === device.deviceId ? device : d
              ),
            };
          }
          return { savedDevices: [...state.savedDevices, device] };
        }),

      removeSavedDevice: (deviceId) =>
        set((state) => ({
          savedDevices: state.savedDevices.filter((d) => d.deviceId !== deviceId),
        })),

      disconnect: () =>
        set((state) => ({
          deviceInfo: state.deviceInfo
            ? { ...state.deviceInfo, connected: false }
            : null,
        })),

      reset: () =>
        set({
          deviceInfo: null,
          deviceState: initialDeviceState,
          discoveredDevices: [],
        }),
    }),
    {
      name: 'device-storage',
      partialize: (state) => ({
        savedDevices: state.savedDevices,
      }),
    }
  )
);
