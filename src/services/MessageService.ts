import axiosClient from "@/clients/axios";
import { isAxiosError } from "axios";


const MessageService = {
    async getChatMessages(chatId: string) {
        try {
            const response = await axiosClient.get(`/messages/${chatId}`);
            return {
                data: response.data,
                ok: true,
            };
        }
        catch (error: unknown) {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to fetch chats";
                return {
                    data: { message, ok: false },
                    ok: false,
                };
            }
            return {
                data: { message: "Failed to fetch chats", ok: false },
                ok: false,
            };
        }
    },


};

export default MessageService;