export type Message = {
    avatar: string;
    displayName: string;
    message: string;
    mentions: string[] | undefined;
    id: string;
    senderId: string;
    recipientId?: string;
    content: string;

    timestamp: string; // ISO 8601 format
    read: boolean;
    type: 'dm' | 'group';
    groupId?: string; // present if type is 'group'
};
