import React, { useState, useCallback, useEffect } from 'react';
import { XIcon } from '@/svgs/Icons';
import styles from './EditModal.module.scss';

interface ContactField {
  id: string;
  label: string;
  value: string;
  type: 'email' | 'tel' | 'text';z
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: ContactField[]) => void;
  contactFields: ContactField[];
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contactFields,
}) => {
  const [fields, setFields] = useState<ContactField[]>(contactFields);

  useEffect(() => {
    setFields(contactFields);
  }, [contactFields]);

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
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleFieldChange = useCallback((id: string, value: string) => {
    setFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  }, []);

  const handleSave = useCallback(() => {
    onSave(fields);
    onClose();
  }, [fields, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setFields(contactFields); // Reset to original values
    onClose();
  }, [contactFields, onClose]);

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
        className={`${styles.modal} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-contact-modal-title"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 id="edit-contact-modal-title" className={styles.title}>
            Edit contact information
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close edit contact modal"
          >
            <XIcon />
          </button>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <form className={styles.form}>
            {fields.map((field) => (
              <div key={field.id} className={styles.fieldGroup}>
                <label htmlFor={field.id} className={styles.label}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={styles.input}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
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
            onClick={handleSave}
            className={styles.saveButton}
            type="button"
          >
            Save changes
          </button>
        </footer>
      </div>
    </>
  );
};

export default EditModal;