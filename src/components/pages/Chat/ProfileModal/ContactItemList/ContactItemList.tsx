import React from 'react';
import ContactItem from '../ContactItem';
import { AddIcon } from '@/svgs/Icons';
import { User } from '@/types';
import styles from './ContactItemList.module.scss';

interface ContactItemListProps {
    user: User;
    onEdit?: () => void;
    onAddInformation?: () => void;
}

const ContactItemList: React.FC<ContactItemListProps> = ({
    user,
    onEdit,
    onAddInformation,
}) => {
    // Define contact items to display
    const contactItems = [
        { label: "Email Address", value: user.email },
        { label: "Phone Number", value: user.phone || "03248080521" },
        // Add more contact items as needed
    ].filter(item => item.value); // Only show items with values

    return (
        <section className={styles.section}>
            <div className={styles.contactItemHeader}>
                <ContactItem label="Email Address" value={user.email} />
                <button
                    className={styles.editButton}
                    onClick={onEdit}
                    aria-label="Edit Contacts"
                >
                    Edit
                </button>
            </div>
            
            {contactItems.slice(1).map((item, index) => (
                <ContactItem 
                    key={`contact-item-${index}`}
                    label={item.label} 
                    value={item.value} 
                />  
            ))}
            
            <button
                className={styles.addButton}
                onClick={onAddInformation}
                aria-label="Add more contact information"
            >
                <AddIcon />
                <span>Add Information</span>
            </button>
        </section>
    );
};

export default ContactItemList;