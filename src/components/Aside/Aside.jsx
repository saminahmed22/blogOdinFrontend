// Hooks
import { useState } from "react";
import { Link, useNavigate } from "react-router";

// Icons
import addIcon from "../../assets/icons/add.svg";
import loginIcon from "../../assets/icons/login.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import postIcon from "../../assets/icons/post.svg";
import commentIcon from "../../assets/icons/comment.svg";
import trendIcon from "../../assets/icons/trend.svg";
import messageIcon from "../../assets/icons/message.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import bookmarkIcon from "../../assets/icons/bookmark.svg";
import draftIcon from "../../assets/icons/draft.svg";
import followerIcon from "../../assets/icons/follower.svg";
import followingIcon from "../../assets/icons/following.svg";
import newsIcon from "../../assets/icons/news.svg";
import openIcon from "../../assets/icons/asideOpen.svg";
import closeIcon from "../../assets/icons/asideClose.svg";

import styles from "./Aside.module.css";

export default function Aside({ userData, setUserData }) {
  const userPreferences = JSON.parse(localStorage.getItem("prefs"));

  // States
  const [isShrinked, setIsShrinked] = useState(userPreferences?.asideShrink);

  const navigate = useNavigate();

  const authStatus = !!userData?.jwt?.token;

  const handleLogoutButtonClick = () => {
    localStorage.removeItem("jwt");

    const localUserData = JSON.parse(localStorage.getItem("userData"));

    const remainingUserData = { firstName: localUserData.firstName };

    localStorage.setItem("userData", JSON.stringify(remainingUserData));

    setUserData(remainingUserData);
  };

  const handleMenuBtnClick = () => {
    const menu = document.querySelector(".aside");

    if (!menu) return;

    const isVisible = menu.classList.contains("asideVisible");

    if (isVisible) {
      menu.classList.remove("asideVisible");
    } else {
      menu.classList.add("asideVisible");
    }
  };

  const handleAsideShrinkBtnClick = () => {
    setIsShrinked((prev) => !prev);

    localStorage.setItem(
      "prefs",
      JSON.stringify({ ...userPreferences, asideShrink: !isShrinked }),
    );
  };

  const getNavAccElements = () => {
    if (authStatus) {
      return (
        <div className={styles.navAccSection} onClick={handleMenuBtnClick}>
          <Link
            to={`/profile/${userData?.personalData?.id}`}
            className={styles.loginBtnLink}
            title="Profile"
            aria-label="Profile"
          >
            <button className={`${styles.navBtn}  ${styles.profileBtn}`}>
              {userData?.personalData?.profilePictureLink ? (
                <img
                  src={userData?.personalData?.profilePictureLink}
                  className={styles.profilePicture}
                  alt=""
                />
              ) : (
                <div
                  className={styles.altProfilePicture}
                  style={{
                    backgroundColor: userData?.personalData?.theme_color,
                  }}
                >
                  {userData?.personalData?.firstName[0]}
                  {userData?.personalData?.lastName[0]}
                </div>
              )}

              <span className={styles.name}>
                <span className={styles.firstName}>
                  {userData?.personalData?.firstName}
                </span>
                <span className={styles.lastName}>
                  {userData?.personalData?.lastName}
                </span>
              </span>
            </button>
          </Link>

          <button
            className={` ${styles.navBtn} ${styles.logoutBtn}`}
            onClick={handleLogoutButtonClick}
            title="Log out"
            aria-label="Log out"
          >
            <img src={logoutIcon} alt="logout icon" />
          </button>
        </div>
      );
    } else {
      return (
        <Link to={"/auth/login"} title="Log in" aria-label="Log in">
          <div className={styles.navAccSection}>
            <button className={` ${styles.navBtn} ${styles.loginBtn}`}>
              <img src={loginIcon} alt="Add icon" className="invertImg" />
              <span>Login or Sign up</span>
            </button>
          </div>
        </Link>
      );
    }
  };

  const handleNavBtnClick = (e) => {
    handleMenuBtnClick();

    const buttonID = e.target.id;

    if (!buttonID) return;

    switch (buttonID) {
      case "myPostsBtn":
        navigate(`/profile/posts/${userData.personalData.id}`);
        break;

      case "myCommentsBtn":
        navigate(`/profile/comments/${userData.personalData.id}`);
        break;

      case "draftsBtn":
        navigate(`/drafts`);
        break;

      default:
        return;
    }
  };

  return (
    <aside className={`${styles.aside} ${isShrinked && styles.shrinked} aside`}>
      <button
        className={styles.asideShrinkBtn}
        onClick={handleAsideShrinkBtnClick}
        title={isShrinked ? "Open sidebar" : "Close sidebar"}
      >
        <img
          src={isShrinked ? closeIcon : openIcon}
          alt={isShrinked ? "Close Icon" : "Open icon"}
        />
      </button>

      <nav className={styles.navbar}>
        {authStatus && (
          <>
            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="createPostBtn"
              title="Create a post"
              aria-label="Create a post"
            >
              <img className={styles.navBtnIcon} src={addIcon} alt="Add icon" />
              <span>Create a post</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="myPostsBtn"
              title="Posts"
              aria-label="Posts"
            >
              <img
                className={styles.navBtnIcon}
                src={postIcon}
                alt="Post icon"
              />
              <span>My posts</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="myCommentsBtn"
              title="Comments"
              aria-label="Comments"
            >
              <img
                className={styles.navBtnIcon}
                src={commentIcon}
                alt="Comment icon"
              />
              <span>My comments</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="draftsBtn"
              title="Drafts"
              aria-label="Drafts"
            >
              <img
                className={styles.navBtnIcon}
                src={draftIcon}
                alt="Draft icon"
              />
              <span>Drafts</span>
            </button>
          </>
        )}

        {/* Add ID to the button when moving buttons here */}
        <span
          className={styles.fillerText}
          title="The options below are filler options just to fill up the navbar, they don't do anything lol."
          aria-label="The options below are filler options just to fill up the navbar, they don't do anything lol."
        >
          Filler options
        </span>

        {authStatus && (
          <>
            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              title="Chats"
              aria-label="Chats"
            >
              <img
                className={styles.navBtnIcon}
                src={messageIcon}
                alt="Chats icon"
              />
              <span>Chats</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              title="Notifications"
              aria-label="Notifications"
            >
              <img
                className={styles.navBtnIcon}
                src={notificationIcon}
                alt="Notification icon"
              />
              <span>Notifications</span>
            </button>

            <button
              className={`${styles.navBtn} `}
              onClick={handleNavBtnClick}
              title="Bookmarks"
              aria-label="Bookmarks"
            >
              <img
                className={`${styles.navBtnIcon} invertImg`}
                src={bookmarkIcon}
                alt="Bookmark icon"
              />
              <span>Bookmarks</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              title="Following"
              aria-label="Following"
            >
              <img
                className={styles.navBtnIcon}
                src={followingIcon}
                alt="Following icon"
              />
              <span>Following</span>
            </button>

            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              title="Followers"
              aria-label="Followers"
            >
              <img
                className={styles.navBtnIcon}
                src={followerIcon}
                alt="Follower icon"
              />
              <span>Followers</span>
            </button>
          </>
        )}

        <button
          className={`${styles.navBtn}`}
          onClick={handleNavBtnClick}
          title="Trending"
          aria-label="Trending"
        >
          <img
            className={styles.navBtnIcon}
            src={trendIcon}
            alt="Trending icon"
          />
          <span>Trending</span>
        </button>

        <button
          className={`${styles.navBtn}`}
          onClick={handleNavBtnClick}
          title="Newsletter"
          aria-label="Newsletter"
        >
          <img
            className={styles.navBtnIcon}
            src={newsIcon}
            alt="Newsletter icon"
          />
          <span>Newsletter</span>
        </button>
      </nav>

      {getNavAccElements()}
    </aside>
  );
}
