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
    navigate(`/posts/${data?.Post?.id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    if (profileId === data?.Post?.author?.id) {
      return;
    }

    navigate(`/profile/${data?.Post?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${data?.Post.categoryId}`);
  };

  const getProfilePicture = () => {
    if (data?.Post?.author?.profilePictureLink) {
      return (
        <img
          src={data?.Post?.author?.profilePictureLink}
          alt="Author profile picture"
          className={styles.profilePicture}
          onClick={handleProfileClick}
        />
      );
    } else {
      const color = data?.Post?.author?.theme_color;

      return (
        <div
          className={styles.altProfilePicture}
          onClick={handleProfileClick}
          style={{ backgroundColor: color }}
        >
          {`${data?.Post?.author?.firstName[0]}${data?.Post?.author?.lastName[0]}`}
        </div>
      );
    }
  };

  const getPostPublishStatusIcon = () => {};

  const getReadableDateLong = () => {
    const isoString = data?.Post?.created_at;

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
    const isoString = data?.Post?.created_at;

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
                  {data?.Post?.author?.firstName}
                </span>
                <span className={styles.lastName}>
                  {data?.Post?.author?.lastName}
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
        <h2 className={styles.title}>{data?.Post?.title}</h2>

        <p className={styles.category} onClick={handleCategoryClick}>
          {data?.Post?.category?.name}
        </p>
      </div>

      <div className={styles.commentContainer}>
        <div className={styles.tether}></div>

        <CommentCard
          data={data}
          postAuthorID={data?.Post.author.id}
          handleDelete={handleDelete}
          isProfileCommentCard={true}
        />
      </div>
    </div>
  );
}
