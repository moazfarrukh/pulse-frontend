// ChatHeader.tsx
"use client";

import React from "react";
import styles from "./ChatHeader.module.scss";

interface ChatHeaderProps {
  channelName: string;
  memberCount?: number;
  memberAvatars?: string[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  channelName, 
  memberCount = 0, 
  memberAvatars = [] 
}) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.channelInfo}>
        <div className={styles.channelName}>
          <span className={styles.hash}>#</span>
          {channelName}
        </div>
      </div>
      
      {memberCount > 0 && (
        <div className={styles.memberInfo}>
          <div className={styles.avatarGroup}>
            {memberAvatars.slice(0, 4).map((avatar, index) => (
              <div 
                key={index}
                className={styles.avatar}
                style={{ 
                  backgroundImage: `url(${avatar})`,
                  zIndex: memberAvatars.length - index 
                }}
              />
            ))}
            <span className={styles.memberCount}>{memberCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;