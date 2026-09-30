import styles from "./AuthAction.module.css";

import { useParams } from "react-router";

// Components
import { LoginForm } from "../LoginForm/LoginForm";
import { RegForm } from "../RegForm/RegForm";

export function AuthAction() {
  const { mode } = useParams();

  if (mode !== "login" && mode !== "register") {
    window.history.pushState(null, "", "/auth/register");
  }

  return (
    <div className={styles.authAction}>
      {mode === "login" ? <LoginForm /> : <RegForm />}
    </div>
  );
}
