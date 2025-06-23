// ChatMessage.tsx
"use client";

import React from "react";
import styles from "./ChatMessage.module.scss";
import Image from "next/image";

interface ChatMessageProps {
  avatar: string;
  displayName: string;
  timestamp: string;
  message: string;
  mentions?: string[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  avatar,
  displayName,
  timestamp,
  message,
  mentions = []
}) => {
  // Function to highlight mentions in the message
  const renderMessageWithMentions = (text: string) => {
    if (mentions.length === 0) {
      return text;
    }

    let result = text;
    mentions.forEach(mention => {
      const mentionRegex = new RegExp(`@${mention}`, 'gi');
      result = result.replace(mentionRegex, `<span class="${styles.mention}">@${mention}</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className={styles.chatMessage}>
      <div className={styles.avatar}>
        <Image src={avatar} alt={displayName} width={40} height={40} className={styles.avatarImage} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{displayName}</span>
          <span className={styles.timestamp}>{timestamp}</span>
        </div>
        <div className={styles.message}>
          {renderMessageWithMentions(message)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;