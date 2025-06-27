import { ChatService } from "@/services";
import { ChatWithMembers } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ChatsResponse = {
    groupChats: ChatWithMembers[];
    directChats: ChatWithMembers[];
};

const useGetChats = () => {
    return useQuery<ChatsResponse, Error>({
        queryKey: ["chats"],
        queryFn: async () => {
            const res = await ChatService.getChats(); // Remove the parameters since backend handles both
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch chats");
            }
            return res.data;
        },
    });
};

export default useGetChats;