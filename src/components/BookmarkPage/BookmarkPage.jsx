import stlyes from "./BookmarkPage.module.css";

// Hooks
import { useOutletContext, useLocation } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { getBookmark } from "../../api/postsAPI";

export default function BookmarkPage() {
  const { feedPosts, setFeedPosts } = useOutletContext();

  const location = useLocation();

  return (
    <div className={stlyes.bookmarkPage} role="main">
      <h2 className={stlyes.heading}>Your bookmarks</h2>

      <InfiniteScrollProvider
        Card={PostCard}
        fetchFunction={getBookmark}
        contentState={feedPosts}
        setContentState={setFeedPosts}
        reInitializeFactor={location}
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
