import React from "react";
import styles from "./SearchBar.module.scss";

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search QLU Recruiting"
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
