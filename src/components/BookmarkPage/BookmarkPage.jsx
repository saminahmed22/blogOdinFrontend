import stlyes from "./BookmarkPage.module.css";

// Hooks
import { useState } from "react";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { getBookmark } from "../../api/postsAPI";

export default function BookmarkPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState({
    status: "fetching",

    currentReInitializeFactorValue: null,

    scrollPosition: 0,

    config: {
      initial: true,

      quantity: 10,

      totalContentFetched: 0,

      hasMore: false,
      cursor: undefined,
    },

    content: {},
  });

  return (
    <div className={stlyes.bookmarkPage} role="main">
      <h2 className={stlyes.heading}>Your bookmarks</h2>

      <InfiniteScrollProvider
        Card={PostCard}
        fetchFunction={getBookmark}
        contentState={bookmarkedPosts}
        setContentState={setBookmarkedPosts}
        CardParams={{ isBookmarkPage: true }}
        options={{
          scrollTopBtn: false,
          cardsSeparator: true,
          lastCardStyles: { marginBottom: "50px" },
          customLoadingMessage: "Loading your bookmarks",
          customLoadingMoreMessage: "Loading more of your bookmarks",
          customNoContentMessage: "You haven't bookmarked any posts yet.",
          customErrorMessage: "Failed to load your bookmarks.",
          customRefetchFailMessage:
            "Failed to fetch more of your bookmarked posts.",
        }}
      />
    </div>
  );
}
