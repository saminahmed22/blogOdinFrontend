import { Link } from "react-router";

import styles from "./Header.module.css";

// Icons

// Components
import Navbar from "../navbar/Navbar";

export default function Header({ userData = null }) {
  return (
    <header className={styles.header}>
      <Link className={styles.homeRedirectLink} to={"/"}>
        <h1 className={styles.heading} title="Return to the homepage">
          <span style={{ color: "orangered" }}>Q</span>uoteFork
        </h1>
      </Link>

      <Navbar userData={userData} />
    </header>
  );
}
