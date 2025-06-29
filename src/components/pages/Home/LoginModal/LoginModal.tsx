// components/LoginModal/LoginModal.tsx
import React, { useState } from "react";
import TextField from "@/components/common/TextField";
import styles from "./LoginModal.module.scss";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useLogin } from "@/hooks/mutation";
import { XIcon } from "@/svgs/icons";

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleClose = () => {
    onClose();
    setErrors({});
    setFormData({ email: "", password: "" });
  };
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.email) &&
      !/^\d{10,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email or phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login result:", result);

      if (result.ok) {


        window.location.href = "/chat";

        setFormData({ email: "", password: "" });
        handleClose();
      } else {
        setErrors({
          general: result.message || "Login failed. Please try again.",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "Login failed. Please try again.";
      setErrors({ 
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleForgotClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleClose();
    window.location.href = "#";
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <XIcon />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>Login</h2>

          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              id="email"
              name="email"
              type="text"
              placeholder="Email Address / Phone Number"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              fullWidth
              disabled={isLoading}
            />

            <Link
              href="#"
              className={styles.forgotPassword}
              onClick={handleForgotClick}
            >
              Forgot password?
            </Link>

            <Button
              text={isLoading ? "Logging in..." : "Login"}
              onClick={() =>
                handleSubmit(
                  new Event(
                    "submit"
                  ) as unknown as React.FormEvent<HTMLFormElement>
                )
              }
              padding="10px 60px"
            />

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <Button
              text="Create a new account"
              onClick={onCreateAccount ?? (() => {})}
              padding="10px 60px"
              variant="outline"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
