import React, { useState, useCallback } from "react";
import styles from "./CreateChatModal.module.scss";
import { XIcon } from "@/svgs/icons";
import useCreateChat from "@/hooks/mutation/useCreateChat";
import useGetUsers from "@/hooks/query/userGetusers";
import useCurrentUser from "@/hooks/query/useCurrentUser";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "group" | "dm";
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    userIds: [] as string[],
  });
  const [showNameError, setShowNameError] = useState(false);
  const [showUserError, setShowUserError] = useState(false);
  const mutationCreateChat = useCreateChat();
  const { data: users } = useGetUsers();
  const { data: currentUser } = useCurrentUser();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === "name" && showNameError) {
      setShowNameError(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (type === "group") {
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, userIds: selected }));
    } else {
      setFormData((prev) => ({
        ...prev,
        userIds: e.target.value ? [e.target.value] : [],
      }));
    }
  };

  const handleCreate = () => {
    // Check for group name validation
    if (type === "group" && !formData.name.trim()) {
      setShowNameError(true);
      return;
    }
    // Check for user selection validation
    if (formData.userIds.length === 0) {
      setShowUserError(true);
      return;
    }

    if (
      (type === "group" &&
        formData.name.trim() &&
        formData.userIds.length > 0) ||
      (type === "dm" && formData.userIds.length === 1)
    ) {
      mutationCreateChat.mutate({
        name: type === "group" ? formData.name : undefined,
        member_ids: formData.userIds.map((id) => Number(id)),
        is_group: type === "group",
      });
      // Reset form data after creation
      setFormData({ name: "", userIds: [] });
      setShowNameError(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", userIds: [] });
    setShowNameError(false);
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
        aria-labelledby="create-group-modal-title"
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 id="create-group-modal-title" className={styles.title}>
            {type === "group" ? "Create New Group" : "Start New DM"}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close create group modal"
          >
            <XIcon />
          </button>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <form className={styles.formColumn}>
            {/* Group Name (only for group) */}
            {type === "group" && (
              <div className={styles.inputGroup}>
                <label htmlFor="group-name" className={styles.label}>
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`${styles.input} ${showNameError ? styles.inputError : ""}`}
                  placeholder="Enter group name"
                  autoFocus
                />
                {showNameError && (
                  <span className={styles.errorText}>
                    Group name is required
                  </span>
                )}
              </div>
            )}
            {/* Users Dropdown */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                {type === "group" ? "Add Users" : "Select User"}
              </label>
              <select
                className={`${styles.input} ${showUserError ? styles.inputError : ""}`}
                value={
                  type === "group"
                    ? formData.userIds
                    : formData.userIds[0] || ""
                }
                onChange={handleUserChange}
                multiple={type === "group"}
                size={
                  type === "group" ? Math.min(users?.length || 0, 5) : undefined
                }
              >
                {type === "dm" && (
                  <option value="" disabled>
                    Select a user
                  </option>
                )}
                {users
                  ?.filter((user) => user.id !== currentUser?.id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.display_name} ({user.email})
                    </option>
                  ))}
              </select>
              {showUserError && (
                <span className={styles.errorText}>
                  {type === "group"
                    ? "At least one user is required"
                    : "Please select a user"}
                </span>
              )}
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <button
            onClick={handleCancel}
            className={styles.cancelButton}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={styles.saveButton}
            type="button"
          >
            {type === "group" ? "Create Group" : "Start DM"}
          </button>
        </footer>
      </div>
    </>
  );
};

export default CreateChatModal;