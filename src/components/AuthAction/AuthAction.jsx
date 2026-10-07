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

  const getHelloMessage = () => {
    if (mode === "login") {
      const userData = JSON.parse(localStorage.getItem("userdata"));

      return (
        <h2
          className={styles.helloMsg}
        >{`Welcome back, ${userData ? userData.firstName : "someone we used to know"}!`}</h2>
      );
    }
  };

  return (
    <div className={styles.authAction}>
      {getHelloMessage()}
      {mode === "login" ? <LoginForm /> : <RegForm />}
    </div>
  );
}
