import styles from './ContactItem.module.scss';
interface ContactItemProps {
  label: string;
  value: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ label, value}) => (
  <div className={styles.contactItem}>
    <div className={styles.contactInfo}>
      <div className={styles.contactDetails}>
        <p className={styles.contactLabel}>{label}</p>
        <p className={styles.contactValue}>{value}</p>
      </div>
    </div>

  </div>
);

export default ContactItem;