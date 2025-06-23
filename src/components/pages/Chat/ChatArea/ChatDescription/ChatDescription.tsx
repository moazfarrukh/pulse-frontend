// ChatDescription.tsx
"use client";

import React from "react";
import styles from "./ChatDescription.module.scss";

interface ChatDescriptionProps {
  creatorName: string;
  createdDate: string;
  groupName: string;
  description?: string;
}

const ChatDescription: React.FC<ChatDescriptionProps> = ({
  creatorName,
  createdDate,
  groupName,
  description,
}) => {
  return (
    <div className={styles.chatDescription}>
      <div className={styles.groupName}>
        <span className={styles.hash}>#</span>
        {groupName}
      </div>
      <div className={styles.creatorInfo}>
        <span className={styles.mention}>@{creatorName}</span>
        <span className={styles.text}>created this group on {createdDate}.</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
    </div>
  );
};

export default ChatDescription;
