import styles from "./ProfilePageComments.module.css";

// Hooks
import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { useOutletContext } from "react-router";

// Components
import ProfileCommentCard from "../ProfileCommentCard/ProfileCommentCard";

// API
import { fetchUserComments } from "../../api/fetchUserComments";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import upIcon from "../../assets/icons/up.svg";

export default function ProfilePageComments({
  profileId,
  comments,
  setComments,
  userFirstName,
}) {
  const { userData } = useOutletContext();

  const [fetchStatus, setFetchStatus] = useState(
    comments.fetchConfig.initial ? "fetching" : "success",
  );

  const [showScrollTop, setShowScrollTop] = useState(false);

  //   Function to update the comments state
  const commentsRef = useRef(comments);
  const updateCommentsState = useCallback(
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

        commentsObj: {},
      };

      // update fetch config options
      buildingObj.fetchConfig.count = result.count;

      buildingObj.fetchConfig.amount =
        mode === "initial"
          ? result.comments.length
          : commentsRef.current.fetchConfig.amount + result.comments.length;

      buildingObj.fetchConfig.hasMore =
        result.count > buildingObj.fetchConfig.amount;

      buildingObj.fetchConfig.cursor = buildingObj.fetchConfig.hasMore
        ? result.comments[result.comments.length - 1]?.id
        : undefined;

      if (fetchConfigInitialMode) {
        buildingObj.fetchConfig.initial = false;
      }

      // Populate comments object
      if (mode !== "initial") {
        buildingObj.commentsObj = { ...commentsRef.current.commentsObj };
      }

      for (const comment of result.comments) {
        buildingObj.commentsObj[comment?.id] = comment;
      }

      commentsRef.current = buildingObj;

      setComments(buildingObj);
    },
    [setComments],
  );

  const fetchingOnReqRef = useRef(false);
  const fetchCommentsCB = useCallback(
    async (mode = "request") => {
      const params = {
        userId: profileId,
        quantity: commentsRef.current.fetchConfig.quantity,
        cursor:
          mode === "initial"
            ? undefined
            : commentsRef.current.fetchConfig.cursor,
      };

      const result = await fetchUserComments(params, userData?.jwt);

      if (result.success) {
        fetchingOnReqRef.current = false;
        updateCommentsState(
          mode,
          commentsRef.current.fetchConfig.initial,
          result,
        );
        setFetchStatus("success");
      } else {
        setFetchStatus("error");
      }
    },
    [updateCommentsState, profileId, userData?.jwt],
  );

  // Initial comments fetch
  useEffect(() => {
    if (!comments.fetchConfig.initial) return;

    const fetchFunc = async () => {
      fetchCommentsCB("initial");
    };

    fetchFunc();
  }, [fetchCommentsCB, comments.fetchConfig.initial]);

  // Refetch on scroll handler
  const commentListRef = useRef();
  useEffect(() => {
    const commentListElemRef = commentListRef.current;

    if (!commentListElemRef) return;

    const handleScroll = async () => {
      const scrollTop = commentListElemRef.scrollTop;
      const scrollHeight = commentListElemRef.scrollHeight;
      const clientHeight = commentListElemRef.clientHeight;

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
        comments.fetchConfig.hasMore &&
        !fetchingOnReqRef.current
      ) {
        fetchingOnReqRef.current = true;
        fetchCommentsCB();
      }
    };

    commentListElemRef.addEventListener("scroll", handleScroll);

    return () => {
      commentListElemRef.removeEventListener("scroll", handleScroll);
    };
  }, [
    comments.fetchConfig.hasMore,
    showScrollTop,
    fetchCommentsCB,
    fetchStatus,
  ]);

  //#endregion

  const getHr = (index, arrLen, commentID) => {
    if (index >= 0 && index < arrLen - 1) {
      return (
        <hr key={`${commentID}_hr`} className={styles.commentCardSeparator} />
      );
    }
  };

  const handleCommentDelete = (id) => {
    setComments((prev) => {
      const { [id]: removed, ...rest } = prev.commentsObj;
      return {
        fetchConfig: { ...prev.fetchConfig, count: prev.fetchConfig.count - 1 },
        commentsObj: rest,
      };
    });
  };

  const getCommentCard = (comment, index, comments) => {
    return (
      <Fragment key={`Fragment_${comment?.id}`}>
        <ProfileCommentCard
          key={comment?.id}
          post={comment.Post}
          comment={comment}
          handleCommentDelete={handleCommentDelete}
        />

        {getHr(index, Object.keys(comments).length, comment?.id)}
      </Fragment>
    );
  };

  const handleScrollTopClick = () => {
    commentListRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  switch (fetchStatus) {
    case "success":
      if (Object.keys(comments.commentsObj).length >= 1) {
        return (
          <div className={styles.commentList} ref={commentListRef}>
            {Object.keys(comments.commentsObj).map((id, index) =>
              getCommentCard(
                comments.commentsObj[id],
                index,
                comments.commentsObj,
              ),
            )}

            {comments.fetchConfig.hasMore && (
              <div className={styles.loadingMessageContainer}>
                <img
                  className={styles.loadingIcon}
                  src={loadingIcon}
                  alt="Loading icon"
                />
                <p className={styles.loadingMessage}>
                  {profileId === userData?.personalData?.id
                    ? "Loading more of your comments."
                    : `Loading more comments made by ${userFirstName}`}
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
        return profileId === userData?.personalData?.id ? (
          <p className={styles.noCommentText}>
            You havent made any comments yet.
          </p>
        ) : (
          <p className={styles.noCommentText}>
            <span className={styles.userFirstName}>{userFirstName}</span> hasn't
            commented anything yet.
          </p>
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
          <p className={styles.loadingMessage}>Loading Comments</p>
        </div>
      );

    case "error":
      return <p className={styles.errorMessage}>An error occured.</p>;
  }
}
