import styles from "./Header.module.css";

// Hooks
import { useState } from "react";
import { Link } from "react-router";

// Components
import Searchbar from "../Searchbar/Searchbar";

// Icons
import openIcon from "../../assets/icons/asideOpen.svg";
import closeIcon from "../../assets/icons/asideClose.svg";

export default function Header({ context }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuBtnClick = (e) => {
    e.stopPropagation();

    const menu = document.querySelector(".aside");

    if (!menu) return;

    setIsSidebarOpen((prev) => !prev);

    const isVisible = menu.classList.contains("asideVisible");

    if (isVisible) {
      menu.classList.remove("asideVisible");
    } else {
      menu.classList.add("asideVisible");
    }
  };

  return (
    <header className={styles.header}>
      <Link className={styles.homeRedirectLink} to={"/feed"}>
        <h1 className={styles.heading} title="Return to the homepage">
          <span style={{ color: "orangered" }}>Q</span>uoteFork
        </h1>
      </Link>
      <Searchbar context={context} />
      <button className={styles.menuBtn} onClick={handleMenuBtnClick}>
        <img
          src={isSidebarOpen ? closeIcon : openIcon}
          alt={isSidebarOpen ? "Open icon" : "Close Icon"}
          title="Open or close menu"
        />
      </button>
    </header>
  );
}
