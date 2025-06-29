import React from 'react';
import ContactItem from '../ContactItem';
import { User } from '@/types';
import styles from './ContactItemList.module.scss';

interface ContactItemListProps {
    user: User;
}

const ContactItemList: React.FC<ContactItemListProps> = ({
    user,
}) => {
    // Define contact items to display
    
    const contactItems = [
        { label: "Email Address", value: user.email },
        { label: "Phone Number", value: user.phone || "" },
        // Add more contact items as needed
    ].filter(item => item.value); // Only show items with values

    return (
        <section className={styles.section}>
            <div className={styles.contactItemHeader}>
                <ContactItem label="Email Address" value={user.email} />
            </div>
            
            {contactItems.slice(1).map((item, index) => (
                <ContactItem 
                    key={`contact-item-${index}`}
                    label={item.label} 
                    value={item.value} 
                />  
            ))}
            
        </section>
    );
};

export default ContactItemList;