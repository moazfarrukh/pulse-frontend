import React, { useState, useCallback, useRef } from "react";
import styles from "./EditProfileModal.module.scss";
import Image from "next/image";
import { XIcon } from "@/svgs/icons";
import { useEditUser } from "@/hooks/mutation"; 

import { User } from "@/types"; 

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave?: (userData: Partial<User>) => void;
}

interface ValidationErrors {
  email?: string;
  display_name?: string;
  phone?: string;
  status?: string;
  avatar?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const { mutate: editUser, isPending: isEditing } = useEditUser();

  const [formData, setFormData] = useState({
    email: user.email || "",
    display_name: user.display_name || "",
    phone: user.phone || "",
    status: user.bio || "",
    avatarUrl: user.avatar_url || "/images/profile.jpg",
    avatarFile: null as File | null
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateDisplayName = (displayName: string): string | undefined => {
    if (!displayName.trim()) {
      return "Display name is required";
    }
    if (displayName.length < 2) {
      return "Display name must be at least 2 characters long";
    }
    if (displayName.length > 30) {
      return "Display name must be less than 30 characters";
    }
    // Check for valid characters (letters, numbers, spaces, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(displayName)) {
      return "Display name can only contain letters, numbers, spaces, hyphens, and underscores";
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return undefined; // Phone is optional
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return "Phone number must be at least 10 digits long";
    }
    
    if (digitsOnly.length > 15) {
      return "Phone number must be less than 15 digits long";
    }
    
    // Basic phone number format validation (allows various formats)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(digitsOnly)) {
      return "Please enter a valid phone number";
    }
    
    return undefined;
  };

  const validateStatus = (status: string): string | undefined => {
    if (status.length > 500) {
      return "Status must be less than 500 characters";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    errors.email = validateEmail(formData.email);
    errors.display_name = validateDisplayName(formData.display_name);
    errors.phone = validatePhone(formData.phone);
    errors.status = validateStatus(formData.status);
    
    setValidationErrors(errors);
    
    // Return true if no errors
    return !Object.values(errors).some(error => error !== undefined);
  };

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

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 6) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    if (digitsOnly.length <= 10) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    
    // For longer numbers, format as international
    if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
      return `+1-${digitsOnly.slice(1, 4)}-${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
    }
    
    // For other international numbers, just add + at the beginning
    return `+${digitsOnly}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleInputBlur = (field: string, value: string) => {
    // Validate field on blur
    let error: string | undefined;
    
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'display_name':
        error = validateDisplayName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'status':
        error = validateStatus(value);
        break;
    }

    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setValidationErrors(prev => ({ ...prev, avatar: undefined }));

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const error = 'Please select an image file (JPG, PNG, GIF, etc.)';
      setUploadError(error);
      setValidationErrors(prev => ({ ...prev, avatar: error }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const error = 'File size must be less than 5MB';
      setUploadError(error);
      setValidationErrors(prev => ({ ...prev, avatar: error }));
      return;
    }

    // Validate image dimensions (optional - you can adjust these limits)
    const img = new window.Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        const error = 'Image must be at least 100x100 pixels';
        setUploadError(error);
        setValidationErrors(prev => ({ ...prev, avatar: error }));
        return;
      }

      if (img.width > 2000 || img.height > 2000) {
        const error = 'Image must be smaller than 2000x2000 pixels';
        setUploadError(error);
        setValidationErrors(prev => ({ ...prev, avatar: error }));
        return;
      }

      // If all validations pass, create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          avatarUrl: result,
          avatarFile: file
        }));
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      const error = 'Invalid image file';
      setUploadError(error);
      setValidationErrors(prev => ({ ...prev, avatar: error }));
    };

    img.src = URL.createObjectURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: "/images/profile.jpg",
      avatarFile: null
    }));
    setUploadError(null);
    setValidationErrors(prev => ({ ...prev, avatar: undefined }));
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      email: formData.email.trim(),
      username: user.username,
      display_name: formData.display_name.trim(),
      phone: formData.phone.trim(),
      bio: formData.status.trim(),
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
            avatarUrl: response.avatar_url || prev.avatarUrl,
            avatarFile: null
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
      phone: user.phone || "",
      status: user.bio || "",
      avatarUrl: user.avatar_url || "/images/profile.jpg",
      avatarFile: null
    });
    setValidationErrors({});
    setUploadError(null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onClose();
  };

  if (!isOpen) return null;

  // Check if form has any validation errors
  const hasValidationErrors = Object.values(validationErrors).some(error => error !== undefined);

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
                  Email address <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={(e) => handleInputBlur('email', e.target.value)}
                  className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
                  placeholder="Enter your email address"
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                />
                {validationErrors.email && (
                  <span id="email-error" className={styles.errorText} role="alert">
                    {validationErrors.email}
                  </span>
                )}
              </div>

              {/* Display Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="display_name" className={styles.label}>
                  Display name <span className={styles.required}>*</span>
                </label>
                <input
                  id="display_name"
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  onBlur={(e) => handleInputBlur('display_name', e.target.value)}
                  className={`${styles.input} ${validationErrors.display_name ? styles.inputError : ''}`}
                  placeholder="Enter your display name"
                  maxLength={30}
                  aria-invalid={!!validationErrors.display_name}
                  aria-describedby={validationErrors.display_name ? "display-name-error" : "display-name-help"}
                />
                {validationErrors.display_name && (
                  <span id="display-name-error" className={styles.errorText} role="alert">
                    {validationErrors.display_name}
                  </span>
                )}
                <span id="display-name-help" className={styles.helpText}>
                  {formData.display_name.length}/30 characters
                </span>
              </div>

              {/* Phone Number */}
              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={(e) => handleInputBlur('phone', e.target.value)}
                  className={`${styles.input} ${validationErrors.phone ? styles.inputError : ''}`}
                  placeholder="Enter your phone number"
                  aria-invalid={!!validationErrors.phone}
                  aria-describedby={validationErrors.phone ? "phone-error" : "phone-help"}
                />
                {validationErrors.phone && (
                  <span id="phone-error" className={styles.errorText} role="alert">
                    {validationErrors.phone}
                  </span>
                )}
                <span id="phone-help" className={styles.helpText}>
                  Format: 123-456-7890 or +1-123-456-7890 (optional)
                </span>
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
                  onBlur={(e) => handleInputBlur('status', e.target.value)}
                  rows={6}
                  className={`${styles.textarea} ${validationErrors.status ? styles.inputError : ''}`}
                  placeholder="Enter your status"
                  maxLength={500}
                  aria-invalid={!!validationErrors.status}
                  aria-describedby={validationErrors.status ? "status-error" : "status-help"}
                />
                {validationErrors.status && (
                  <span id="status-error" className={styles.errorText} role="alert">
                    {validationErrors.status}
                  </span>
                )}
                <span id="status-help" className={styles.helpText}>
                  {formData.status.length}/500 characters
                </span>
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
                  {(uploadError || validationErrors.avatar) && (
                    <div className={styles.errorMessage} role="alert">
                      {uploadError || validationErrors.avatar}
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                    type="button"
                  >
                    Upload Profile Photo
                  </button>

                  {/* Remove Photo Button */}
                  <button
                    onClick={handleRemovePhoto}
                    className={styles.removeButton}
                    type="button"
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
                    aria-describedby="file-help"
                  />
                  
                  <span id="file-help" className={styles.helpText}>
                    Supported formats: JPG, PNG, GIF. Max size: 5MB. Min dimensions: 100x100px.
                  </span>
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
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isEditing || hasValidationErrors}
            type="button"
          >
            {isEditing ? 'Saving...' : 'Save changes'}
          </button>
        </footer>
      </div>
    </>
  );
};

export default EditProfileModal;