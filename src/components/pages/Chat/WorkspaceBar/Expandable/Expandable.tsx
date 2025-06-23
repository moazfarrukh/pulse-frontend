"use client";
import React, { useState } from "react";
import styles from "./Expandable.module.scss";
import ChevronIcon from "@/svgs/Icons/ChevronIcon";

interface ExpandableProps {
    children?: React.ReactNode;
    label?: string;
    className?: string;
    defaultExpanded?: boolean;
}

const Expandable: React.FC<ExpandableProps> = ({ 
    children, 
    label = "Groups", 
    className,
    defaultExpanded = false 
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleToggle = () => setExpanded((prev) => !prev);

    return (
        <div className={className}>
            <div className={styles.expandable} onClick={handleToggle}>
                <ChevronIcon className={expanded ? styles.chevronDown : styles.chevron} />
                <span>{label}</span>
            </div>
            {expanded && (
                <div className={styles.expandableContent}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default Expandable;