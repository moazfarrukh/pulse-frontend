"use client";
import React, { CSSProperties } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
    text: string;
    onClick: () => void | Promise<void>;
    variant?: string;
    padding?: string;
    style?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
    text, 
    onClick, 
    variant = "primary",
    padding,
}) => {
    const buttonClass = styles[variant]

    return (
        <button
            className={`${styles.button} ${buttonClass}`}
            onClick={onClick}
            style={padding ? { padding } : {}}
        >
            {text}
        </button>
    );
};

export default Button;