import styles from "./PostCardActions.module.css";

// Hooks
import { useState } from "react";

// API
import {
  togglePostPublishStatus,
  createBookmark,
  deleteBookmakr,
} from "../../api/postsAPI";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import bookmarkIcon from "../../assets/icons/bookmark.svg";
import bookmarkedIcon from "../../assets/icons/bookmarked.svg";

import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";

export default function PostCardActions({
  data,
  userId,
  publishStaus,
  setPublishStaus,
  bookmarkStaus,
  setBookmarkStatus,
  handleDelete,
}) {
  const [publishingStaus, setPublishingStatus] = useState("halt");
  const [bookmarkingStaus, setBookmarkingStatus] = useState("halt");

  const handlePublishBtnClick = async (e) => {
    e.stopPropagation();

    setPublishingStatus("publishing");

    const body = JSON.stringify({
      postId: data.id,
      toggleRequest: !publishStaus,
    });

    const response = await togglePostPublishStatus(body);

    if (response?.success) {
      setPublishStaus(response?.result?.content?.published);

      setPublishingStatus("success");

      handleDelete(data?.id);
    } else {
      setPublishingStatus("error");
    }
  };

  const handleBookmarkBtnClick = async (e) => {
    e.stopPropagation();

    setBookmarkingStatus("bookmarking");

    const body = JSON.stringify({
      postId: data.id,
    });

    const response = bookmarkStaus
      ? await deleteBookmakr(body)
      : await createBookmark(body);

    setBookmarkStatus((prev) => (response?.success ? !prev : prev));

    setBookmarkingStatus(response?.success ? "success" : "error");
  };

  return (
    <div className={styles.postCardActions}>
      {!publishStaus && (
        <button
          className={`${styles.publishBtn} ${styles.postActBtn}`}
          title="Publish this post"
          aria-label="Publish this post"
          onClick={handlePublishBtnClick}
          disabled={publishingStaus === "publishing"}
        >
          {publishingStaus === "halt" ? (
            "Publish"
          ) : publishingStaus === "error" ? (
            "Error"
          ) : (
            <img src={loadingIcon} alt="Loading icon" />
          )}
        </button>
      )}

      {userId && userId !== data?.author?.id && (
        <button
          className={` ${styles.postActBtn} ${bookmarkingStaus === "bookmarked" ? styles.bookMarkBtnBookmarked : styles.bookMarkBtn}`}
          title="Bookmark this post"
          aria-label="Bookmark this post"
          onClick={handleBookmarkBtnClick}
          disabled={bookmarkingStaus === "bookmarking"}
        >
          {bookmarkStaus ? (
            <img src={bookmarkedIcon} alt="Bookmarked icon" />
          ) : (
            <img src={bookmarkIcon} alt="Bookmark icon" />
          )}
        </button>
      )}

      {userId === data?.author?.id && (
        <>
          <button
            className={`${styles.postActBtn} ${styles.editBtn}`}
            title="Edit this post"
            aria-label="Edit this post"
          >
            <img src={editIcon} alt="Edit icon" />
          </button>

          <button
            className={`${styles.postActBtn}  ${styles.deleteBtn}`}
            title="Delete this post"
            aria-label="Delete this post"
          >
            <img src={deleteIcon} alt="Delete icon" />
          </button>
        </>
      )}
    </div>
  );
}
