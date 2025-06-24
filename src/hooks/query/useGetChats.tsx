import { ChatService } from "@/services";
import { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";


const useGetChats = () => {
    return useQuery<Chat[], Error>({
        queryKey: ["chats"],
        queryFn: async () => {
            const res = await ChatService.getChats();
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch chats");
            }
            return res.data;
        },
    });
};

export default useGetChats;