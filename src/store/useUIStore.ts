import { create } from "zustand";
export type ChatTab = "chat" | "group_create" | "dm_create";

export interface UIState {
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  chatTab: ChatTab;
  setChatTab: (tab: ChatTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isProfileModalOpen: false,
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  chatTab: "chat",
  setChatTab: (tab: ChatTab) => set({ chatTab: tab }),
})); 