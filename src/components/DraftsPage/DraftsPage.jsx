import stlyes from "./DraftsPage.module.css";

// Hooks
import { useState } from "react";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { fetchUserDraftedPosts } from "../../api/postsAPI";

export default function DraftsPage() {
  const [draftPosts, setDraftPosts] = useState({
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
    <div className={stlyes.draftsPage} role="main">
      <h2 className={stlyes.heading}>Your drafts</h2>

      <InfiniteScrollProvider
        Card={PostCard}
        fetchFunction={fetchUserDraftedPosts}
        contentState={draftPosts}
        setContentState={setDraftPosts}
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
