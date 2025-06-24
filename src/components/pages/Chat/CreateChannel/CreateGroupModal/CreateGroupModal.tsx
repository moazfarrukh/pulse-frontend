import React, { useState, useCallback } from "react";
import styles from "./CreateGroupModal.module.scss";
import { XIcon } from "@/svgs/Icons";
import { User } from "@/types";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name?: string; userIds: string[] }) => void;
  type: "group" | "dm";
}

// Mock users for dropdown
const mockUsers: User[] = [
  { id: "1", username: "alice", display_name: "Alice", email: "alice@email.com" },
  { id: "2", username: "bob", display_name: "Bob", email: "bob@email.com" },
  { id: "3", username: "charlie", display_name: "Charlie", email: "charlie@email.com" },
  { id: "4", username: "david", display_name: "David", email: "david@email.com" },
  { id: "5", username: "eve", display_name: "Eve", email: "eve@email.com" },
];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  type,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    userIds: [] as string[],
  });

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (type === "group") {
      const selected = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, userIds: selected }));
    } else {
      setFormData(prev => ({ ...prev, userIds: e.target.value ? [e.target.value] : [] }));
    }
  };

  const handleCreate = () => {
    if ((type === "group" && formData.name.trim() && formData.userIds.length > 0) ||
        (type === "dm" && formData.userIds.length === 1)) {
      onCreate(type === "group" ? { name: formData.name, userIds: formData.userIds } : { userIds: formData.userIds });
      setFormData({ name: "", userIds: [] });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", userIds: [] });
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
        onKeyDown={handleKeyDown}
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
                  className={styles.input}
                  placeholder="Enter group name"
                  autoFocus
                />
              </div>
            )}
            {/* Users Dropdown */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>{type === "group" ? "Add Users" : "Select User"}</label>
              <select
                className={styles.input}
                value={type === "group" ? formData.userIds : formData.userIds[0] || ""}
                onChange={handleUserChange}
                multiple={type === "group"}
                size={type === "group" ? Math.min(mockUsers.length, 5) : undefined}
              >
                {type === "dm" && <option value="" disabled>Select a user</option>}
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.display_name} ({user.email})
                  </option>
                ))}
              </select>
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
            disabled={
              (type === "group" && (!formData.name.trim() || formData.userIds.length === 0)) ||
              (type === "dm" && formData.userIds.length !== 1)
            }
          >
            {type === "group" ? "Create Group" : "Start DM"}
          </button>
        </footer>
      </div>
    </>
  );
};

export default CreateGroupModal;