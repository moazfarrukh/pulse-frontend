import React, { useState, useCallback, useRef } from "react";
import styles from "./EditProfileModal.module.scss";
import Image from "next/image";
import { XIcon } from "@/svgs/Icons";

interface User {
  displayName?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  status?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave?: (userData: Partial<User>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    email: user.email || "",
    username: user.username || "",
    status: user.status || "Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status.",
    avatarUrl: user.avatarUrl || "/images/profile.jpg",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          avatarUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: "/images/profile.jpg"
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      email: user.email || "",
      username: user.username || "",
      status: user.status || "Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status.",
      avatarUrl: user.avatarUrl || "/images/profile.jpg",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        role="presentation"
      />

      {/* Modal */}
      <div
        className={`${styles.modal} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-modal-title"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 id="edit-profile-modal-title" className={styles.title}>
            Edit your profile
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close edit profile modal"
          >
            <XIcon/>
          </button>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.gridContainer}>
            {/* Left Column - Form Fields */}
            <div className={styles.formColumn}>
              {/* Email Address */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Username */}
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={styles.input}
                  placeholder="@username"
                />
              </div>

              {/* Status */}
              <div className={styles.inputGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <textarea
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  rows={6}
                  className={styles.textarea}
                  placeholder="Enter your status"
                />
              </div>
            </div>

            {/* Right Column - Profile Photo */}
            <div className={styles.photoColumn}>
              <div className={styles.photoSection}>
                <label className={styles.label}>
                  Profile photo
                </label>
                
                {/* Avatar Display */}
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarWrapper}>
                    <Image
                      src={formData.avatarUrl}
                      alt="Profile avatar"
                      className={styles.avatar}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/profile.jpg";
                      }}
                        width={300}
                        height={300}
                    />
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                  >
                    Upload Profile Photo
                  </button>

                  {/* Remove Photo Button */}
                  <button
                    onClick={handleRemovePhoto}
                    className={styles.removeButton}
                  >
                    Remove Photo
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className={styles.hiddenInput}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer with Action Buttons */}
        <footer className={styles.footer}>
          <button
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save changes
          </button>
        </footer>
      </div>
    </>
  );
};
export default EditProfileModal;