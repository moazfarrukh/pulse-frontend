import { create } from "zustand";
import { ChatWithMembers } from "@/types";

export interface ChatState {
  currentChannel: string | null;
  setCurrentChannel: (channelId: string | null) => void;
  currentChat: ChatWithMembers | null;
  setCurrentChat: (chat: ChatWithMembers | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChannel: null,
  setCurrentChannel: (channelId: string | null) => set({ currentChannel: channelId }),
  currentChat: null,
  setCurrentChat: (chat: ChatWithMembers | null) => set({ currentChat: chat }),
})); 