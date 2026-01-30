import { create } from 'zustand';

/** 全局状态入口：仅放跨页面/基建相关。业务状态优先放页面或 Context。 */
interface AppStore {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}));
