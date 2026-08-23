import { Link } from "react-router";

import styles from "./Header.module.css";

// Icons
import addIcon from "../../assets/icons/add.svg";
import loginIcon from "../../assets/icons/login.svg";

// Components
import ProfileActionPopover from "../profileActionPopover/ProfileActionPopover";

export default function Header({ authStatus = true }) {
  const getNavElements = () => {
    if (authStatus) {
      return (
        <>
          <button
            className={`${styles.navPrimaryBtn} createPostBtn`}
            title="Create a post"
          >
            <img src={addIcon} alt="Add icon" />
            Create a post
          </button>

          <ProfileActionPopover />
        </>
      );
    } else {
      return (
        <button
          className={`${styles.navPrimaryBtn} loginBtn`}
          title="Login or Sign up"
        >
          <img src={loginIcon} alt="Login icon" />
          Login/Sign up
        </button>
      );
    }
  };

  return (
    <header className={styles.header}>
      <Link className={styles.homeRedirectLink} to={"/"}>
        <h1 title="Return to the homepage">BlogOdin</h1>
      </Link>

      <nav className={styles.navbar}>{getNavElements()}</nav>
    </header>
  );
}
