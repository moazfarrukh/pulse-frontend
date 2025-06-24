import { Message } from "@/types/Message";
import { User } from "@/types/User";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setCurrentUser: (user: User) => Promise<void>;
  removeCurrentUser: () => void;
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