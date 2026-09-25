import { useState, useEffect } from "react";

import styles from "./Feed.module.css";

// Componenets
import PostCard from "../postCard/PostCard";
import CategoryBar from "../CategoryBar/CategoryBar";

// API
import { fetchFeedContent } from "../../api/fetchFeedContent";

export default function Feed() {
  let [feedContent, setFeedContent] = useState({
    status: "fetching",
    posts: [],
  });

  useEffect(() => {
    const fetchFunc = async () => {
      const fetchedPosts = await fetchFeedContent(10);

      setFeedContent({
        status: fetchedPosts.status,
        posts: [...fetchedPosts.posts],
      });
    };

    fetchFunc();
  }, []);

  const getFeedContent = () => {
    if (feedContent.status === "fetching") {
      return (
        <>
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </>
      );
    } else if (feedContent.status) {
      return (
        <div className={styles.postList}>
          {feedContent.posts.map((post) => (
            <PostCard key={post.id} loading={false} postContent={post} />
          ))}
        </div>
      );
    } else {
      return (
        <div className={styles.feedErrorMessage} data-testid="feedErrorMessage">
          An error occured. Please try again later.
        </div>
      );
    }
  };

  return (
    <div className={styles.feed} role={"main"}>
      <CategoryBar />
      {getFeedContent()}
    </div>
  );
}
