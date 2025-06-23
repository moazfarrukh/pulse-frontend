"use client";

import React from "react";
import styles from "./SendButton.module.scss";
import SendIcon from "@/svgs/Icons/SendIcon";
// import { FaPaperPlane } from "react-icons/fa";

interface SendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SendButton: React.FC<SendButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className 
}) => (
  <button 
    className={`${styles.sendButton} ${className || ''}`}
    onClick={onClick}
    disabled={disabled}
    type="button"
    aria-label="Send message"
  >
    <SendIcon />
  </button>
);

export default SendButton;
