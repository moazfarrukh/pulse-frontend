"use client";

import React from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  disabled = false,
  active = false,
  title,
  className
}) => {
  return (
    <button
      className={`${styles.iconButton} ${active ? styles.active : ''} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
};

export default IconButton; 