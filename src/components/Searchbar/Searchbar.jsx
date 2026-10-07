import { useEffect, useRef } from "react";
import { Link } from "react-router";

import styles from "./Searchbar.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";
import loadingIcon from "../../assets/icons/loading.svg";

// API
import { fetchSearchPreview } from "../../api/feathSearchPreview.js";

export default function Searchbar({ context }) {
  let [searchPosts, setSearchPosts] = context;

  const initialRun = useRef(true);
  const searchBoxRef = useRef();
  useEffect(() => {
    if (initialRun.current) {
      initialRun.current = false;

      return;
    }

    const fetchFunc = async (searchQuery) => {
      const result = await fetchSearchPreview(searchQuery);

      setSearchPosts(result);
    };

    const handleInput = async (event) => {
      const value = event.target.value;

      const valueLen = value.length;

      if (!valueLen || value[valueLen - 1] === " ") return;

      await fetchFunc(value);
    };

    if (searchBoxRef.current) {
      searchBoxRef.current.addEventListener("input", handleInput);
    }
  }, [setSearchPosts]);

  const previewDiv = useRef({ mouseover: false, visible: false });
  useEffect(() => {
    const searchPreview = document.querySelector(".searchPreview");

    const togglePreview = (mode) => {
      searchPreview.style.display = mode;
    };

    searchPreview.addEventListener("mouseover", () => {
      if (!previewDiv.current.mouseover) {
        previewDiv.current.mouseover = true;
      }
    });

    searchPreview.addEventListener("mouseleave", () => {
      if (previewDiv.current.mouseover) {
        previewDiv.current.mouseover = false;
      }
    });

    searchPreview.addEventListener("click", () => {
      togglePreview("none");
    });

    searchBoxRef.current.addEventListener("focusin", (e) => {
      if (!previewDiv.current.visible && e.target.value) {
        togglePreview("flex");

        previewDiv.current.visible = true;
      }
    });

    searchBoxRef.current.addEventListener("focusout", () => {
      if (previewDiv.current.visible && !previewDiv.current.mouseover) {
        togglePreview("none");

        previewDiv.current.visible = false;
      }
    });

    searchBoxRef.current.addEventListener("input", (e) => {
      if (e.target.value.length < 1) {
        togglePreview("none");

        previewDiv.current.mouseover = false;
        previewDiv.current.focus = false;
        previewDiv.current.visible = false;
      } else {
        if (!previewDiv.current.visible) {
          togglePreview("flex");

          previewDiv.current.visible = true;
        }
      }
    });
  }, []);

  const getPreviewCards = () => {
    if (searchPosts.status === "fetching") {
      return (
        <div className={styles.loadingMessage}>
          <img src={loadingIcon} alt="Loading icon" />
          <p>Loading suggestions</p>
        </div>
      );
    } else if (searchPosts.status === "error") {
      return <p className={styles.searchPreviewCard}>Failed to fetch</p>;
    } else {
      const postArr = searchPosts?.posts;

      if (!postArr) return;

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
    <div className={styles.searchbar}>
      <input
        className={`${styles.searchBox} searchBox`}
        type="search"
        placeholder="Search by title or author name"
        name="searchQuery"
        ref={searchBoxRef}
        aria-label="Search"
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
