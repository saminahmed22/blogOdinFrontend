import styles from "./CommentSection.module.css";

import { useState, useRef } from "react";
import { useParams, useOutletContext, Link } from "react-router";

// API
import { createComment, fetchPostComments } from "../../api/commentsAPI";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import CommentCard from "../CommentCard/CommentCard";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";

export default function CommentSection({ postPageRef }) {
  const { postId } = useParams();

  const { userData, setUserData } = useOutletContext();

  // States
  const [submitStatus, setSubmitStatus] = useState("halt");
  const [comments, setComments] = useState({
    status: "fetching",

    currentReInitializeFactorValue: null,

    scrollPosition: 0,

    config: {
      initial: true,

      quantity: 10,

      totalContentFetched: 0,

      hasMore: false,
      cursor: undefined,
    },

    content: {},
  });
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [validationStatus, setValidationStatus] = useState(true);

  // Refs
  const textAreaRef = useRef();

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

    const jwt = userData?.jwt;

    const formData = JSON.stringify(dataObj);

    const result = await createComment(formData, jwt, "POST");

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setSubmitStatus("halt");

    textAreaRef.current.value = "";
    setTextAreaCount(0);

    setComments((prev) => ({
      fetchConfig: {
        ...prev.fetchConfig,
        count: prev.fetchConfig.count + 1,
      },
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

      <div className={styles.commentList}>
        <InfiniteScrollProvider
          Card={CommentCard}
          fetchFunction={fetchPostComments}
          reInitializeFactor={postId}
          contentState={comments}
          setContentState={setComments}
          queryParams={{ postId }}
          customParentRef={postPageRef}
          options={{
            scrollTopBtn: false,
            cardsSeparator: false,
            listStyles: { gap: "10px" },
            customLoadingMessage: "Loading comments",
            customLoadingMoreMessage: "Loading more comments",
            customNoContentMessage:
              "No one has made any comment yet.\nMake an comments to spark the conversation!",
            customErrorMessage: "Failed to load comments.",
            customRefetchFailMessage: "Failed to fetch more comments.",
          }}
        />
      </div>
    </div>
  );
}
