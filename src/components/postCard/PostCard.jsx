import styles from "./PostCard.module.css";

// Hooks
import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";

// Components
import PostCardActions from "../PostCardActions/PostCardActions";

// Helpers
import { getDate } from "../../helpers/getDate";

export default function PostCard({
  data,
  customStyles = {},
  handleBookmark,
  handlePublish,
  handleDelete,
  isBookmarkPage,
  isDraftPage,
}) {
  const [publishStaus, setPublishStaus] = useState(data?.published);
  const [bookmarkStatus, setBookmarkStatus] = useState(
    data?._count?.bookmarks === 1,
  );

  const { userData } = useOutletContext();

  const navigate = useNavigate();

  const { profileId } = useParams();

  const handlePostCardClick = () => {
    navigate(`/posts/${data?.id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    if (profileId === data?.author?.id) {
      return;
    }

    navigate(`/profile/${data?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${data.categoryId}`);
  };

  const getProfilePicture = () => {
    if (data?.author?.profilePictureLink) {
      return (
        <img
          src={data?.author?.profilePictureLink}
          alt="Author profile picture"
          className={styles.profilePicture}
          onClick={handleProfileClick}
        />
      );
    } else {
      const color = data?.author?.theme_color;

      return (
        <div
          className={styles.altProfilePicture}
          onClick={handleProfileClick}
          style={{ backgroundColor: color }}
        >
          {`${data?.author?.firstName[0]}${data?.author?.lastName[0]}`}
        </div>
      );
    }
  };

  const getShortDesc = () => {
    let text = data?.plain;

    if (text?.length >= 500) {
      text = text.substring(0, 500);

      text += "...";
    }

    return text;
  };

  return (
    <div
      className={styles.postCard}
      onClick={handlePostCardClick}
      style={{
        ...customStyles,
        ...(data?.author?.id === userData?.personalData?.id
          ? { backgroundColor: "#ff44001b" }
          : {}),
      }}
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
                  {data?.author?.firstName}
                </span>
                <span className={styles.lastName}>
                  {data?.author?.lastName}
                </span>
              </span>
            </p>
            <p
              className={styles.postDate}
              title={getDate({ isoString: data?.created_at, longDate: true })}
            >
              {getDate({ isoString: data?.created_at })}
            </p>
          </div>
        </div>

        <PostCardActions
          data={data}
          userId={userData?.personalData?.id}
          publishStaus={publishStaus}
          setPublishStaus={setPublishStaus}
          bookmarkStatus={bookmarkStatus}
          setBookmarkStatus={setBookmarkStatus}
          handleDelete={handleDelete}
          handlePublish={handlePublish}
          isBookmarkPage={isBookmarkPage}
          isDraftPage={isDraftPage}
          handleBookmark={handleBookmark}
        />
      </div>

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{data?.title}</h2>

        <p
          className={styles.category}
          onClick={handleCategoryClick}
          style={{ backgroundColor: data?.category?.color }}
        >
          {data?.category?.name}
        </p>
      </div>

      <article className={styles.description}>{getShortDesc()}</article>
    </div>
  );
}
