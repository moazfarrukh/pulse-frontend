import React, { useState, useCallback, useRef } from "react";
import styles from "./EditProfileModal.module.scss";
import Image from "next/image";
import { XIcon } from "@/svgs/Icons";
import { useEditUser } from "@/hooks/mutation"; 

import { User } from "@/types"; 

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
  const { mutate: editUser, isPending: isEditing } = useEditUser(); // Add this line

  const [formData, setFormData] = useState({
    email: user.email || "",
    display_name: user.display_name || "",
    status: user.bio || "",
    avatarUrl: user.avatar_url || "/images/profile.jpg",
    avatarFile: null as File | null // Store the actual File object
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remove the uploadAvatar function since we're using the hook now

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Create preview URL for immediate display
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        avatarUrl: result, // Temporary preview
        avatarFile: file // Store the actual File object
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: "/images/profile.jpg",
      avatarFile: null
    }));
    setUploadError(null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    const dataToSave = {
      email: formData.email,
      username: user.username,
      display_name: formData.display_name,  
      bio: formData.status,
      avatarFile: formData.avatarFile,
    };

    editUser(dataToSave, {
      onSuccess: (response) => {
        if(!response.ok) {
          setUploadError(response.message || 'Failed to update profile');
          return;
        }
        
        // Update the avatar URL if a new one was returned
        if (response.avatar_url) {
          setFormData(prev => ({
            ...prev,
            avatarUrl: response.avatar_url || prev.avatarUrl, // Use previous value as fallback
            avatarFile: null // Clear the file after successful upload
          }));
        }

        if (onSave) {
          onSave({
            ...dataToSave,
            avatar_url: response.avatar_url || formData.avatarUrl,
          });
        }
        
        onClose();
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
        setUploadError(error.message || 'Failed to update profile');
      },
    });
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      email: user.email || "",
      display_name: user.display_name || "",
      status: user.bio || "",
      avatarUrl: user.avatar_url || "/images/profile.jpg",
      avatarFile: null
    });
    setUploadError(null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

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

              {/* Display Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="display_name" className={styles.label}>
                  Display name
                </label>
                <input
                  id="display_name"
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  className={styles.input}
                  placeholder="@display_name"
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
                      className={`${styles.avatar} `}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/profile.jpg";
                      }}
                      width={300}
                      height={300}
                    />
              
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className={styles.errorMessage}>
                      {uploadError}
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                  >
                    {'Upload Profile Photo'}
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
            disabled={isEditing}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isEditing}
          >
            {isEditing ? 'Saving...' : 'Save changes'}
          </button>
        </footer>
      </div>
    </>
  );
};

export default EditProfileModal;