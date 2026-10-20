import styles from "./ProfileCommentCard.module.css";

import { useNavigate, useParams } from "react-router";

// Components
import CommentCard from "../CommentCard/CommentCard";

export default function ProfileCommentCard({
  data,
  handleDelete,
  customStyles = {},
}) {
  const navigate = useNavigate();

  const { profileId } = useParams();

  const handlePostCardClick = () => {
    navigate(`/posts/${data?.post?.id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    if (profileId === data?.post?.author?.id) {
      return;
    }

    navigate(`/profile/${data?.post?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${data?.post.categoryId}`);
  };

  const getProfilePicture = () => {
    if (data?.post?.author?.profilePictureLink) {
      return (
        <img
          src={data?.post?.author?.profilePictureLink}
          alt="Author profile picture"
          className={styles.profilePicture}
          onClick={handleProfileClick}
        />
      );
    } else {
      const color = data?.post?.author?.theme_color;

      return (
        <div
          className={styles.altProfilePicture}
          onClick={handleProfileClick}
          style={{ backgroundColor: color }}
        >
          {`${data?.post?.author?.firstName[0]}${data?.post?.author?.lastName[0]}`}
        </div>
      );
    }
  };

  const getPostPublishStatusIcon = () => {};

  const getReadableDateLong = () => {
    const isoString = data?.post?.created_at;

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

  const getReadableDate = () => {
    const isoString = data?.post?.created_at;

    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className={styles.postCard}
      onClick={handlePostCardClick}
      style={customStyles}
    >
      <div className={styles.header}>
        <div className={styles.detailsContainer}>
          <div className={styles.profilePictureContainer}>
            {getProfilePicture()}
          </div>

          <div className={styles.details}>
            <p className={styles.authorName} onClick={handleProfileClick}>
              <span className={styles.name}>
                <span className={styles.firstName}>
                  {data?.post?.author?.firstName}
                </span>
                <span className={styles.lastName}>
                  {data?.post?.author?.lastName}
                </span>
              </span>
            </p>
            <p className={styles.postDate} title={getReadableDateLong()}>
              {getReadableDate()}
            </p>

            {getPostPublishStatusIcon()}
          </div>
        </div>

        {/* <PostCardActionPopver /> */}
      </div>

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{data?.post?.title}</h2>

        <p className={styles.category} onClick={handleCategoryClick}>
          {data?.post?.category?.name}
        </p>
      </div>

      <div className={styles.commentContainer}>
        <div className={styles.tether}></div>

        <CommentCard
          data={data}
          postAuthorID={data?.post?.author?.id}
          handleDelete={handleDelete}
          isProfileCommentCard={true}
        />
      </div>
    </div>
  );
}
