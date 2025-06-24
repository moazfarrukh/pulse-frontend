import { ChatService } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { CreateChatRequest } from "@/types";

interface CreateChatResponse {
  message?: string;
  ok: boolean;
}

 const useCreateChat = () =>
  useMutation<CreateChatResponse, Error, CreateChatRequest>({
    mutationFn: async (data: CreateChatRequest) => {
      const res = await ChatService.createChat(data);
      return {
        message: res.data.message || 'Chat created successfully',
        ok: res.ok,
      };
    },
  });
  export default useCreateChat;