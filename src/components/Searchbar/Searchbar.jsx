import styles from "./Searchbar.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";

export default function Searchbar() {
  return (
    <div className={styles.searchbar}>
      <input
        className={`${styles.searchBox} searchBox`}
        type="search"
        placeholder="Search by title or author name"
        name="searchQuery"
      />
      <button
        className={styles.searchButton}
        type="submit"
        popoverTarget="searchPreview"
      >
        <img src={searchIcon} alt="Search icon" />
      </button>
    </div>
  );
}
