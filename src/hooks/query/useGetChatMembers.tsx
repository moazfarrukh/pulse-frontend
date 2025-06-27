import { useQuery } from '@tanstack/react-query';
import { ChatService } from '@/services';
import { User } from '@/types';

const useGetChatMembers = (chatId: string) => {
    return useQuery<User[], Error>({
        queryKey: ['chatMembers', chatId],
        queryFn: async () => {
            const res = await ChatService.getChatMembers(chatId);
            if (!res.ok) {
                throw new Error(res.data?.message || 'Failed to fetch chat messages');
            }
            return res.data;
        },
        enabled: chatId !== '',
    });
};

export default useGetChatMembers;