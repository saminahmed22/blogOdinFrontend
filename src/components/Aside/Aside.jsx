import { Link } from "react-router";

// Icons
import addIcon from "../../assets/icons/add.svg";
import loginIcon from "../../assets/icons/login.svg";
import logoutIcon from "../../assets/icons/logout.svg";

// Image
// import profilePicture from "../../assets/images/image.png";

import styles from "./Aside.module.css";

export default function Aside({ userData, setUserData }) {
  const authStatus = !!userData.jwt;

  const handleLogoutButtonClick = () => {
    localStorage.clear();

    setUserData({});
  };

  const getNavAccElements = () => {
    if (authStatus) {
      return (
        <div className={styles.navAccSection}>
          <Link
            to={`/profile/${userData.personalData.id}`}
            className={styles.loginBtnLink}
          >
            <button className={`${styles.navBtn}  ${styles.profileBtn}`}>
              {userData.personalData.profilePictureLink ? (
                <img
                  src={userData.personalData.profilePictureLink}
                  className={styles.profilePicture}
                  alt=""
                />
              ) : (
                <div
                  className={styles.altProfilePicture}
                  style={{ backgroundColor: userData.personalData.theme_color }}
                >
                  {userData.personalData.firstName[0]}
                  {userData.personalData.lastName[0]}
                </div>
              )}

              {`${userData.personalData.firstName} ${userData.personalData.lastName}`}
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

  return (
    <aside className={`${styles.aside} aside`}>
      <nav className={styles.navbar}>
        <button className={`${styles.navBtn}`}>
          <img className={styles.navBtnIcon} src={addIcon} alt="Add icon" />
          Create a post
        </button>
      </nav>

      {getNavAccElements()}
    </aside>
  );
}
