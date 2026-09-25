import styles from "./Searchbar.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";

// API
import { fetchSearchPreview } from "../../api/feathSearchPreview.js";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";

export default function Searchbar() {
  let [searchPreviewItems, setSearchPreviewItems] = useState({
    status: "fetching",
    posts: [],
  });

  const initialRun = useRef(true);
  useEffect(() => {
    if (initialRun.current) {
      initialRun.current = false;

      return;
    }

    const fetchFunc = async (searchQuery) => {
      const searchPreviews = await fetchSearchPreview(searchQuery);

      setSearchPreviewItems({
        status: searchPreviews.status,
        previewItems: searchPreviews.previewItems,
      });
    };

    const handleInput = async (event) => {
      const value = event.target.value;

      const valueLen = value.length;

      if (!valueLen || value[valueLen - 1] === " ") return;

      await fetchFunc(value);
    };

    const searchBox = document.querySelector(".searchBox");
    if (searchBox) {
      searchBox.addEventListener("input", handleInput);
    }
  }, []);

  const togglePreview = (e, force) => {
    const previewDiv = document.querySelector(".searchPreview");

    if (!previewDiv) return;

    if (force === "hide") {
      previewDiv.style.display = "none";

      return;
    }

    const hasValue = e.target.value.length >= 1;

    previewDiv.style.display = hasValue ? "flex" : "none";
  };

  const getPreviewCards = () => {
    if (searchPreviewItems.status === "fetching") {
      return <p className={styles.searchPreviewCard}>Loading suggestions...</p>;
    } else if (searchPreviewItems.status === "error") {
      return <p className={styles.searchPreviewCard}>Failed to fetch</p>;
    } else {
      const postArr = searchPreviewItems?.previewItems;

      if (postArr.length < 1) {
        return (
          <p className={styles.searchPreviewCard}>
            Didn't find any matching post
          </p>
        );
      } else {
        return (
          <div className={styles.previewListContainer}>
            {postArr.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className={styles.searchPreviewCard}
              >
                <p className={styles.searchPreviewTitle}>{post.title}</p>
                <p className={styles.searchPreviewDesc}>{post.description}</p>
              </Link>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div
      className={styles.searchbar}
      // onBlur={(e) => {
      //   togglePreview(e, "hide");
      // }}
    >
      <input
        className={`${styles.searchBox} searchBox`}
        type="search"
        placeholder="Search by title or author name"
        name="searchQuery"
        autoComplete={"off"}
        onChange={(e) => {
          togglePreview(e);
        }}
        onFocus={(e) => {
          togglePreview(e, "show");
        }}
      />
      <button
        className={styles.searchButton}
        type="submit"
        popoverTarget="searchPreview"
      >
        <img src={searchIcon} alt="Search icon" />
      </button>
      <div className={`${styles.searchPreview} searchPreview`}>
        {getPreviewCards()}
      </div>
    </div>
  );
}
