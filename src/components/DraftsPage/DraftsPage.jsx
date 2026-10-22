import stlyes from "./DraftsPage.module.css";

// Hooks
import { useOutletContext, useLocation } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { fetchUserDraftedPosts } from "../../api/postsAPI";

export default function DraftsPage() {
  const { feedPosts, setFeedPosts } = useOutletContext();

  const location = useLocation();

  return (
    <div className={stlyes.draftsPage} role="main">
      <h2 className={stlyes.heading}>Your drafts</h2>

      <InfiniteScrollProvider
        Card={PostCard}
        fetchFunction={fetchUserDraftedPosts}
        contentState={feedPosts}
        setContentState={setFeedPosts}
        reInitializeFactor={location}
        CardParams={{ isDraftPage: true }}
        options={{
          scrollTopBtn: false,
          cardsSeparator: true,
          lastCardStyles: { marginBottom: "50px" },
          customLoadingMessage: "Loading your drafted posts",
          customLoadingMoreMessage: "Loading more of your drafted posts",
          customNoContentMessage: "You have no drafted posts.",
          customErrorMessage: "Failed to load your drafted posts.",
          customRefetchFailMessage:
            "Failed to fetch more of your drafted posts.",
        }}
      />
    </div>
  );
}
