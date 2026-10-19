import styles from "./PostCardActions.module.css";

// Hooks
import { useState } from "react";

// API
import { togglePostPublishStatus } from "../../api/postsAPI";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";

export default function PostCardActions({
  postId,
  publishStaus,
  setPublishStaus,
}) {
  const [publishingStaus, setPublishingStatus] = useState("halt");

  const handlePublishBtnClick = async (e) => {
    e.stopPropagation();

    setPublishingStatus("publishing");

    const body = JSON.stringify({ postId, toggleRequest: !publishStaus });

    const response = await togglePostPublishStatus(body);

    console.log(response);

    if (response?.success) {
      setPublishStaus(response?.result?.content?.published);

      setPublishingStatus("success");
    } else {
      setPublishingStatus("error");
    }
  };

  return (
    <div className={styles.postCardActions}>
      {!publishStaus && (
        <button
          className={styles.publishBtn}
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
    </div>
  );
}
