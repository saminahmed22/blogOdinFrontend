import styles from "./PostCardActions.module.css";

// Hooks
import { useState } from "react";

// API
import { togglePostPublishStatus } from "../../api/postsAPI";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import bookmarkIcon from "../../assets/icons/bookmark.svg";
import bookmarkedIcon from "../../assets/icons/bookmarked.svg";

export default function PostCardActions({
  data,
  userId,
  publishStaus,
  setPublishStaus,
}) {
  const [publishingStaus, setPublishingStatus] = useState("halt");
  const [bookmarkingStaus, setBookmarkingStatus] = useState("notBookmarked");

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
    } else {
      setPublishingStatus("error");
    }
  };

  const handleBookmarkBtnClick = async (e) => {
    e.stopPropagation();

    setBookmarkingStatus((prev) =>
      prev === "bookmarked" ? "notBookmarked" : "bookmarked",
    );
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

      {userId !== data?.author?.id && (
        <button
          className={` ${styles.postActBtn} ${bookmarkingStaus === "bookmarked" ? styles.bookMarkBtnBookmarked : styles.bookMarkBtn}`}
          title="Bookmark this post"
          aria-label="Bookmark this post"
          onClick={handleBookmarkBtnClick}
          disabled={bookmarkingStaus === "bookmarking"}
        >
          {bookmarkingStaus === "notBookmarked" ? (
            <img src={bookmarkIcon} alt="Loading icon" />
          ) : bookmarkingStaus === "bookmarked" ? (
            <img src={bookmarkedIcon} alt="Loading icon" />
          ) : bookmarkingStaus === "error" ? (
            "Error"
          ) : (
            <img src={loadingIcon} alt="Loading icon" />
          )}
        </button>
      )}
    </div>
  );
}
