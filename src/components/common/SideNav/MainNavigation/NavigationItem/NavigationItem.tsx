import React from "react";
import styles from "./NavigationItem.module.scss";

export interface NavigationItemProps {
  icon: React.ReactNode;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
  badge?: number | string;
  disabled?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
    icon,
    label,
    isActive = false,
    onClick,
    className = '',
    href,
    badge,
    disabled = false,
}) => {
    const itemClasses = [
        styles.navigationItem,
        isActive ? styles.active : '',
        disabled ? styles.disabled : '',
        className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        onClick?.();
    };

    const content = (
        <>
            <div className={styles.iconContainer}>
                {icon}
                {badge && (
                    <span className={styles.badge}>
                        {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                    </span>
                )}
            </div>
            {label && <span className={styles.label}>{label}</span>}
        </>
    );

    if (href && !disabled) {
        return (
            <a
                href={href}
                className={itemClasses}
                onClick={handleClick}
                aria-label={label}
                role="menuitem"
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={itemClasses}
            onClick={handleClick}
            disabled={disabled}
            aria-label={label}
            role="menuitem"
            type="button"
        >
            {content}
        </button>
    );
};

export default NavigationItem;