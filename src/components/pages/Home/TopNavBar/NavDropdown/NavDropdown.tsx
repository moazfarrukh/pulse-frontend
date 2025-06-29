// components/DropdownLinkText/DropdownLinkText.tsx
import React, { useState, useRef, } from "react";
import Link from "next/link";
import styles from "./NavDropdown.module.scss";

import DropdownIcon from "@/svgs/icons/DropdownIcon";

interface DropdownOption {
  href: string;
  content: string;
}

interface NavDropdownProps {
  content: string;
  options: DropdownOption[];
  className?: string;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ 
  content, 
  options, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdown} ${className || ''}`} ref={dropdownRef}>
    <span 
      className={styles.dropdownTrigger}
      onClick={toggleDropdown}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span className={styles.dropdownText}>{content}</span>
      <DropdownIcon className={`${styles.dropdownIcon} ${isOpen ? styles.open : ''}`} />
    </span>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownContent}>
            {options.map((option, index) => (
              <Link
                key={index}
                href={option.href}
                className={styles.dropdownItem}
                onClick={closeDropdown}
              >
                {option.content}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;