import styles from "./ProfilePage.module.css";

// Hooks
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

// Components
import ProfilePagePosts from "../ProfilePagePosts/ProfilePagePosts";
import ProfilePageComments from "../ProfilePageComments/ProfilePageComments";

// API
import { fetchUserData } from "../../api/fetchUserData";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";

export default function ProfilePage() {
  const { profileId, contentType } = useParams();

  const navigate = useNavigate();

  const [targetUser, setTargetUser] = useState();
  const [fetchStatus, setFetchStatus] = useState("fetching");

  const [posts, setPosts] = useState({
    fetchConfig: {
      quantity: 10,
      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
      initial: true,
    },

    postsObj: {},
  });

  const [comments, setComments] = useState({
    fetchConfig: {
      quantity: 10,
      hasMore: false,
      count: 0,
      amount: 0,
      cursor: undefined,
      initial: true,
    },

    commentsObj: {},
  });

  // No content type selected
  useEffect(() => {
    if (!contentType) {
      navigate(`/profile/posts/${profileId}`, { replace: true });
    }
  }, [contentType, profileId, navigate]);

  // Initial user data fetch
  useEffect(() => {
    const fetchFunc = async () => {
      const result = await fetchUserData(profileId);

      if (result.success) {
        setFetchStatus("success");

        setTargetUser(result.user);
      } else {
        setFetchStatus("error");
      }
    };

    fetchFunc();
  }, [profileId]);

  function getProfilePicture() {
    {
      if (targetUser?.profilePictureLink) {
        return (
          <img
            src={targetUser?.profilePicture}
            className={styles.profilePicture}
            alt="Profile picture"
          />
        );
      } else {
        return (
          <div
            className={styles.profilePicture}
            style={{
              backgroundColor: targetUser.theme_color,
            }}
          >
            {targetUser?.firstName[0] ? targetUser?.firstName[0] : ""}
            {targetUser?.lastName[0] ? targetUser?.lastName[0] : ""}
          </div>
        );
      }
    }
  }

  const getReadableDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getHeader = () => {
    return (
      <h2 className={styles.contentBodyHeader}>
        <input
          type="radio"
          name="userContentSelect"
          id="userContentPosts"
          className={styles.radioPosts}
          value={"posts"}
          onChange={() => {
            if (contentType === "posts") return;

            navigate(`/profile/posts/${profileId}`, { replace: true });
          }}
          checked={contentType === "posts"}
        />
        <label htmlFor="userContentPosts">Posts</label>

        <input
          type="radio"
          name="userContentSelect"
          id="userContentComments"
          className={styles.radioComments}
          value={"comments"}
          onChange={() => {
            if (contentType === "comments") return;

            navigate(`/profile/comments/${profileId}`, { replace: true });
          }}
          checked={contentType === "comments"}
        />
        <label htmlFor="userContentComments">Comments</label>
      </h2>
    );
  };

  switch (fetchStatus) {
    case "success":
      return (
        <div className={styles.profilePage}>
          <div className={styles.header}>
            {getProfilePicture()}

            <span className={styles.name}>
              <span className={styles.firstName}>{targetUser?.firstName}</span>
              <span className={styles.lastName}>{targetUser?.lastName}</span>
            </span>

            <p className={styles.bio}>{targetUser?.bio}</p>

            <p>
              <span style={{ fontWeight: 500 }}>Member since:</span>{" "}
              {getReadableDate(targetUser.joined_at)}
            </p>
          </div>
          <div className={styles.contentBody}>
            {getHeader()}

            {contentType === "posts" ? (
              <ProfilePagePosts
                key={profileId}
                profileId={profileId}
                posts={posts}
                setPosts={setPosts}
                userFirstName={targetUser.firstName}
              />
            ) : (
              <ProfilePageComments
                key={profileId}
                profileId={profileId}
                comments={comments}
                setComments={setComments}
                userFirstName={targetUser.firstName}
              />
            )}
          </div>
        </div>
      );

    case "fetching":
      return (
        <div className={styles.loadingMessageContainer}>
          <img
            className={styles.loadingIcon}
            src={loadingIcon}
            alt="Loading icon"
          />
          <p className={styles.loadingMessage}>Loading profile</p>
        </div>
      );

    case "error":
      return <p className={styles.errorMessage}>An error occured.</p>;
  }
}
