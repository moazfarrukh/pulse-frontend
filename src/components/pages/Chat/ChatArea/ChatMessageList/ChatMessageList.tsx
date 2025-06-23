// ChatMessagesList.tsx
"use client";

import React from "react";
import ChatMessage from "./ChatMessage";
import styles from "./ChatMessageList.module.scss";
import { Message } from "@/types";

interface ChatMessagesListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessagesListProps> = ({ messages }) => {
  return (
    <div className={styles.chatMessagesList}>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          avatar={message.avatar}
          displayName={message.displayName}
          timestamp={message.timestamp}
          message={message.message}
          mentions={message.mentions}
        />
      ))}
    </div>
  );
};

export default ChatMessageList;