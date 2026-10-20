import styles from "./PostPageActions.module.css";

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

export default function PostPageActions({ userId, data }) {
  return (
    <div className={styles.postPageActions}>
      <div className={styles.voteContainer}>
        <button
          className={`${styles.pageActBtn} ${styles.voteBtn} ${styles.upvoteBtn}`}
          title="Upvote"
          aria-label="Upvote"
        >
          <img src={upVoteIcon} alt="Upvote Icon" />
        </button>

        <p
          className={styles.voteCount}
          title="Vote count"
          aria-label="Vote count"
        >
          {data?.totalVote || 0}
        </p>

        <button
          className={`${styles.pageActBtn}  ${styles.voteBtn} ${styles.downvoteBtn}`}
          title="Downvote"
          aria-label="Downvote"
        >
          <img src={downVoteIcon} alt="Downvote Icon" />
        </button>
      </div>

      {userId !== data?.author?.id && (
        <button
          className={`${styles.pageActBtn}  ${styles.bookmarkBtn} `}
          title="Bookmark"
          aria-label="Bookmark"
        >
          <img className="invertImg" src={bookmarkIcon} alt="Bookmark Icon" />
        </button>
      )}

      <button
        className={`${styles.pageActBtn}  ${styles.commentBtn} `}
        title="Comments"
        aria-label="Comments"
      >
        <img src={commentIcon} alt="Comment Icon" />
      </button>

      {userId === data?.author?.id && (
        <>
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
          >
            <img className="invertImg" src={deleteIcon} alt="Delete Icon" />
          </button>
        </>
      )}
    </div>
  );
}
