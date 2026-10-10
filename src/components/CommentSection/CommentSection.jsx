import styles from "./CommentSection.module.css";

import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, Link } from "react-router";

// API
import { fetchComments } from "../../api/fetchComments.js";
import { submitComment } from "../../api/submitComment.js";

// Components
import CommentCard from "../CommentCard/CommentCard";

// Icons

import loadingIcon from "../../assets/icons/loading.svg";

export default function CommentSection({ postAuthorID }) {
  const { userData, setUserData } = useOutletContext();

  const [fetchStatus, setFetchStatus] = useState("fetching");
  const [submitStatus, setSubmitStatus] = useState("halt");
  const [comments, setComments] = useState([]);
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

    const result = await submitComment(formData, jwt);

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setSubmitStatus("halt");

    textAreaRef.current.value = "";
    setTextAreaCount(0);

    setComments((prev) => [{ ...result.comment }, ...prev]);
  };

  const handleSubmitFail = (result) => {
    if (result.status === 401) {
      localStorage.removeItem("jwt");

      setUserData((prev) => ({ personalData: { ...prev.personalData } }));
    } else {
      setSubmitStatus("halt");
      setValidationStatus("error");
    }
  };

  // Fetch comments
  useEffect(() => {
    const fetchFunc = async () => {
      const result = await fetchComments(postId);

      if (result.success) {
        setFetchStatus("success");

        setComments([...Object.values(result.comments)]);
      } else {
        setFetchStatus("error");
      }
    };

    fetchFunc();
  }, [postId]);

  const getComments = () => {
    switch (fetchStatus) {
      case "success":
        if (comments.length >= 1) {
          return (
            <div className={styles.commentList}>
              {comments.map((comment) => (
                <CommentCard
                  data={comment}
                  postAuthorID={postAuthorID}
                  key={comment.id}
                />
              ))}
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
        return <p className={styles.errorMessage}>Failed to fetch comments</p>;
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
      <p className={styles.commentSectionHeader}>Comments</p>
      {getFormContent()}
      {getComments()}
    </div>
  );
}
