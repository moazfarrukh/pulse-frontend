import { create } from "zustand";
import { Message } from "@/types/Message";
import { AuthState, ChatState, ProfileModalState, ChatTabState } from "@/store/types";
import { User } from "@/types";

type StoreState = AuthState & ChatState & ProfileModalState & ChatTabState;

const useStore = create<StoreState>((set, get) => ({
  // AuthState
  isAuthenticated: false,
  user: null,
  setCurrentUser: async (user: User) => {
    set({ isAuthenticated: true, user});
  },
  removeCurrentUser: () => {
    set({ isAuthenticated: false, user: null });
  },

  // ChatState
  messages: [],
  currentChannel: null,
  sendMessage: (content: string) => {
    const user = get().user;
    const currentChannel = get().currentChannel;
    if (!user || !currentChannel) return;
    const isGroup = currentChannel.startsWith("group_");
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      read: false,
      type: isGroup ? "group" : "dm",
      avatar: user.avatar_url || "", 
      displayName: user.display_name,
      message: content,
      mentions: [],
      ...(isGroup
        ? { groupId: currentChannel }
        : { chatId: currentChannel }),
    };
    set((state: StoreState) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  setCurrentChannel: (channelId: string) => {
    set({ currentChannel: channelId });
  },

  // ProfileModalState
  isProfileModalOpen: false,
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  // ChatTabState
  chatTab: "chat",
  setChatTab: (tab) => set({ chatTab: tab }),
}));



export default useStore;
