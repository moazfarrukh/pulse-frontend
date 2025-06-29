import React from "react";
import styles from "./AddItem.module.scss";
import AddIcon from "@/svgs/icons/AddIcon";

interface AddItemProps {
  onClick?: () => void;
}

const AddItem: React.FC<AddItemProps> = ({ onClick }) => {
    return (
        <div className={styles.container} onClick={onClick}>
            <AddIcon />
        </div>
    );
};

export default AddItem;