import stlyes from "./SearchPage.module.css";

// Hooks
import { useOutletContext } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { fetchSearchContent } from "../../api/postsAPI";

export default function SearchPage() {
  const { searchQuery, searchPosts, setSearchPosts } = useOutletContext();

  return (
    <div
      className={
        searchQuery.length < 1 ? stlyes.searchPageEmpty : stlyes.searchPage
      }
      role="main"
    >
      {searchQuery.length < 1 ? (
        <p className={stlyes.noSearchText}>
          Type something on the searchbar to see results
        </p>
      ) : (
        <>
          <h2 className={stlyes.heading}>
            Search results for: <span>{searchQuery}</span>
          </h2>

          <InfiniteScrollProvider
            Card={PostCard}
            fetchFunction={fetchSearchContent}
            contentState={searchPosts}
            setContentState={setSearchPosts}
            reInitializeFactor={searchQuery}
            options={{
              scrollTopBtn: false,
              cardsSeparator: true,
              lastCardStyles: { marginBottom: "50px" },
              customLoadingMessage: "Loading matching results",
              customLoadingMoreMessage: "Loading more matching results",
              customNoContentMessage: "No match found.",
              customErrorMessage: "Failed to do the search.",
              customRefetchFailMessage:
                "Failed to fetch more matching results.",
            }}
          />
        </>
      )}
    </div>
  );
}
