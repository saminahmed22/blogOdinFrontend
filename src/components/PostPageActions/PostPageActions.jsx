import styles from "./PostPageActions.module.css";

// Hook
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
// API
import {
  createBookmark,
  deleteBookmark,
  createVote,
  deleteVote,
  togglePostPublishStatus,
  deletePost,
} from "../../api/postsAPI";

// Icons
import upVoteIcon from "../../assets/icons/upVote.svg";
import downVoteIcon from "../../assets/icons/downVote.svg";
import upVotedIcon from "../../assets/icons/upVoted.svg";
import downVotedIcon from "../../assets/icons/downVoted.svg";
import commentIcon from "../../assets/icons/comment.svg";
import bookmarkIcon from "../../assets/icons/bookmark.svg";
import bookmarkedIcon from "../../assets/icons/bookmarked.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import loadingIcon from "../../assets/icons/loading.svg";

export default function PostPageActions({
  userId,
  data,
  contentState,
  setContentState,
  postId,
  commentSectionRef,
}) {
  const navigator = useNavigate();

  // States
  const [bookmarkStatus, setBookmarkStatus] = useState(
    contentState?.content[postId]?._count?.bookmarks,
  );
  const [bookmarkingStatus, setBookmarkingStatus] = useState("halt");

  const [voteStatus, setVoteStatus] = useState(
    (value = data?.postVotes?.[0]?.vote) =>
      value === 1 ? "upVote" : value === -1 ? "downVote" : "noVote",
  );

  const [votingStatus, setVotingStatus] = useState("halt");

  const [voteCount, setVoteCount] = useState(data?.totalVote || 0);

  const [publishingStaus, setPublishingStatus] = useState("halt");

  const [deletingStatus, setDeletingStatus] = useState("halt");
  // Refs
  const currentVote = useRef(voteStatus);
  const currentVoteCount = useRef(voteCount);

  // Handlers
  const handleBookmark = (status, id) => {
    setContentState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          ...prev.content[id],
          _count: { ...prev.content[id]._count, bookmarks: status },
        },
      },
    }));
  };

  const handleBookmarkBtnClick = async (e) => {
    e.stopPropagation();

    setBookmarkStatus((prev) => !prev);

    setBookmarkingStatus("bookmarking");

    const body = JSON.stringify({
      postId: data.id,
    });

    const response = bookmarkStatus
      ? await deleteBookmark(body)
      : await createBookmark(body);

    handleBookmark(
      response?.success ? (bookmarkStatus ? 0 : 1) : bookmarkStatus ? 1 : 0,
      data?.id,
    );

    setBookmarkStatus((prev) => (!response?.success ? !prev : prev));

    setBookmarkingStatus(response?.success ? "success" : "error");
  };

  const handleCommentButtonClick = () => {
    commentSectionRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "center",
    });
  };

  const handleDelete = (id) => {
    const { [id]: removedContent, ...restOfTheConent } = contentState.content;

    setContentState((prev) => ({
      ...prev,
      config: {
        ...prev.config,

        totalContentFetched: prev?.config?.totalContentFetched - 1,
      },
      content: restOfTheConent,
    }));
  };

  const handleDeleteBtnClick = async (e) => {
    e.stopPropagation();

    setDeletingStatus("deleting");

    const body = JSON.stringify({ postId: data?.id });
    const response = await deletePost(body);

    if (response.success) {
      handleDelete(data?.id);

      navigator("/", { replace: true });
    }

    setDeletingStatus("halt");
  };

  const submitVote = async (vote) => {
    setVotingStatus("voting");

    const body = JSON.stringify({
      postId,
      vote,
    });

    return vote === 0 ? deleteVote(body) : createVote(body);
  };

  const handleVoteButtonClick = async (button) => {
    let vote;

    if (button === "up") {
      vote = voteStatus === "upVote" ? 0 : 1;
    } else {
      vote = voteStatus === "downVote" ? 0 : -1;
    }

    const successVote =
      vote === 1 ? "upVote" : vote === -1 ? "downVote" : "noVote";

    setVoteStatus(successVote);
    setVoteCount(getUpdatedVotedCount(voteCount, voteStatus, successVote));

    const response = await submitVote(vote);

    if (response.success) {
      currentVote.current = successVote;

      setVotingStatus("halt");

      updateVoteOnContentState(postId, voteStatus, successVote);
    } else {
      setVoteStatus(currentVote.current);
      setVoteCount(currentVoteCount.current);

      setVotingStatus("halt");
    }
  };

  const getUpdatedVotedCount = (currentVoteCount, prevVote, successVote) => {
    switch (successVote) {
      case "upVote":
        return currentVoteCount + (prevVote === "downVote" ? 2 : 1);

      case "downVote":
        return currentVoteCount - (prevVote === "upVote" ? 2 : 1);

      default:
        return (
          currentVoteCount +
          (prevVote === "upVote" ? -1 : prevVote === "downVote" ? +1 : 0)
        );
    }
  };

  const updateVoteOnContentState = (id, prevVote, successVote) => {
    setContentState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          ...prev.content[id],
          totalVote: getUpdatedVotedCount(
            prev.content[id].totalVote,
            prevVote,
            successVote,
          ),
        },
      },
    }));
  };

  const handlePublish = (id) => {
    setContentState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [id]: {
          ...prev.content[id],
          published: true,
        },
      },
    }));
  };

  const handlePublishBtnClick = async (e) => {
    e.stopPropagation();

    setPublishingStatus("publishing");

    const body = JSON.stringify({
      postId: data.id,
      toggleRequest: !data?.published,
    });

    const response = await togglePostPublishStatus(body);

    if (response?.success) {
      setPublishingStatus("success");

      handlePublish(data?.id);
    } else {
      setPublishingStatus("error");
    }
  };

  return (
    <div className={styles.postPageActions}>
      <div className={styles.voteContainer}>
        <button
          className={`${styles.pageActBtn} ${styles.voteBtn} ${styles.upvoteBtn}`}
          title="Upvote"
          aria-label="Upvote"
          onClick={() => {
            handleVoteButtonClick("up");
          }}
          disabled={votingStatus === "voting"}
        >
          {voteStatus === "upVote" ? (
            <img src={upVotedIcon} alt="Upvoted Icon" />
          ) : (
            <img src={upVoteIcon} alt="Upvote Icon" />
          )}
        </button>

        <p
          className={styles.voteCount}
          title="Vote count"
          aria-label="Vote count"
        >
          {voteCount}
        </p>

        <button
          className={`${styles.pageActBtn}  ${styles.voteBtn} ${styles.downvoteBtn}`}
          title="Downvote"
          aria-label="Downvote"
          onClick={() => {
            handleVoteButtonClick("down");
          }}
          disabled={votingStatus === "voting"}
        >
          {voteStatus === "downVote" ? (
            <img src={downVotedIcon} alt="Downvoted Icon" />
          ) : (
            <img src={downVoteIcon} alt="Downvote Icon" />
          )}
        </button>
      </div>

      {userId !== data?.author?.id && (
        <button
          className={`${styles.pageActBtn}  ${bookmarkingStatus === "bookmarked" ? styles.bookMarkBtnBookmarked : styles.bookMarkBtn} `}
          title="Bookmark"
          aria-label="Bookmark"
          onClick={handleBookmarkBtnClick}
          disabled={bookmarkingStatus === "bookmarking"}
        >
          {bookmarkStatus ? (
            <img src={bookmarkedIcon} alt="Bookmarked icon" />
          ) : (
            <img className="invertImg" src={bookmarkIcon} alt="Bookmark icon" />
          )}
        </button>
      )}

      <button
        className={`${styles.pageActBtn}  ${styles.commentBtn} `}
        title="Comments"
        aria-label="Comments"
        onClick={handleCommentButtonClick}
      >
        <img src={commentIcon} alt="Comment Icon" />
      </button>

      {userId === data?.author?.id && (
        <>
          {!data?.published && (
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

          <button
            className={`${styles.pageActBtn}  ${styles.editBtn} `}
            title="Edit"
            aria-label="Edit"
          >
            <img className="invertImg" src={editIcon} alt="Edit Icon" />
          </button>

          <button
            className={`${styles.pageActBtn}  ${styles.deleteBtn} `}
            title="Delete"
            aria-label="Delete"
            onClick={handleDeleteBtnClick}
          >
            {deletingStatus === "deleting" ? (
              <img
                className={styles.loadingIcon}
                src={loadingIcon}
                alt="Loading icon"
              />
            ) : (
              <img className="invertImg" src={deleteIcon} alt="Delete icon" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
