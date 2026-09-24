import { Link } from "react-router";

import styles from "./Header.module.css";

// Icons
import menuIcon from "../../assets/icons/menu.svg";

// Components
import Searchbar from "../Searchbar/Searchbar";

export default function Header() {
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

  return (
    <header className={styles.header}>
      <Link className={styles.homeRedirectLink} to={"/"}>
        <h1 className={styles.heading} title="Return to the homepage">
          <span style={{ color: "orangered" }}>Q</span>uoteFork
        </h1>
      </Link>
      <Searchbar />
      <button className={styles.menuBtn} onClick={handleMenuBtnClick}>
        <img src={menuIcon} alt="Menu icon" title="Open or close menu" />
      </button>
    </header>
  );
}
