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

import styles from "./Aside.module.css";

export default function Aside({ userData, setUserData }) {
  const navigate = useNavigate();

  const authStatus = !!userData?.jwt?.token;

  const handleLogoutButtonClick = () => {
    localStorage.removeItem("jwt");

    setUserData({});
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

  const getNavAccElements = () => {
    if (authStatus) {
      return (
        <div className={styles.navAccSection} onClick={handleMenuBtnClick}>
          <Link
            to={`/profile/${userData?.personalData?.id}`}
            className={styles.loginBtnLink}
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
          >
            <img src={logoutIcon} alt="logout icon" />
          </button>
        </div>
      );
    } else {
      return (
        <Link to={"/auth/login"}>
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

      default:
        return;
    }
  };

  return (
    <aside className={`${styles.aside} aside`}>
      <nav className={styles.navbar}>
        {authStatus && (
          <>
            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="createPostBtn"
            >
              <img className={styles.navBtnIcon} src={addIcon} alt="Add icon" />
              Create a post
            </button>
            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="myPostsBtn"
            >
              <img
                className={styles.navBtnIcon}
                src={postIcon}
                alt="Post icon"
              />
              My posts
            </button>
            <button
              className={`${styles.navBtn}`}
              onClick={handleNavBtnClick}
              id="myCommentsBtn"
            >
              <img
                className={styles.navBtnIcon}
                src={commentIcon}
                alt="Comment icon"
              />
              My comments
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
            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={messageIcon}
                alt="Chats icon"
              />
              Chats
            </button>

            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={notificationIcon}
                alt="Notification icon"
              />
              Notifications
            </button>

            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={bookmarkIcon}
                alt="Bookmark icon"
              />
              Bookmarks
            </button>

            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={draftIcon}
                alt="Draft icon"
              />
              Drafts
            </button>

            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={followingIcon}
                alt="Following icon"
              />
              Following
            </button>

            <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
              <img
                className={styles.navBtnIcon}
                src={followerIcon}
                alt="Follower icon"
              />
              Followers
            </button>
          </>
        )}

        <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
          <img
            className={styles.navBtnIcon}
            src={trendIcon}
            alt="Trending icon"
          />
          Trending
        </button>

        <button className={`${styles.navBtn}`} onClick={handleNavBtnClick}>
          <img
            className={styles.navBtnIcon}
            src={newsIcon}
            alt="Newsletter icon"
          />
          Newsletter
        </button>
      </nav>

      {getNavAccElements()}
    </aside>
  );
}
