import styles from "./CommentCard.module.css";

import { useState, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

// API
import { makeCommentAPIRequest } from "../../api/makeCommentAPIRequest";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import checkIcon from "../../assets/icons/check.svg";
import closeIcon from "../../assets/icons/close.svg";

export default function CommentCard({ data, postAuthorID }) {
  const { postId } = useParams();

  const navigate = useNavigate();

  const { userData, setUserData } = useOutletContext();
  const [comment, setComment] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [textAreaLen, setTextAreaLen] = useState(0);
  const [validationStatus, setValidationStatus] = useState(true);
  const [editSubmitStatus, setEditSubmitStatus] = useState("halt");

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
            alt=""
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

  const handleEditBtnClick = () => {
    setEditMode(true);
    setTextAreaLen(comment.content.length);
  };

  const handleSubmitButtonClick = async () => {
    if (textAreaLen < 1) {
      setValidationStatus(false);

      return;
    }

    setEditSubmitStatus("submitting");

    const dataObj = {
      content: textAreaRef.current.value,
      id: comment.id,
      postId: postId,
      authorId: comment.author.id,
    };

    const jwt = userData.jwt;

    const formData = JSON.stringify(dataObj);

    const result = await makeCommentAPIRequest(formData, jwt, "PUT");

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setEditMode(false);
    setEditSubmitStatus("halt");

    textAreaRef.current.value = "";
    setTextAreaLen(0);

    setComment((prev) => ({ ...prev, content: result.comment.content }));
  };

  const handleSubmitFail = (result) => {
    if (result?.error === "unauthorize") {
      setEditSubmitStatus("halt");
      setValidationStatus("unauthorize");
    } else if (result.status === 401) {
      localStorage.removeItem("jwt");

      setUserData((prev) => ({ personalData: { ...prev.personalData } }));
    } else {
      setEditSubmitStatus("halt");
      setValidationStatus("error");
    }
  };

  const handleCancelBtnClick = () => {
    setEditMode(false);
  };

  const getActionBtn = () => {
    if (!userData?.jwt) return;

    if (userData?.personalData?.id !== comment?.author?.id) return;

    if (editMode) {
      return (
        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            title="Submit edit comment"
            aria-label="Submit edit comment"
            onClick={handleSubmitButtonClick}
            type="submit"
            form="editForm"
          >
            {editSubmitStatus === "halt" ? (
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
          >
            <img src={closeIcon} alt="Cancle edit icon" />
          </button>
        </div>
      );
    } else {
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
    if (editMode) {
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

  return (
    <div className={styles.commentCard}>
      <div className={styles.primary}>{getProfilePicture()}</div>
      <div className={styles.secondary}>
        <div className={styles.header}>
          <div className={styles.details}>
            <div className={styles.subDetails}>
              <p
                className={`${styles.name} ${comment.author.id === postAuthorID && styles.authorName}`}
                onClick={handleProfileClick}
              >
                {`${comment.author.firstName} ${comment.author.lastName}`}
              </p>

              {comment.author.id === postAuthorID && (
                <p className={styles.authorSign}>Author</p>
              )}
            </div>

            <p className={styles.createDate}>
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
