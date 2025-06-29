// ProfileModal.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "@/types";
import { XIcon } from "@/svgs/icons";
import styles from "./ProfileModal.module.scss";
import ContactItemList from "./ContactItemList";
import EditProfileModal from "../EditProfileModal";
import Button from "../Button";
import { useLogout } from "@/hooks/mutation";
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
  onSave,
}) => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const logoutMutation = useLogout();


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditProfileToggle = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleEditProfileModalClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleEditProfileModalSave = (userData: Partial<User>) => {
    if (onSave) {
      onSave(userData);
    }
    setIsEditProfileModalOpen(false);
  };




  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

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
                onClick={handleEditProfileToggle}
                className={styles.editButton}
                aria-label="Edit username"
              >
                Edit
              </button>
            </div>

            <div className={styles.statusText}>
              {user.bio || "No status available."}
            </div>
          </section>

          <ContactItemList
            user={user}
          />

          <div className={styles.buttonSection}>
            <Button text="Logout" variant="danger" onClick={handleLogout} />
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleEditProfileModalClose}
        user={user}
        onSave={handleEditProfileModalSave}
      />

    </>
  );
};

export default ProfileModal;
