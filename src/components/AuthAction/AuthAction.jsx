import styles from "./AuthAction.module.css";

import { useState } from "react";

export function AuthAction() {
  const [selectedForm, setSelectedForm] = useState("loginForm");

  const handleRadioChange = (e) => {
    const formType = e.target.value;

    setSelectedForm(formType);
  };

  const getForm = () => {
    if (selectedForm === "loginForm") {
      return (
        <form className={`${styles.loginFrom} ${styles.form}`} action="POST">
          <div className={styles.fromInputContainer}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input type="text" name="username" id="username" />
          </div>

          <div className={styles.fromInputContainer}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input type="Password" name="password" id="password" />
          </div>
        </form>
      );
    } else {
      return <form className={`${styles.regFrom} form`} action="POST"></form>;
    }
  };

  return (
    <div className={styles.authAction}>
      <div className={styles.authFormRadioContainer}>
        <input
          type="radio"
          name="fromType"
          id="loginForm"
          value={"loginForm"}
          className={styles.authFormSelect}
          onChange={handleRadioChange}
          checked={selectedForm === "loginForm"}
        />
        <input
          type="radio"
          name="fromType"
          id="registrationForm"
          value={"registrationForm"}
          className={styles.authFormSelect}
          onChange={handleRadioChange}
          checked={selectedForm === "registrationForm"}
        />
      </div>

      <div className={styles.AuthFormContainer}>{getForm()}</div>
    </div>
  );
}
