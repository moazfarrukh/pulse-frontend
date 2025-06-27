import React from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
