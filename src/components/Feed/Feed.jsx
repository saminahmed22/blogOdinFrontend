import { useEffect, useState, Fragment } from "react";
import { useOutletContext, useParams } from "react-router";

import styles from "./Feed.module.css";

// Componenets
import PostCard from "../postCard/PostCard";
import CategoryBar from "../CategoryBar/CategoryBar";

// API
import { fetchFeedContent } from "../../api/fetchFeedContent";

// Icons

import loadingIcon from "../../assets/icons/loading.svg";

export default function Feed() {
  const { category } = useParams();

  const [fetchStatus, setFetchStatus] = useState("fetching");

  let { feedPosts, setFeedPosts } = useOutletContext();

  useEffect(() => {
    const fetchFunc = async () => {
      if (fetchStatus !== "fetching") {
        setFetchStatus("fetching");
      }

      const fetchedPosts = await fetchFeedContent(category);

      setFeedPosts({
        status: fetchedPosts.status,
        posts: [...fetchedPosts.posts],
      });

      setFetchStatus("halt");
    };

    fetchFunc();
  }, [category]);

  const getHr = (index, arrLen, postID) => {
    if (index >= 0 && index < arrLen - 1) {
      return <hr key={`${postID}_hr`} className={styles.postCardSeparator} />;
    }
  };

  const getPostCards = (post, index, posts) => {
    return (
      <Fragment key={`Fragment_${post.id}`}>
        <PostCard key={post.id} post={post} />

        {getHr(index, posts.length, post.id)}
      </Fragment>
    );
  };

  const getFeedContent = () => {
    if (fetchStatus === "fetching") {
      return (
        <div className={styles.loadingText} key={"LoadingText"}>
          <img src={loadingIcon} alt="Loading icon" />
          <p>Loading posts</p>
        </div>
      );
    } else if (fetchStatus === "halt" && feedPosts.status) {
      if (feedPosts?.posts?.length) {
        return (
          <div className={styles.postList}>
            {feedPosts?.posts.map((post, index, posts) =>
              getPostCards(post, index, posts),
            )}
          </div>
        );
      }

      return <p className={styles.noPostText}>No posts to see here {`:(`}</p>;
    } else {
      return (
        <div className={styles.feedErrorMessage} key={"errorText"}>
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
