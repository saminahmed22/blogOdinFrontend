import styles from "./CommentSection.module.css";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useOutletContext, Link } from "react-router";

// API
import { fetchComments } from "../../api/fetchComments.js";
import { makeCommentAPIRequest } from "../../api/makeCommentAPIRequest.js";

// Components
import CommentCard from "../CommentCard/CommentCard";

// Icons

import loadingIcon from "../../assets/icons/loading.svg";

export default function CommentSection({
  postAuthorID,
  postPageRef,
  showScrollTop,
  setShowScrollTop,
}) {
  const { userData, setUserData } = useOutletContext();

  const [fetchStatus, setFetchStatus] = useState("fetching");
  const [submitStatus, setSubmitStatus] = useState("halt");
  const [comments, setComments] = useState({
    fetchConfig: {
      quantity: 10,
      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
    },

    commentsObj: {},
  });
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [validationStatus, setValidationStatus] = useState(true);

  const textAreaRef = useRef();

  const { postId } = useParams();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (textAreaCount < 1) {
      setValidationStatus(false);

      return;
    }

    setSubmitStatus("submitting");

    const data = new FormData(e.target);

    const dataObj = Object.fromEntries(data);

    dataObj["postId"] = postId;

    const jwt = userData.jwt;

    const formData = JSON.stringify(dataObj);

    const result = await makeCommentAPIRequest(formData, jwt, "POST");

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setSubmitStatus("halt");

    textAreaRef.current.value = "";
    setTextAreaCount(0);

    setComments((prev) => ({
      ...prev,
      commentsObj: {
        [result.comment.id]: { ...result.comment },
        ...prev.commentsObj,
      },
    }));
  };

  const handleSubmitFail = (result) => {
    if (result.validationErrors) {
      setSubmitStatus("halt");
      setValidationStatus(false);
    } else if (result.status === 401) {
      localStorage.removeItem("jwt");

      setUserData((prev) => ({ personalData: { ...prev.personalData } }));
    } else {
      setSubmitStatus("halt");
      setValidationStatus("error");
    }
  };

  const commentsRef = useRef(comments);
  const updateCommentsState = useCallback(
    (mode, result) => {
      const buildingObj = {
        fetchConfig: {
          quantity: 10,
          hasMore: false,
          count: 0,
          amount: 0,
          cursor: undefined,
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
        ? result.comments[result.comments.length - 1].id
        : undefined;

      // Populate comments object
      if (mode !== "initial") {
        buildingObj.commentsObj = { ...commentsRef.current.commentsObj };
      }

      for (const comment of result.comments) {
        buildingObj.commentsObj[comment.id] = comment;
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
        postId: postId,
        quantity: commentsRef.current.fetchConfig.quantity,
        cursor:
          mode === "initial"
            ? undefined
            : commentsRef.current.fetchConfig.cursor,
      };

      const result = await fetchComments(params);

      if (result.success) {
        fetchingOnReqRef.current = false;
        updateCommentsState(mode, result);
        setFetchStatus("success");
      } else {
        setFetchStatus("error");
      }
    },
    [updateCommentsState, postId],
  );

  // Initial comment fetch
  useEffect(() => {
    const fetchFunc = async () => {
      fetchCommentsCB("initial");
    };

    fetchFunc();
  }, [fetchCommentsCB]);

  // Refetch on scroll handler
  useEffect(() => {
    const commentListElemRef = postPageRef.current;

    if (!commentListElemRef) return;

    const handleScroll = async () => {
      const scrollTop = commentListElemRef.scrollTop;
      const scrollHeight = commentListElemRef.scrollHeight;
      const clientHeight = commentListElemRef.clientHeight;

      const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (percentage >= 40) {
        if (!showScrollTop) {
          console.log("Toggled on");
          setShowScrollTop(true);
        }
      } else if (percentage <= 20) {
        if (showScrollTop) {
          console.log("Toggled off");
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
    postPageRef,
    comments.fetchConfig.hasMore,
    fetchCommentsCB,
    showScrollTop,
    setShowScrollTop,
  ]);

  const getComments = () => {
    switch (fetchStatus) {
      case "success":
        if (Object.keys(comments.commentsObj).length >= 1) {
          return (
            <div className={styles.commentList}>
              {Object.keys(comments.commentsObj).map((id) => (
                <CommentCard
                  data={comments?.commentsObj[id]}
                  postAuthorID={postAuthorID}
                  key={id}
                />
              ))}

              {comments.fetchConfig.hasMore && (
                <div className={styles.loadingMessage}>
                  <img src={loadingIcon} alt="Loading icon" />
                  <p>Loading more comments</p>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <p className={styles.noCommentsMessage}>
              No comments has been made yet,
              <br />
              be the first one to spark the conversation!
            </p>
          );
        }

      case "fetching":
        return (
          <div className={styles.loadingMessage}>
            <img src={loadingIcon} alt="Loading icon" />
            <p>Loading comments</p>
          </div>
        );

      case "error":
        return (
          <p className={styles.errorMessageFetchFail}>
            Failed to fetch comments
          </p>
        );
    }
  };

  const handleTextareaChange = () => {
    const ref = textAreaRef.current;

    const len = ref.value.length;

    if (len >= 1) {
      setValidationStatus(true);
    }

    setTextAreaCount(len);
  };

  const getFormContent = () => {
    if (userData?.jwt?.token?.length) {
      return (
        <form
          className={styles.commentForm}
          action="/"
          method="POST"
          onSubmit={handleFormSubmit}
        >
          <textarea
            className={styles.commentInput}
            type="text"
            aria-label="Comment input box"
            placeholder="Write your thoughts!"
            name="comment"
            id="commentInput"
            ref={textAreaRef}
            onChange={handleTextareaChange}
            maxLength={500}
          ></textarea>

          {(!validationStatus || validationStatus === "error") && (
            <div className={styles.errorMessageContainer}>
              <p className={styles.errorMessage}>
                {validationStatus === "error"
                  ? "An error occured, please try again."
                  : " You cannot submit an empty comment!"}
              </p>
            </div>
          )}

          <div className={styles.formActions}>
            <p className={styles.letterCount}>{`${textAreaCount}/500`}</p>
            <button className={styles.submitBtn}>
              {submitStatus === "halt" ? (
                "Submit"
              ) : (
                <img
                  className={styles.loadingIcon}
                  src={loadingIcon}
                  alt="Loading icon"
                />
              )}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <div className={styles.loginMessage}>
          <Link className={styles.loginRedirectLink} to={"/auth/login"}>
            Login to make comments!
          </Link>
        </div>
      );
    }
  };

  return (
    <div className={styles.commentSection}>
      <p className={styles.commentSectionHeader}>
        Comments
        {comments.fetchConfig.count > 0
          ? `(${comments.fetchConfig.count})`
          : ""}
      </p>
      {getFormContent()}
      {getComments()}
    </div>
  );
}
