export type Message = {
    avatar: string;
    displayName: string;
    message: string;
    mentions: string[] | undefined;
    id: string;
    senderId: string;
    chatId: string;
    content: string;
    attachments?: string[]; // optional, for file attachments
    timestamp: string; // ISO 8601 format
    read: boolean;
    type: 'dm' | 'group';
};
