"use client";
import React, { CSSProperties } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
    text: string;
    action: () => void | Promise<void>;
    variant?: "primary" | "outline";
    padding?: string;
    style?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
    text, 
    action, 
    variant = "primary",
    padding,
    style 
}) => {
    const buttonClass = variant === "primary" ? styles.primary : styles.outline;

    return (
        <button
            className={`${styles.button} ${buttonClass}`}
            onClick={action}
            style={{ ...(padding ? { padding } : {}), ...style }} // Merge styles
        >
            {text}
        </button>
    );
};

export default Button;