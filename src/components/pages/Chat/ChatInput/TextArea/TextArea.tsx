"use client";

import React from "react";
import styles from "./TextArea.module.scss";

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  value = "", 
  onChange, 
  onKeyDown,
  placeholder = "Message Log Rocket Updates" 
}) => (
  <div className={styles.textAreaWrapper}>
    <input
      className={styles.textArea}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
    />
  </div>
);

export default TextArea;
