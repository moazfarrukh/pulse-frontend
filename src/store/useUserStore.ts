import { create } from "zustand";
import { User } from "@/types/User";

export interface UserState {
  isAuthenticated: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User) => Promise<void>;
  removeCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  setCurrentUser: async (user: User) => {
    set({ isAuthenticated: true, currentUser: user });
  },
  removeCurrentUser: () => {
    set({ isAuthenticated: false, currentUser: null });
  },
})); 