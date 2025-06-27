import { ChatService } from "@/services";
import { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetUnjoinedChats = () => {
    return useQuery<Chat[], Error>({
        queryKey: ["unjoinedChats"],
        queryFn: async () => {
            const res = await ChatService.getUnjoinedChats();
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch chats");
            }
            return res.data;
        },
    });
};

export default useGetUnjoinedChats;