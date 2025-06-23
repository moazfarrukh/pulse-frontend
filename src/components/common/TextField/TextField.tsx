// components/TextField/TextField.tsx
import React, { forwardRef } from "react";
import styles from "./TextField.module.scss";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  fullWidth?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'outlined',
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      styles.input,
      styles[variant],
      fullWidth && styles.fullWidth,
      error && styles.error,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.fieldContainer}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {(error || helperText) && (
          <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";



export default TextField;