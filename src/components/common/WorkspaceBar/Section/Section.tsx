import React from "react";
import styles from "./Section.module.scss";
interface SectionProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    className?: string;
}
const Section: React.FC<SectionProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
    icon, 
    label, 
    active = false, 
    className = '', 
    onClick,
    ...props 
}) => {
    return (
        <div
            className={`${active ? styles.activeSection : styles.section} ${className}`}
            onClick={onClick}
            {...props}
        >
            <span className={styles.icon}>{icon}</span>
            <span>{label}</span>
        </div>
    );
};

export default Section;