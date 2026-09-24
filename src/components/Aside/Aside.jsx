import { Link } from "react-router";

// Icons
import addIcon from "../../assets/icons/add.svg";
import loginIcon from "../../assets/icons/login.svg";
import logoutIcon from "../../assets/icons/logout.svg";

// Image
import profilePicture from "../../assets/images/image.png";

import styles from "./Aside.module.css";

export default function Aside({ userData = null }) {
  const authStatus = userData?.auth;

  const getNavAccElements = () => {
    if (authStatus) {
      return (
        <div className={styles.navAccSection}>
          <Link to={"/profile/1"} className={styles.loginBtnLink}>
            <button className={`${styles.navBtn}  ${styles.profileBtn}`}>
              <img
                src={profilePicture}
                className={styles.profilePicture}
                alt=""
              />
              Samin Ahmed
            </button>
          </Link>

          <button className={` ${styles.navBtn} ${styles.logoutBtn}`}>
            <img src={logoutIcon} alt="logout icon" />
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.navAccSection}>
          <button className={` ${styles.navBtn} ${styles.loginBtn}`}>
            <img src={loginIcon} alt="Add icon" className="invertImg" />
            <span>Login or Sign up</span>
          </button>
        </div>
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
