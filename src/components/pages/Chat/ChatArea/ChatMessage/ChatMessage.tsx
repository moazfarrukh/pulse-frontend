// ChatMessage.tsx
"use client";

import React from "react";
import styles from "./ChatMessage.module.scss";
import Image from "next/image";
import {usePresenceStore} from "@/store";
import type { MessageWithSender } from "@/types/Message";
import AudioPlayer from "@/components/common/AudioPlayer";
import VideoPlayer from "@/components/common/VideoPlayer";
import { renderFormattedText } from "@/utils/textFormatting";
import { formatChatTimestamp } from "@/utils/date";

interface ChatMessageProps {
  message: MessageWithSender;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { activeUsers } = usePresenceStore();
  const isOnline = activeUsers.includes(String(message.sender_id));

  const renderAttachments = () => {
    if (!message.attachments || !message.attachments.length) return null;
    return (
      <div className={styles.attachments}>
        {message.attachments.map((att, idx) => {
          if (att.file_type.startsWith("image/")) {
            return (
              <a
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                className={styles.attachmentImageLink}
              >
                <Image
                  width={160}
                  height={120}
                  src={att.file_url}
                  alt="attachment"
                  className={styles.attachmentImage}
                />
              </a>
            );
          }

          if (att.file_type.startsWith("audio/")) {
            const fileName = att.file_url.split("/").pop() || "Voice Message";
            return (
              <AudioPlayer
                key={idx}
                audioUrl={att.file_url}
                fileName={fileName}
              />
            );
          }

          if (att.file_type.startsWith("video/")) {
            const fileName = att.file_url.split("/").pop() || "Video Message";
            return (
              <VideoPlayer
                key={idx}
                videoUrl={att.file_url}
                fileName={fileName}
              />
            );
          }

          // For other file types, show as a download link
          return (
            <a
              href={att.file_url}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className={styles.attachmentFileLink}
            >
              {att.file_url.split("/").pop() || "Download file"}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.chatMessage}>
      <div className={styles.avatar}>
        <Image
          src={message.avatar_url || "/images/profile.jpg"}
          alt={message.display_name || ""}
          width={40}
          height={40}
          className={styles.avatarImage}
        />
        <span
          className={
            isOnline
              ? `${styles.statusDot} ${styles.online}`
              : `${styles.statusDot} ${styles.offline}`
          }
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{message.display_name}</span>
          <span className={styles.timestamp}>{formatChatTimestamp(message.created_at)}</span>
        </div>
        <div className={styles.message}>{renderFormattedText(message.content)}</div>
        {renderAttachments()}
      </div>
    </div>
  );
};

export default ChatMessage;
