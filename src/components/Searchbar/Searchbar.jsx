import { useEffect, useRef } from "react";
import { Link } from "react-router";

import styles from "./Searchbar.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";

// API
import { fetchSearchPreview } from "../../api/feathSearchPreview.js";

export default function Searchbar({ context }) {
  let [searchPosts, setSearchPosts] = context;

  const initialRun = useRef(true);
  useEffect(() => {
    if (initialRun.current) {
      initialRun.current = false;

      return;
    }

    const fetchFunc = async (searchQuery) => {
      const searchPreviews = await fetchSearchPreview(searchQuery);

      setSearchPosts({
        status: searchPreviews.status,
        posts: [...searchPreviews.previewItems],
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
  }, [setSearchPosts]);

  const previewDiv = useRef({ mouseover: false, visible: false });
  useEffect(() => {
    const searchBox = document.querySelector(".searchBox");
    const searchPreview = document.querySelector(".searchPreview");

    const togglePreview = (mode) => {
      searchPreview.style.display = mode;
    };

    searchPreview.addEventListener("mouseover", () => {
      if (!previewDiv.current.mouseover) {
        previewDiv.current.mouseover = true;

        console.log("Mouse Over");
      }
    });

    searchPreview.addEventListener("mouseleave", () => {
      if (previewDiv.current.mouseover) {
        previewDiv.current.mouseover = false;

        console.log("Mouse Leave");
      }
    });

    searchPreview.addEventListener("click", () => {
      togglePreview("none");
    });

    searchBox.addEventListener("focusin", (e) => {
      if (!previewDiv.current.visible && e.target.value) {
        togglePreview("flex");

        previewDiv.current.visible = true;
      }
    });

    searchBox.addEventListener("focusout", () => {
      if (previewDiv.current.visible && !previewDiv.current.mouseover) {
        togglePreview("none");

        previewDiv.current.visible = false;
      }
    });

    searchBox.addEventListener("input", (e) => {
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
      return <p className={styles.searchPreviewCard}>Loading suggestions...</p>;
    } else if (searchPosts.status === "error") {
      return <p className={styles.searchPreviewCard}>Failed to fetch</p>;
    } else {
      const postArr = searchPosts?.posts;

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
