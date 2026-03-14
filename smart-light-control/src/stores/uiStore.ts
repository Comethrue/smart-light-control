import { create } from 'zustand';
import type { LogEntry } from '../types';

interface UIState {
  // 加载状态
  loading: boolean;
  // 错误信息
  error: string | null;
  // 当前页面
  currentPage: string;
  // 模拟日志
  logs: LogEntry[];
  // 搜索中
  searching: boolean;
  // 上课模拟状态
  classSimulating: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: string) => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  setSearching: (searching: boolean) => void;
  setClassSimulating: (simulating: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: false,
  error: null,
  currentPage: '/',
  logs: [],
  searching: false,
  classSimulating: false,

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addLog: (message, type = 'info') =>
    set((state) => ({
      logs: [
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          message,
          type,
        },
        ...state.logs,
      ].slice(0, 50), // 最多保留50条日志
    })),

  clearLogs: () => set({ logs: [] }),

  setSearching: (searching) => set({ searching }),

  setClassSimulating: (simulating) => set({ classSimulating: simulating }),
}));
