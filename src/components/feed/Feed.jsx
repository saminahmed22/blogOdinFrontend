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
    fetchFeedContent(10).then((response) => {
      setFeedContent({ status: response.status, posts: response.posts });
    });
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
    } else if (feedContent.status === 200) {
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
    <div className={styles.feed}>
      <CategoryBar />
      {getFeedContent()}
    </div>
  );
}
