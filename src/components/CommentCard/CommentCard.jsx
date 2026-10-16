import styles from "./CommentCard.module.css";

import { useState, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

// API
import { editComment, deleteComment } from "../../api/commentsAPI";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import checkIcon from "../../assets/icons/check.svg";
import closeIcon from "../../assets/icons/close.svg";
import authorIcon from "../../assets/icons/author.svg";

export default function CommentCard({
  data,
  postAuthorID,
  handleDelete,
  isProfileCommentCard = false,
}) {
  const { postId } = useParams();

  const navigate = useNavigate();

  const { userData, setUserData } = useOutletContext();
  const [comment, setComment] = useState(data);
  const [actionMode, setActionMode] = useState("halt");
  const [textAreaLen, setTextAreaLen] = useState(0);
  const [validationStatus, setValidationStatus] = useState(true);
  const [submitStatus, setSubmitStatus] = useState("halt");

  const textAreaRef = useRef();

  const handleProfileClick = (e) => {
    e.stopPropagation();

    navigate(`/profile/${comment?.author?.id}`);
  };

  const getProfilePicture = () => {
    {
      if (comment.author.profilePictureLink) {
        return (
          <img
            src={comment.author.profilePictureLink}
            className={styles.profilePicture}
            alt="Profile picture"
            onClick={handleProfileClick}
          />
        );
      } else {
        return (
          <div
            className={styles.altProfilePicture}
            style={{ backgroundColor: comment.author.theme_color }}
            onClick={handleProfileClick}
          >
            {comment.author.firstName[0]}
            {comment.author.lastName[0]}
          </div>
        );
      }
    }
  };

  const getReadableDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getReadableDateLong = () => {
    const isoString = comment.edited_at;

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    };

    return new Date(isoString).toLocaleString(undefined, options);
  };

  const handleEditBtnClick = (e) => {
    e.stopPropagation();

    setActionMode("edit");
    setTextAreaLen(comment.content.length);
  };

  const handleSubmitButtonClick = async (e) => {
    e.stopPropagation();

    if (textAreaLen < 1) {
      setValidationStatus(false);

      return;
    }

    setSubmitStatus("submitting");

    const dataObj = {
      comment: textAreaRef.current.value,
      id: comment.id,
      postId: postId,
      authorId: comment.author.id,
    };

    const jwt = userData?.jwt;

    const formData = JSON.stringify(dataObj);

    const result = await editComment(formData, jwt, "PUT");

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setActionMode("halt");
    setSubmitStatus("halt");

    textAreaRef.current.value = "";
    setTextAreaLen(0);

    setComment((prev) => ({
      ...prev,
      content: result.comment.content,
      edited_at: result.comment.edited_at,
    }));
  };

  const handleSubmitFail = (result) => {
    if (result.validationErrors) {
      setSubmitStatus("halt");
      setValidationStatus(false);
    } else if (result?.error === "unauthorize") {
      setSubmitStatus("halt");
      setValidationStatus("unauthorize");
    } else if (result.status === 401) {
      localStorage.removeItem("jwt");

      setUserData((prev) => ({ personalData: { ...prev.personalData } }));
    } else {
      setSubmitStatus("halt");
      setValidationStatus("error");
    }
  };

  const handleCancelBtnClick = (e) => {
    e.stopPropagation();

    setActionMode("halt");
    setValidationStatus(true);
  };

  const handleDeleteButtonClick = (e) => {
    e.stopPropagation();

    setActionMode("delete");
  };

  const handleDeleteSubmitButtonClick = async (e) => {
    e.stopPropagation();

    setSubmitStatus("submitting");

    const dataObj = {
      id: comment.id,
      postId: postId,
      authorId: comment.author.id,
    };

    const jwt = userData?.jwt;

    const formData = JSON.stringify(dataObj);

    const result = await deleteComment(formData, jwt, "DELETE");

    result.success ? handleDelete(comment.id) : handleDeleteSubmitFail();
  };

  const handleDeleteSubmitFail = () => {
    setActionMode("halt");
    setSubmitStatus("halt");
  };

  const getActionBtn = () => {
    if (!userData?.jwt) return;

    if (userData?.personalData?.id !== comment?.author?.id) return;

    switch (actionMode) {
      case "edit":
        return (
          <div className={styles.actions}>
            <button
              className={styles.submitBtn}
              title="Submit edit comment"
              aria-label="Submit edit comment"
              onClick={handleSubmitButtonClick}
              type="submit"
            >
              {submitStatus === "halt" ? (
                <img src={checkIcon} alt="Check icon" />
              ) : (
                <img src={loadingIcon} alt="Loading icon" />
              )}
            </button>

            <button
              className={styles.cancelBtn}
              title="Cancle edit comment"
              aria-label="Cancle edit comment"
              onClick={handleCancelBtnClick}
              disabled={submitStatus === "submitting"}
            >
              <img src={closeIcon} alt="Cancle edit icon" />
            </button>
          </div>
        );

      case "delete":
        return (
          <div className={styles.actions}>
            <p className={styles.deleteConfirmationText}>Are you sure?</p>

            <button
              className={styles.submitBtn}
              title="Submit delete comment"
              aria-label="Submit delete comment"
              onClick={handleDeleteSubmitButtonClick}
              type="submit"
            >
              {submitStatus === "halt" ? (
                <img src={checkIcon} alt="Check icon" />
              ) : (
                <img src={loadingIcon} alt="Loading icon" />
              )}
            </button>

            <button
              className={styles.cancelBtn}
              title="Cancle delete comment"
              aria-label="Cancle delete comment"
              onClick={handleCancelBtnClick}
              disabled={submitStatus === "submitting"}
            >
              <img src={closeIcon} alt="Cancle edit icon" />
            </button>
          </div>
        );

      default:
        return (
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              title="Edit comment"
              aria-label="Edit comment"
              onClick={handleEditBtnClick}
            >
              <img src={editIcon} alt="Edit icon" />
            </button>

            <button
              className={styles.deleteBtn}
              title="Delete comment"
              aria-label="Delete comment"
              onClick={handleDeleteButtonClick}
            >
              <img src={deleteIcon} alt="Delete icon" />
            </button>
          </div>
        );
    }
  };

  const handleEditAreaChange = (e) => {
    setValidationStatus(true);
    setTextAreaLen(e.target.value.length);
  };

  const getContentArea = () => {
    if (actionMode === "edit") {
      return (
        <div className={styles.editArea}>
          <textarea
            className={styles.editCommentArea}
            name="comment"
            defaultValue={comment.content}
            onChange={handleEditAreaChange}
            maxLength={500}
            ref={textAreaRef}
          ></textarea>

          <div className={styles.messageArea}>
            {(!validationStatus ||
              validationStatus === "error" ||
              validationStatus === "unauthorize") && (
              <div className={styles.errorMessageContainer}>
                <p className={styles.errorMessage}>
                  {validationStatus === "error"
                    ? "An error occured, please try again."
                    : validationStatus === "unauthorize"
                      ? "You are not authorized to make this action."
                      : " You cannot submit an empty comment!"}
                </p>
              </div>
            )}

            <p className={styles.letterCount}>{textAreaLen}/500</p>
          </div>
        </div>
      );
    } else {
      return <p className={styles.comment}>{`${comment.content}`}</p>;
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      className={`${styles.commentCard} ${isProfileCommentCard ? styles.profileCommentCard : ""} `}
      onClick={handleCommentClick}
    >
      <div className={styles.primary}>{getProfilePicture()}</div>
      <div className={styles.secondary}>
        <div className={styles.header}>
          <div className={styles.details}>
            <div className={styles.subDetails}>
              <p
                className={`${styles.name} ${comment.author.id === postAuthorID && styles.authorName}`}
                onClick={handleProfileClick}
              >
                <span className={styles.name}>
                  <span className={styles.firstName}>
                    {comment?.author?.firstName}
                  </span>
                  <span className={styles.lastName}>
                    {comment?.author?.lastName}
                  </span>
                </span>
              </p>

              {comment.author.id === postAuthorID && (
                <img
                  className={styles.authorSign}
                  src={authorIcon}
                  alt="Author icon"
                  aria-label="Author"
                  title="Author"
                ></img>
              )}
            </div>

            <p className={styles.createDate} title={getReadableDateLong()}>
              {getReadableDate(comment.edited_at)}
              {comment.created_at !== comment.edited_at && " (edited)"}
            </p>
          </div>

          {getActionBtn()}
        </div>

        {getContentArea()}
      </div>
    </div>
  );
}
