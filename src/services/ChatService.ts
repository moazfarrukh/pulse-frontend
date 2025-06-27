import axiosClient from "@/clients/axios";
import { CreateChatRequest } from "@/types/Chat";
import { isAxiosError } from "axios";

const ChatService = {
  async getChats() {
    try {
      const response = await axiosClient.get('/chats');
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch chats";
        return {
          data: { message, ok: false },
          ok: false,
        };
      }
      return {
        data: { message: "Something went wrong", ok: false },
        ok: false,
      };
    }
  },
async getUnjoinedChats() {
    try {
      const response = await axiosClient.get(`/chats/unjoined`);
      return {
        data: response.data,
        ok: true, 
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch unjoined chats";
        return {
          data: { message, ok: false },
          ok: false,
        };
      }
      return {
        data: { message: "Something went wrong", ok: false },
        ok: false,
      };
    }
  }
  ,
  async getChat(chatId: string) {
    try {
      const response = await axiosClient.get(`/chats/${chatId}`);
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to fetch chat";
        return {
          data: { message, ok: false },
          ok: false,
        };
      }
      return {
        data: { message: "Something went wrong", ok: false },
        ok: false,
      };
    }
  },
  getChatMembers: async (chatId: string) => {
    try {
      const response = await axiosClient.get(`/chats/${chatId}/members`);
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch chat members";
        return {
          data: { message, ok: false },
          ok: false,
        };
      }
      return {
        data: { message: "Something went wrong", ok: false },
        ok: false,
      };
    }
  },

  async createChat(createChatData: CreateChatRequest) {
    try {
      const response = await axiosClient.post(`/chats`, createChatData);
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create chat";
        return {
          data: { message, ok: false },
          ok: false,
        };
      }
      return {
        data: { message: "Something went wrong", ok: false },
        ok: false,
      };
    }
  },
};

export default ChatService;
