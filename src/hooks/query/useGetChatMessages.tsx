import { useQuery } from '@tanstack/react-query';
import { MessageService } from '@/services';
import { MessageWithSender } from '@/types/Message';

const useGetChatMessages = (chatId: string) => {
    return useQuery<MessageWithSender[], Error>({
        queryKey: ['chatMessages', chatId],
        queryFn: async () => {
            const res = await MessageService.getChatMessages(chatId);
            if (!res.ok) {
                throw new Error(res.data?.message || 'Failed to fetch chat messages');
            }   
            return res.data;
        },
        enabled: chatId !== '',
    });
};

export default useGetChatMessages;