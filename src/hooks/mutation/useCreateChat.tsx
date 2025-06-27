import { ChatService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateChatRequest } from "@/types";
import useSocket from "../useSocket";
import SocketEvents from "@/constants/socketEvents";

interface CreateChatResponse {
  message?: string;
  ok: boolean;
}

const useCreateChat = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  
  return useMutation<CreateChatResponse, Error, CreateChatRequest>({
    mutationFn: async (data: CreateChatRequest) => {
      const res = await ChatService.createChat(data);
      if(res.ok && socket) {
        console.log("Socket is connected, emitting join event",res.data)
        
        console.log("Emitting join chat event for chat_id:", res.data.id, "and user_id:", res.data.created_by);
        socket.emit(SocketEvents.ON_JOIN_CHAT, {
          chat_id: res.data.id,
          user_id: res.data.created_by,
        });
      }
      return {
        message: res.data.message || 'Chat created successfully',
        ok: res.ok,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export default useCreateChat;