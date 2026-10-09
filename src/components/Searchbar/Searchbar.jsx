import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";

import styles from "./Searchbar.module.css";

// Icons
import searchIcon from "../../assets/icons/search.svg";
import loadingIcon from "../../assets/icons/loading.svg";

// API
import { fetchSearchContent } from "../../api/fetchSearchContent.js";

export default function Searchbar({ context }) {
  const [fetchStatus, setFetchStatus] = useState("halt");

  const { searchPosts, setSearchPosts } = context;

  const searchBoxRef = useRef();
  const searchPreviewRef = useRef();

  // Preview event handlers
  const previewMouseOverRef = useRef(false);
  useEffect(() => {
    const searchRef = searchBoxRef.current;
    const preveiwRef = searchPreviewRef.current;

    const togglePreview = (mode) => {
      preveiwRef.style.display = mode;
    };

    // Event handlers for the searchbar
    const handleSearchBoxFocusIn = () => {
      togglePreview("flex");
    };

    const handleSearchBoxFocusOut = () => {
      if (!previewMouseOverRef.current) {
        togglePreview("none");
      }
    };

    const handleSearchBoxInput = (e) => {
      if (e.target.value.length < 1) {
        setFetchStatus("halt");
      } else {
        togglePreview("flex");

        setFetchStatus("fetching");
      }
    };

    // Event handlers for the preview
    const handlePreviewMOver = () => {
      if (!previewMouseOverRef.current) {
        previewMouseOverRef.current = true;
      }
    };

    const handlePreviewMOut = () => {
      if (previewMouseOverRef.current) {
        previewMouseOverRef.current = false;
      }
    };

    const handlePreviewClick = () => {
      togglePreview("none");
    };

    // Attaching the event listeners
    searchRef.addEventListener("focusin", handleSearchBoxFocusIn);
    searchRef.addEventListener("focusout", handleSearchBoxFocusOut);
    searchRef.addEventListener("input", handleSearchBoxInput);

    preveiwRef.addEventListener("mouseover", handlePreviewMOver);
    preveiwRef.addEventListener("mouseleave", handlePreviewMOut);
    preveiwRef.addEventListener("click", handlePreviewClick);

    // removing the event listeners
    return () => {
      searchRef.removeEventListener("focusin", handleSearchBoxFocusIn);
      searchRef.removeEventListener("focusout", handleSearchBoxFocusOut);
      searchRef.removeEventListener("input", handleSearchBoxInput);

      preveiwRef.removeEventListener("mouseover", handlePreviewMOver);
      preveiwRef.removeEventListener("mouseleave", handlePreviewMOut);
      preveiwRef.removeEventListener("click", handlePreviewClick);
    };
  }, []);

  const updateSearchPostsState = useCallback(
    (mode, result) => {
      const buildingObj = {
        fetchConfig: {
          quantity: 10,
          hasMore: false,
          count: 0,
          amount: 0,
          cursor: undefined,
        },

        posts: {},
      };

      // update fetch config options
      buildingObj.fetchConfig.count = result.count;

      buildingObj.fetchConfig.amount =
        mode === "onChange"
          ? result.posts.length
          : searchPosts.fetchConfig.amount + result.posts.length;

      buildingObj.fetchConfig.hasMore =
        result.count > buildingObj.fetchConfig.amount;

      buildingObj.fetchConfig.cursor = buildingObj.fetchConfig.hasMore
        ? result.posts[result.posts.length - 1].id
        : undefined;

      // Populate posts object
      if (mode !== "onChange") {
        buildingObj.posts = { ...searchPosts.posts };
      }

      for (const post of result.posts) {
        buildingObj.posts[post.id] = post;
      }

      setSearchPosts(buildingObj);
    },
    [searchPosts.fetchConfig.amount, searchPosts.posts, setSearchPosts],
  );

  const fetchingOnReqRef = useRef(false);
  const fetchPosts = useCallback(
    async (mode = "request") => {
      const query = searchBoxRef.current.value;

      if (!query.length) return;

      const params = {
        query,
        quantity: searchPosts.fetchConfig.quantity,
        cursor:
          mode === "onChange" ? undefined : searchPosts.fetchConfig.cursor,
      };

      const result = await fetchSearchContent(params);

      if (result.success) {
        fetchingOnReqRef.current = false;
        updateSearchPostsState(mode, result);
        setFetchStatus("success");
      } else {
        setFetchStatus("error");
      }
    },
    [
      searchPosts.fetchConfig.quantity,
      searchPosts.fetchConfig.cursor,
      updateSearchPostsState,
    ],
  );

  // Refetch on scroll handler
  useEffect(() => {
    const prevRef = searchPreviewRef.current;

    if (!prevRef) return;

    const handleScroll = async () => {
      const scrollTop = prevRef.scrollTop;
      const scrollHeight = prevRef.scrollHeight;
      const clientHeight = prevRef.clientHeight;

      const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (
        percentage >= 70 &&
        searchPosts.fetchConfig.hasMore &&
        !fetchingOnReqRef.current
      ) {
        fetchingOnReqRef.current = true;

        fetchPosts();
      }
    };

    prevRef.addEventListener("scroll", handleScroll);

    return () => {
      prevRef.removeEventListener("scroll", handleScroll);
    };
  }, [fetchPosts, searchPosts]);

  const getPreviewCards = () => {
    switch (fetchStatus) {
      case "halt":
        return (
          <div className={styles.loadingMessage}>
            <p>Type something to get suggestions.</p>
          </div>
        );

      case "fetching":
        return (
          <div className={styles.loadingMessage}>
            <img src={loadingIcon} alt="Loading icon" />
            <p>Loading suggestions</p>
          </div>
        );

      case "error":
        return <p className={styles.searchPreviewCard}>Failed to fetch.</p>;
    }

    const posts = searchPosts?.posts;

    if (Object.keys(posts).length < 1) {
      return (
        <p className={styles.searchPreviewCard}>
          Didn't find any matching post.
        </p>
      );
    } else {
      return (
        <div className={styles.previewListContainer}>
          {Object.entries(posts).map(([id, post]) => (
            <Link
              key={id}
              to={`/posts/${id}`}
              className={styles.searchPreviewCard}
            >
              <p className={styles.searchPreviewTitle}>{post.title}</p>
              <div className={styles.PreviewCardSecondary}>
                <p
                  className={styles.searchPreviewAuthor}
                >{`${post.author.firstName} ${post.author.lastName}:`}</p>
                <p className={styles.searchPreviewDesc}>{post.description}</p>
              </div>
            </Link>
          ))}

          {searchPosts.fetchConfig.hasMore && (
            <div className={styles.loadingMessage}>
              <img src={loadingIcon} alt="Loading icon" />
              <p>Loading more suggestions</p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.searchbar}>
      <input
        className={`${styles.searchBox} searchBox`}
        type="search"
        placeholder="Search by title, description or author name"
        name="searchQuery"
        ref={searchBoxRef}
        aria-label="Search by title, description or author name"
        onChange={() => {
          fetchPosts("onChange");
        }}
      />

      <button
        className={styles.searchButton}
        type="submit"
        popoverTarget="searchPreview"
      >
        <img src={searchIcon} alt="Search icon" />
      </button>

      <div
        className={`${styles.searchPreview} searchPreview`}
        ref={searchPreviewRef}
      >
        {getPreviewCards()}
      </div>
    </div>
  );
}
