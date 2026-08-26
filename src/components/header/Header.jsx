import { Link } from "react-router";
import { useState } from "react";

import styles from "./Header.module.css";

// Icons
import addIcon from "../../assets/icons/add.svg";
import loginIcon from "../../assets/icons/login.svg";

// Components
import ProfileActionPopover from "./profileActionPopover/ProfileActionPopover";

export default function Header() {
  const [authStatus, setAuthStatus] = useState(localStorage.getItem("jwt"));

  const getNavElements = () => {
    if (authStatus) {
      return (
        <>
          <button
            className={`${styles.navPrimaryBtn} postBtn`}
            title="Create a post"
            data-testid="postBtn"
          >
            <img src={addIcon} alt="Add icon" />
            <span>Create a post</span>
          </button>

          <ProfileActionPopover />
        </>
      );
    } else {
      return (
        <button
          className={`${styles.navPrimaryBtn} loginBtn`}
          title="Login or Sign up"
          data-testid="loginBtn"
          onClick={() => {
            setAuthStatus((prev) => !prev);
          }}
        >
          <img src={loginIcon} alt="Login icon" />

          <span>Login/Sign up</span>
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
