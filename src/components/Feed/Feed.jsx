import styles from "./Feed.module.css";

// Hooks
import { useOutletContext, useParams } from "react-router";

// Componenets
import PostCard from "../postCard/PostCard";
import CategoryBar from "../CategoryBar/CategoryBar";
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";

// API
import { fetchFeedContent } from "../../api/postsAPI";

export default function Feed() {
  const { category } = useParams();

  const { feedPosts, setFeedPosts } = useOutletContext();

  return (
    <div className={styles.feed} role={"main"}>
      <CategoryBar />
      <InfiniteScrollProvider
        Card={PostCard}
        fetchFunction={fetchFeedContent}
        reInitializeFactor={category}
        contentState={feedPosts}
        setContentState={setFeedPosts}
        queryParams={{ categoryId: category }}
        options={{
          scrollTopBtn: true,
          cardsSeparator: true,
          customLoadingMessage: "Loading posts",
          customLoadingMoreMessage: "Loading more posts",
          customNoContentMessage: "No posts to see here. :(",
          customErrorMessage: "Failed to load posts.",
          customRefetchFailMessage: "Failed to fetch more posts.",
        }}
      />
    </div>
  );
}
