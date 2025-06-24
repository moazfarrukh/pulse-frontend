// ProfileModal.tsx
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { User } from "@/types";
import { XIcon} from "@/svgs/Icons";
import styles from "./ProfileModal.module.scss";
import ContactItemList from "./ContactItemList";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave?: (userData: Partial<User>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [, setIsEditing] = useState(false);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const avatarSrc = user.avatar_url || "/images/profile.jpg";
  const displayName = user.display_name || "User";

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
        aria-labelledby="profile-modal-title"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 id="profile-modal-title" className={styles.title}>
            Profile
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close profile modal"
          >
            <XIcon />
          </button>
        </header>

        {/* Content */}
        <main className={styles.content}>
          {/* Avatar Section */}
          <section className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <Image
                src={avatarSrc}
                alt={`${displayName}'s avatar`}
                className={styles.avatar}
                width={300}
                height={300}
                priority
              />
            </div>
          </section>

          {/* Username Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{displayName}</h3>
                <span className={styles.userHandle}>@{user.username}</span>
              </div>
              <button
                onClick={handleEditToggle}
                className={styles.editButton}
                aria-label="Edit username"
              >
                Edit
              </button>
            </div>

            <div className={styles.statusText}>
              Status will be shown here when ever a user set a status. Status
              will be shown here when ever a user set a status. Status will be
              shown here when ever a user set a status. Status will be shown
              here when ever a user set a status.
            </div>
          </section>
          {/* Contact Items Section */}
          <ContactItemList
            user={user}
            onEdit={handleEditToggle}
            onAddInformation={handleEditToggle}
          />
        </main>
      </div>
    </>
  );
};

export default ProfileModal;
