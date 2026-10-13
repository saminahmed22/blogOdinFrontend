import styles from "./ProfilePagePosts.module.css";

// Hooks
import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { useOutletContext } from "react-router";

// Components
import PostCard from "../postCard/PostCard";

// API
import { fetchUserPosts } from "../../api/fetchUserPosts";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import upIcon from "../../assets/icons/up.svg";

export default function ProfilePagePosts({
  profileId,
  posts,
  setPosts,
  userFirstName,
}) {
  const { userData } = useOutletContext();

  const [fetchStatus, setFetchStatus] = useState(
    posts.fetchConfig.initial ? "fetching" : "success",
  );

  const [showScrollTop, setShowScrollTop] = useState(false);

  //   Function to update the posts state
  const postsRef = useRef(posts);
  const updatePostsState = useCallback(
    (mode, fetchConfigInitialMode, result) => {
      const buildingObj = {
        fetchConfig: {
          quantity: 10,
          hasMore: false,
          count: 0,
          amount: 0,
          cursor: undefined,
          initial: false,
        },

        postsObj: {},
      };

      // update fetch config options
      buildingObj.fetchConfig.count = result.count;

      buildingObj.fetchConfig.amount =
        mode === "initial"
          ? result.posts.length
          : postsRef.current.fetchConfig.amount + result.posts.length;

      buildingObj.fetchConfig.hasMore =
        result.count > buildingObj.fetchConfig.amount;

      buildingObj.fetchConfig.cursor = buildingObj.fetchConfig.hasMore
        ? result.posts[result.posts.length - 1].id
        : undefined;

      if (fetchConfigInitialMode) {
        buildingObj.fetchConfig.initial = false;
      }

      // Populate posts object
      if (mode !== "initial") {
        buildingObj.postsObj = { ...postsRef.current.postsObj };
      }

      for (const post of result.posts) {
        buildingObj.postsObj[post.id] = post;
      }

      postsRef.current = buildingObj;

      setPosts(buildingObj);
    },
    [setPosts],
  );

  const fetchingOnReqRef = useRef(false);
  const fetchPostsCB = useCallback(
    async (mode = "request") => {
      const params = {
        userId: profileId,
        quantity: postsRef.current.fetchConfig.quantity,
        cursor:
          mode === "initial" ? undefined : postsRef.current.fetchConfig.cursor,
      };

      const result = await fetchUserPosts(params, userData?.jwt);

      if (result.success) {
        fetchingOnReqRef.current = false;
        updatePostsState(mode, postsRef.current.fetchConfig.initial, result);
        setFetchStatus("success");
      } else {
        setFetchStatus("error");
      }
    },
    [updatePostsState, profileId, userData?.jwt],
  );

  // Initial posts fetch
  useEffect(() => {
    if (!posts.fetchConfig.initial) return;

    const fetchFunc = async () => {
      fetchPostsCB("initial");
    };

    fetchFunc();
  }, [fetchPostsCB, posts.fetchConfig.initial]);

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

      if (percentage >= 40) {
        if (!showScrollTop) {
          setShowScrollTop(true);
        }
      } else if (percentage <= 20) {
        if (showScrollTop) {
          setShowScrollTop(false);
        }
      }

      if (
        percentage >= 70 &&
        posts.fetchConfig.hasMore &&
        !fetchingOnReqRef.current
      ) {
        fetchingOnReqRef.current = true;
        fetchPostsCB();
      }
    };

    postListElemRef.addEventListener("scroll", handleScroll);

    return () => {
      postListElemRef.removeEventListener("scroll", handleScroll);
    };
  }, [posts.fetchConfig.hasMore, showScrollTop, fetchPostsCB, fetchStatus]);

  //#endregion

  const getHr = (index, arrLen, postID) => {
    if (index >= 0 && index < arrLen - 1) {
      return <hr key={`${postID}_hr`} className={styles.postCardSeparator} />;
    }
  };

  const getPostCard = (post, index, posts) => {
    return (
      <Fragment key={`Fragment_${post.id}`}>
        <PostCard key={post.id} post={post} />

        {getHr(index, Object.keys(posts).length, post.id)}
      </Fragment>
    );
  };

  const handleScrollTopClick = () => {
    postListRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  switch (fetchStatus) {
    case "success":
      if (Object.keys(posts.postsObj).length >= 1) {
        return (
          <div className={styles.postList} ref={postListRef}>
            {Object.keys(posts.postsObj).map((id, index) =>
              getPostCard(posts.postsObj[id], index, posts.postsObj),
            )}

            {posts.fetchConfig.hasMore && (
              <div className={styles.loadingMessageContainer}>
                <img
                  className={styles.loadingIcon}
                  src={loadingIcon}
                  alt="Loading icon"
                />
                <p className={styles.loadingMessage}>
                  Loading more Posts of {userFirstName}
                </p>
              </div>
            )}

            <button
              className={`${styles.scrollTopBtn} ${showScrollTop ? styles.scrollTopBtnShow : styles.scrollTopBtnHide}`}
              aria-label="Scroll top"
              title="Scroll top"
              onClick={handleScrollTopClick}
            >
              <img src={upIcon} alt="Up icon" />
            </button>
          </div>
        );
      } else {
        return (
          <span className={styles.noPostText}>
            <p className={styles.userFirstName}>{userFirstName}</p>
            <p>hasn't posted anything yet.</p>
          </span>
        );
      }

    case "fetching":
      return (
        <div className={styles.loadingMessageContainer}>
          <img
            className={styles.loadingIcon}
            src={loadingIcon}
            alt="Loading icon"
          />
          <p className={styles.loadingMessage}>Loading Posts</p>
        </div>
      );

    case "error":
      return <p className={styles.errorMessage}>An error occured.</p>;
  }
}
