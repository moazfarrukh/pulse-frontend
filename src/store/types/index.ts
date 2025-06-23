import { Message } from "@/types/Message";
import { User } from "@/types/User";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ChatState {
  messages: Message[];
  currentChannel: string | null;
  sendMessage: (message: string) => void;
  setCurrentChannel: (channelId: string) => void;
}

export interface ProfileModalState {
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

export type ChatTab = "chat" | "group_create" | "dm_create";

export interface ChatTabState {
  chatTab: ChatTab;
  setChatTab: (tab: ChatTab) => void;
}