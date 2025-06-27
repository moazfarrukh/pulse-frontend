import { create } from "zustand";

export interface PresenceState {
  activeUsers: string[];
  setActiveUsers: (userIds: string[]) => void;
  addActiveUser: (userId: string) => void;
  removeActiveUser: (userId: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  activeUsers: [],
  setActiveUsers: (userIds: string[]) => set({ activeUsers: userIds }),
  addActiveUser: (userId: string) => set((state) => ({ activeUsers: [...state.activeUsers, userId] })),
  removeActiveUser: (userId: string) => set((state) => ({ activeUsers: state.activeUsers.filter((u) => u !== userId) })),
})); 