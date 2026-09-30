import styles from "./AuthPage.module.css";

import { useEffect } from "react";
import { useNavigate } from "react-router";

// Components
import { AuthAction } from "../AuthAction/AuthAction";

export function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!JSON.parse(localStorage.getItem("jwt"));

    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div className={styles.authPage}>
      <div className={styles.authHeroContainer}>
        <h1 className={styles.header}>
          <span className={styles.headerQ}>Q</span>uoteFork
        </h1>

        <div className={styles.quote}>
          <p>
            &quot;Every secret of a writer’s soul, every experience of his life,
            every quality of his mind, is written large in his works&quot;
          </p>
          <address>&mdash;Virginia Woolf</address>
        </div>
      </div>

      <AuthAction />
    </div>
  );
}
