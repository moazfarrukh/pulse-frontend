"use client";

import React, { useState } from "react";

import styles from "./ChatInput.module.scss";
import TextArea from "./TextArea";
import Toolbar from "./Toolbar";
import AttachmentBar from "./AttachmentBar";
import SendButton from "./SendButton";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      // TODO: Implement actual send logic
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isSendDisabled = !message.trim();

  return (
    <div className={styles.chatInput}>
      <Toolbar />
      <TextArea 
        value={message} 
        onChange={setMessage} 
        onKeyDown={handleKeyDown}
      />
      <div className={styles.bottomBar}>
        <AttachmentBar />
        <SendButton 
          onClick={handleSendMessage}
          disabled={isSendDisabled}
        />
      </div>
    </div>
  );
};

export default ChatInput;
