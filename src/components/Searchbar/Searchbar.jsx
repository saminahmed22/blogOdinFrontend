import styles from "./Searchbar.module.css";

// Hooks
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import SearchCard from "../SearchCard/SearchCard";
// Icons
import searchIcon from "../../assets/icons/search.svg";

// API
import { fetchSearchContent } from "../../api/postsAPI";

export default function Searchbar({ context }) {
  const navigate = useNavigate();

  const { searchQuery, setSearchQuery, searchPosts, setSearchPosts } = context;

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
    const handleSearchBoxFocusIn = (e) => {
      if (e.target.value.length > 1) {
        togglePreview("grid");
      }
    };

    const handleSearchBoxFocusOut = () => {
      if (!previewMouseOverRef.current) {
        togglePreview("none");
      }
    };

    const handleSearchBoxInput = (e) => {
      setSearchQuery(e.target.value);

      if (e.target.value.length < 1) {
        togglePreview("none");
      } else {
        togglePreview("grid");
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
  }, [setSearchQuery]);

  const handleSearchClick = (e) => {
    e.preventDefault();

    const query = encodeURIComponent(searchQuery);
    navigate(`/search?searchQuery=${query}`, { replace: true });
  };

  return (
    <div className={styles.searchbar}>
      <form className={styles.searchBoxForm} onSubmit={handleSearchClick}>
        <input
          className={`${styles.searchBox} searchBox`}
          type="search"
          placeholder="Search posts by title, description, or author"
          name="searchQuery"
          ref={searchBoxRef}
          aria-label="Search posts by title, description, or author"
          id="searchBox"
          defaultValue={searchQuery}
        />

        <button
          className={styles.searchButton}
          type="submit"
          popoverTarget="searchPreview"
          onClick={handleSearchClick}
          onSubmit={handleSearchClick}
        >
          <img src={searchIcon} alt="Search icon" />
        </button>
      </form>

      <div
        className={`${styles.searchPreview} searchPreview`}
        ref={searchPreviewRef}
      >
        <InfiniteScrollProvider
          Card={SearchCard}
          fetchFunction={fetchSearchContent}
          reInitializeFactor={searchQuery}
          contentState={searchPosts}
          setContentState={setSearchPosts}
          queryParams={{ query: searchQuery }}
          customParentRef={searchPreviewRef}
          initialDeny={true}
          options={{
            scrollTopBtn: false,
            cardsSeparator: false,
            customLoadingMessage: "Loading suggestions",
            customLoadingMoreMessage: "Loading more suggestions",
            customNoContentMessage: "Couldn't find any matching posts.",
            customErrorMessage: "Failed to suggest posts.",
            customRefetchFailMessage: "Failed to suggest more posts.",
          }}
        />
      </div>
    </div>
  );
}
