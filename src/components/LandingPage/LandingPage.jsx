import styles from "./LandingPage.module.css";

import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      navigate("/feed", { replace: true });
      return;
    }
  });

  return (
    <div className={styles.landingPage}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroText}>
          <span style={{ color: "orangered" }}>Q</span>uoteFork
        </h1>
        <p className={styles.heroDialog}>
          Share your thoughts, experiecne, and journey with others the way it's
          meant to be.
        </p>
      </div>
      <div className={styles.actions} role="main">
        <Link className={`${styles.link} ${styles.feedLink}`} to={"/feed"}>
          Check it out!
        </Link>
        <Link
          className={`${styles.link} ${styles.loginLink}`}
          to={"/auth/login"}
        >
          Log in
        </Link>
        <Link
          className={`${styles.link} ${styles.regLink}`}
          to={"/auth/register"}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
