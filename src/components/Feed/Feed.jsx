import { useEffect, useState, Fragment, useRef, useCallback } from "react";
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
  const feedRef = useRef();

  const { category } = useParams();

  const [fetchStatus, setFetchStatus] = useState("fetching");

  let { feedPosts, setFeedPosts } = useOutletContext();

  const feedPostsRef = useRef(feedPosts);
  const updateFeedPostsState = useCallback(
    (mode, result) => {
      const buildingObj = {
        fetchConfig: {
          quantity: 10,
          hasMore: false,
          count: 0,
          amount: 0,
          cursor: undefined,
        },

        posts: {},
      };

      // update fetch config options

      buildingObj.fetchConfig.count = result.count;

      buildingObj.fetchConfig.amount =
        mode === "initial"
          ? result.posts.length
          : feedPostsRef.current.fetchConfig.amount + result.posts.length;

      buildingObj.fetchConfig.hasMore =
        result.count > buildingObj.fetchConfig.amount;

      buildingObj.fetchConfig.cursor = buildingObj.fetchConfig.hasMore
        ? result.posts[result.posts.length - 1].id
        : undefined;

      // Populate posts object
      if (mode !== "initial") {
        buildingObj.posts = { ...feedPostsRef.current.posts };
      }

      for (const post of result.posts) {
        buildingObj.posts[post.id] = post;
      }

      feedPostsRef.current = buildingObj;
      setFeedPosts(buildingObj);
    },
    [setFeedPosts],
  );

  const fetchingOnReqRef = useRef(false);
  const fetchPosts = useCallback(
    async (mode = "request") => {
      const params = {
        categoryId: category,
        quantity: feedPostsRef.current.fetchConfig.quantity,
        cursor:
          mode === "initial"
            ? undefined
            : feedPostsRef.current.fetchConfig.cursor,
      };

      const result = await fetchFeedContent(params);

      if (result.success) {
        fetchingOnReqRef.current = false;
        updateFeedPostsState(mode, result);
        setFetchStatus("success");
      } else {
        setFetchStatus("error");
      }
    },
    [category, updateFeedPostsState],
  );

  // Initial Post fetch
  useEffect(() => {
    const fetchFunc = async () => {
      fetchPosts("initial");
    };

    fetchFunc();
  }, [fetchPosts, category]);

  // Refetch on scroll handler
  const postListRef = useRef();
  useEffect(() => {
    const postListElemRef = postListRef.current;

    if (!postListElemRef) return;

    const handleScroll = async () => {
      const scrollTop = postListElemRef.scrollTop;
      const scrollHeight = postListElemRef.scrollHeight;
      const clientHeight = postListElemRef.clientHeight;

      const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (
        percentage >= 70 &&
        feedPosts.fetchConfig.hasMore &&
        !fetchingOnReqRef.current
      ) {
        fetchingOnReqRef.current = true;
        fetchPosts();
      }
    };

    postListElemRef.addEventListener("scroll", handleScroll);

    return () => {
      postListElemRef.removeEventListener("scroll", handleScroll);
    };
  }, [fetchPosts, feedPosts]);

  const getHr = (index, arrLen, postID) => {
    if (index >= 0 && index < arrLen - 1) {
      return <hr key={`${postID}_hr`} className={styles.postCardSeparator} />;
    }
  };

  const getPostCard = (post, index, posts) => {
    return (
      <Fragment key={`Fragment_${post.id}`}>
        <PostCard key={post.id} post={post} />

        {getHr(index, posts.length, post.id)}
      </Fragment>
    );
  };

  const getFeedContent = () => {
    switch (fetchStatus) {
      case "fetching":
        return (
          <div className={styles.loadingText} key={"LoadingText"}>
            <img src={loadingIcon} alt="Loading icon" />
            <p>Loading posts</p>
          </div>
        );

      case "success":
        if (Object.keys(feedPosts?.posts).length >= 1) {
          return (
            <div className={styles.postList} ref={postListRef}>
              {Object.keys(feedPosts?.posts).map((id, index, posts) =>
                getPostCard(feedPosts?.posts[id], index, posts),
              )}

              {feedPosts.fetchConfig.hasMore && (
                <div className={styles.loadingText} key={"LoadingText"}>
                  <img src={loadingIcon} alt="Loading icon" />
                  <p>Loading more posts</p>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <p className={styles.noPostText}>No posts to see here {`:(`}</p>
          );
        }

      case "error":
        <div className={styles.feedErrorMessage} key={"errorText"}>
          An error occured. Please try again later.
        </div>;
    }
  };

  return (
    <div className={styles.feed} role={"main"} ref={feedRef}>
      <CategoryBar />
      {getFeedContent()}
    </div>
  );
}
