import styles from "./PostCard.module.css";

import { useNavigate } from "react-router";

export default function PostCard({ post = {} }) {
  const navigate = useNavigate();

  const handlePostCardClick = () => {
    navigate(`/posts/${post?.id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    navigate(`/profile/${post?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${post.categoryId}`);
  };

  const getProfilePicture = () => {
    if (post?.author?.profilePictureLink) {
      return (
        <img
          src={post?.author?.profilePictureLink}
          alt="Author profile picture"
          className={styles.profilePicture}
          onClick={handleProfileClick}
        />
      );
    } else {
      const color = post?.author?.theme_color;

      return (
        <div
          className={styles.altProfilePicture}
          onClick={handleProfileClick}
          style={{ backgroundColor: color }}
        >
          {`${post?.author?.firstName[0]}${post?.author?.lastName[0]}`}
        </div>
      );
    }
  };

  const getPostPublishStatusIcon = () => {};

  const getShortDesc = () => {
    let text = post?.description;

    if (text?.length >= 500) {
      text = text.substring(0, 500);

      text += "...";
    }

    return text;
  };

  const getReadableDate = () => {
    const isoString = post?.created_at;

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

  return (
    <div className={styles.postCard} onClick={handlePostCardClick}>
      <div className={styles.header}>
        <div className={styles.detailsContainer}>
          <div className={styles.profilePictureContainer}>
            {getProfilePicture()}
          </div>

          <div className={styles.details}>
            <p className={styles.authorName} onClick={handleProfileClick}>
              {`${post?.author?.firstName} ${post?.author?.lastName}`}
            </p>
            <p className={styles.postDate}>{getReadableDate()}</p>

            {getPostPublishStatusIcon()}
          </div>
        </div>

        {/* <PostCardActionPopver /> */}
      </div>

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{post?.title}</h2>

        <p className={styles.category} onClick={handleCategoryClick}>
          {post?.category?.name}
        </p>
      </div>

      <article className={styles.description}>{getShortDesc()}</article>
    </div>
  );
}
