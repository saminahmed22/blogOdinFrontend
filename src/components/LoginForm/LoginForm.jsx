import styles from "./LoginForm.module.css";

import { useState } from "react";
import { useNavigate, Link } from "react-router";

// API
import { fetchLoginCredit } from "../../api/fetchLoginCredit.js";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import visibilityIcon from "../../assets/icons/visibility.svg";
import visibilityOffIcon from "../../assets/icons/visibility_off.svg";

export function LoginForm() {
  const navigate = useNavigate();

  const [fetchStatus, setFetchStatus] = useState("halt");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [validationStatus, setValidationStatus] = useState({
    username: true,
    usernameErrorMessage: "",

    password: true,
    passwordErrorMessage: "",

    credit: true,
    creditErrorMessage: "",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const dataObj = Object.fromEntries(data);

    const validateUsername = validate(dataObj.username);
    const validatePassword = validate(dataObj.password);

    if (!validateUsername.status || !validatePassword.status) {
      setValidationStatus((prev) => ({
        ...prev,
        username: validateUsername.status,
        usernameErrorMessage: validateUsername.message,

        password: validatePassword.status,
        passwordErrorMessage: validatePassword.message,

        credit: true,
        creditErrorMessage: "",
      }));

      return;
    }

    const formData = JSON.stringify(dataObj);

    setFetchStatus("fetching");

    const result = await fetchLoginCredit(formData);

    result.success ? handleLoginSuccess(result) : handleLoginFail(result);
  };

  const handleLoginSuccess = (result) => {
    localStorage.setItem("jwt", JSON.stringify(result.jwt));
    localStorage.setItem("userdata", JSON.stringify(result.user));

    navigate("/feed", { replace: true });
  };

  const handleLoginFail = (result) => {
    setFetchStatus("halt");

    if (result.message) {
      setValidationStatus({
        username: true,
        usernameErrorMessage: "",

        password: true,
        passwordErrorMessage: "",

        credit: false,
        creditErrorMessage: result.message,
      });

      return;
    }

    const errors = {
      username: true,
      usernameMessage: "",
      password: true,
      passwordMessage: "",
    };

    result?.validationErrors?.map((error) => {
      if (error.path === "username") {
        errors.username = false;
        errors.usernameMessage = error.msg;
      } else if (error.path === "password") {
        errors.password = false;
        errors.passwordMessage = error.msg;
      }
    });

    setValidationStatus({
      username: errors.username,
      usernameErrorMessage: errors.usernameMessage,

      password: errors.password,
      passwordErrorMessage: errors.passwordMessage,

      credit: true,
      creditErrorMessage: "",
    });
  };

  const getMainErrorMessage = () => {
    if (validationStatus.credit) return;

    if (validationStatus?.creditErrorMessage === "!credit") {
      return (
        <div className={styles.mainErrorMessageContainer}>
          <p className={styles.mainErrorMessage}>
            Incorrect username or password
          </p>
        </div>
      );
    } else if (
      validationStatus?.creditErrorMessage === "!client" ||
      validationStatus?.creditErrorMessage === "error"
    ) {
      return (
        <div className={styles.mainErrorMessageContainer}>
          <p className={styles.mainErrorMessage}>An error occured</p>
        </div>
      );
    }
  };

  const getUsernameValidationErrorMessage = () => {
    if (validationStatus.username) return;

    const message = validationStatus.usernameErrorMessage;

    return (
      <div
        className={styles.errorMessageContainer}
        key={"usernamevalidationerrormsg"}
      >
        <p className={styles.errorMessage}>
          {message === "empty" ? "Please enter a username" : "Invalid username"}
        </p>
      </div>
    );
  };

  const getPasswordValidationErrorMessage = () => {
    if (validationStatus.password) return;

    const message = validationStatus.passwordErrorMessage;

    return (
      <div
        className={styles.errorMessageContainer}
        key={"usernamevalidationerrormsg"}
      >
        <p className={styles.errorMessage}>
          {message === "empty"
            ? "Please enter the password"
            : "Invalid password"}
        </p>
      </div>
    );
  };

  const validate = (data) => {
    if (data.length < 1) {
      return { status: false, message: "empty" };
    }

    return { status: true, message: "" };
  };

  return (
    <form
      className={`${styles.loginForm} ${styles.form}`}
      onSubmit={handleLoginSubmit}
    >
      <div className={styles.formHeading}>Login</div>

      {getMainErrorMessage()}

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>

        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
        />

        {getUsernameValidationErrorMessage()}
      </div>

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>

        <div className={styles.passwordInputContainer}>
          <input
            type={passwordVisibility ? "text" : "password"}
            name="password"
            id="password"
            autoComplete="current-password"
          />
          <button
            type={"button"}
            className={styles.passwordVisibilityToggleBtn}
            onClick={() => {
              setPasswordVisibility((prev) => !prev);
            }}
            title={passwordVisibility ? "Hide password" : "Show password"}
          >
            <img
              src={passwordVisibility ? visibilityOffIcon : visibilityIcon}
              alt={
                passwordVisibility
                  ? "visibility off icon"
                  : "visibility on icon"
              }
            />
          </button>
        </div>

        {getPasswordValidationErrorMessage()}
      </div>

      <button
        className={styles.submitBtn}
        type="submit"
        disabled={fetchStatus === "fetching"}
      >
        {fetchStatus === "fetching" ? (
          <img
            className={styles.loadingIcon}
            src={loadingIcon}
            alt="Loading icon"
          />
        ) : (
          "Submit"
        )}
      </button>
      <p className={styles.registrationRedirectLink}>
        Don't have an account yet?{" "}
        <Link to={"/auth/register"}>Register now!</Link>
      </p>
    </form>
  );
}
