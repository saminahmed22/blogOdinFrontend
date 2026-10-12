import styles from "./ProfilePage.module.css";

// Hooks
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useOutletContext } from "react-router";

// Components
import PostCard from "../postCard/PostCard";

// API
import { fetchUserData } from "../../api/fetchUserData";
import { fetchUserPosts } from "../../api/fetchUserPosts";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";

export default function ProfilePage() {
  const { profileId } = useParams();

  const { userData } = useOutletContext();
  const [targetUser, setTargetUser] = useState();
  const [fetchStatus, setFetchStatus] = useState("fetching");
  const [postsFetchStatus, setPostsFetchStatus] = useState("fetching");
  const [posts, setPosts] = useState({
    fetchConfig: {
      quantity: 10,
      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
    },

    postsObj: {},
  });

  const profilePageRef = useRef();

  // Initial user data fetch
  useEffect(() => {
    const fetchFunc = async () => {
      const result = await fetchUserData(profileId);

      if (result.success) {
        console.log(result);

        setFetchStatus("success");

        setTargetUser(result.user);
      } else {
        setFetchStatus("error");
      }
    };

    fetchFunc();
  }, [profileId]);

  //#region Inifnite scroll posts
  const postsRef = useRef(posts);
  const updatePostsState = useCallback(
    (mode, result) => {
      const buildingObj = {
        fetchConfig: {
          quantity: 10,
          hasMore: false,
          count: 0,
          amount: 0,
          cursor: undefined,
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

      // Populate posts object
      if (mode !== "initial") {
        buildingObj.postsObj = { ...postsRef.current.postsObj };
      }

      for (const comment of result.posts) {
        buildingObj.postsObj[comment.id] = comment;
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
        updatePostsState(mode, result);
        setPostsFetchStatus("success");
      } else {
        setPostsFetchStatus("error");
      }
    },
    [updatePostsState, profileId, userData?.jwt],
  );

  // Initial posts fetch
  useEffect(() => {
    const fetchFunc = async () => {
      fetchPostsCB("initial");
    };

    fetchFunc();
  }, [fetchPostsCB]);

  // Refetch on scroll handler
  // useEffect(() => {
  //   const commentListElemRef = postPageRef.current;

  //   if (!commentListElemRef) return;

  //   const handleScroll = async () => {
  //     const scrollTop = commentListElemRef.scrollTop;
  //     const scrollHeight = commentListElemRef.scrollHeight;
  //     const clientHeight = commentListElemRef.clientHeight;

  //     const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

  //     if (percentage >= 40) {
  //       if (!showScrollTop) {
  //         console.log("Toggled on");
  //         setShowScrollTop(true);
  //       }
  //     } else if (percentage <= 20) {
  //       if (showScrollTop) {
  //         console.log("Toggled off");
  //         setShowScrollTop(false);
  //       }
  //     }

  //     if (
  //       percentage >= 70 &&
  //       posts.fetchConfig.hasMore &&
  //       !fetchingOnReqRef.current
  //     ) {
  //       fetchingOnReqRef.current = true;
  //       fetchpostsCB();
  //     }
  //   };

  //   commentListElemRef.addEventListener("scroll", handleScroll);

  //   return () => {
  //     commentListElemRef.removeEventListener("scroll", handleScroll);
  //   };
  // }, [
  //   postPageRef,
  //   posts.fetchConfig.hasMore,
  //   fetchpostsCB,
  //   showScrollTop,
  //   setShowScrollTop,
  // ]);

  //#endregion

  const getProfilePicture = () => {
    {
      if (targetUser?.profilePictureLink) {
        return (
          <img
            src={targetUser?.profilePicture}
            className={styles.profilePicture}
            alt="Profile picture"
          />
        );
      } else {
        return (
          <div
            className={styles.profilePicture}
            style={{ backgroundColor: targetUser.theme_color }}
          >
            {targetUser?.firstName[0]}
            {targetUser?.lastName[0]}
          </div>
        );
      }
    }
  };

  const getReadableDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getPostsList = () => {
    switch (postsFetchStatus) {
      case "success":
        return (
          <div className={styles.postList}>
            {Object.keys(posts.postsObj).map((id) => (
              <PostCard post={posts.postsObj[id]} key={id} />
            ))}
          </div>
        );

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
  };

  switch (fetchStatus) {
    case "success":
      return (
        <div className={styles.profilePage} ref={profilePageRef}>
          <div className={styles.header}>
            {getProfilePicture()}

            <span className={styles.name}>
              <span className={styles.firstName}>{targetUser?.firstName}</span>
              <span className={styles.lastName}>{targetUser?.lastName}</span>
            </span>

            <p className={styles.bio}>{targetUser?.bio}</p>

            <p>
              <span style={{ fontWeight: 500 }}>Member since:</span>{" "}
              {getReadableDate(targetUser.joined_at)}
            </p>
          </div>
          <div className={styles.contentBody}>
            <h2 className={styles.contentBodyHeader}>Posts</h2>

            {getPostsList()}
          </div>
        </div>
      );

    case "fetching":
      return (
        <div className={styles.loadingMessageContainer}>
          <img
            className={styles.loadingIcon}
            src={loadingIcon}
            alt="Loading icon"
          />
          <p className={styles.loadingMessage}>Loading profile</p>
        </div>
      );

    case "error":
      return <p className={styles.errorMessage}>An error occured.</p>;
  }
}
