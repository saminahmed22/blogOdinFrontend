// Hooks
import { Outlet } from "react-router";

// Components
import Header from "./components/header/Header";
import { useState } from "react";

export default function App() {
  let [theme, setTheme] = useState("light");

  return (
    <>
      <Header />
      <Outlet />
      <button
        className="themeBtn"
        onClick={() => {
          if (theme === "light") {
            document.body.style.background = "rgb(40, 40, 40)";

            const postCards = document.querySelectorAll(".postCard");

            postCards.forEach((postCard) => {
              postCard.style.color = "white";
              postCard.style.background = "rgb(29 29 29)";
            });

            setTheme("dark");

            localStorage.setItem("theme", "dark");
          } else {
            document.body.style.background = "white";

            const postCards = document.querySelectorAll(".postCard");

            postCards.forEach((postCard) => {
              postCard.style.color = "black";
              postCard.style.background = "white";
            });

            setTheme("light");

            localStorage.setItem("theme", "light");
          }
        }}
      >
        Click
      </button>
    </>
  );
}
