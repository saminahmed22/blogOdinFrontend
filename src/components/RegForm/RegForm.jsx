import styles from "./RegForm.module.css";

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";

import PasswordValidator from "password-validator";
import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

// API
import { fetchLoginCredit } from "../../api/fetchLoginCredit.js";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import visibilityIcon from "../../assets/icons/visibility.svg";
import visibilityOffIcon from "../../assets/icons/visibility_off.svg";

export function RegForm() {
  // const navigate = useNavigate();

  const [fetchStatus, setFetchStatus] = useState("halt");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rePasswordVisibility, setRePasswordVisibility] = useState(false);

  const [validationStatus, setValidationStatus] = useState({ status: true });

  const passwordFieldRef = useRef();
  const rePasswordFieldRef = useRef();

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const dataObj = Object.fromEntries(data);

    const isValid = validate(dataObj);

    setFetchStatus(isValid ? "fetching" : "halt");

    if (validationStatus.status) {
      const formData = JSON.stringify(dataObj);

      // const result = null
      // result.success
      //   ? handleRegistrationSuccess(result)
      //   : handleRegistrationFail(result);
    }
  };

  // const handleRegistrationSuccess = (result) => {
  //   // localStorage.setItem("jwt", JSON.stringify(result.jwt));
  //   // localStorage.setItem("userdata", JSON.stringify(result.user));
  //   // navigate("/feed", { replace: true });
  // };

  // const handleRegistrationFail = (result) => {
  //   // setFetchStatus("halt");
  //   // if (result.message) {
  //   //   setValidationStatus({
  //   //     username: true,
  //   //     usernameErrorMessage: "",
  //   //     password: true,
  //   //     passwordErrorMessage: "",
  //   //     credit: false,
  //   //     creditErrorMessage: result.message,
  //   //   });
  //   //   return;
  //   // }
  //   // const errors = {
  //   //   username: true,
  //   //   usernameMessage: "",
  //   //   password: true,
  //   //   passwordMessage: "",
  //   // };
  //   // result?.validationErrors?.map((error) => {
  //   //   if (error.path === "username") {
  //   //     errors.username = false;
  //   //     errors.usernameMessage = error.msg;
  //   //   } else if (error.path === "password") {
  //   //     errors.password = false;
  //   //     errors.passwordMessage = error.msg;
  //   //   }
  //   // });
  //   // setValidationStatus({
  //   //   username: errors.username,
  //   //   usernameErrorMessage: errors.usernameMessage,
  //   //   password: errors.password,
  //   //   passwordErrorMessage: errors.passwordMessage,
  //   //   credit: true,
  //   //   creditErrorMessage: "",
  //   // });
  // };

  const validate = (data) => {
    validateFirstName(data.firstName);
    validateLastName(data.lastName);
    validateUsername(data.username);
    validatePassword(data.password);
    validateRePassword(data.rePassword, data.password);
  };

  const validateFirstName = (value) => {
    if (value) {
      setValidationStatus((prev) => ({
        ...prev,
        status: true,
        firstName: { field: "firstName", status: true },
      }));
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        status: false,
        firstName: {
          field: "firstName",
          status: "invalid",
          message: "Please enter your first name.",
        },
      }));
    }
  };

  const validateLastName = (value) => {
    if (value) {
      setValidationStatus((prev) => ({
        ...prev,
        status: true,
        lastName: { field: "lastName", status: true },
      }));
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        status: false,
        lastName: {
          field: "lastName",
          status: "invalid",
          message: "Please enter your last name.",
        },
      }));
    }
  };

  const validateUsername = (value) => {
    if (value) {
      setValidationStatus((prev) => ({
        ...prev,
        status: true,
        username: { field: "username", status: true },
      }));
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        status: false,
        username: {
          field: "username",
          status: "invalid",
          message: "Please enter a username.",
        },
      }));
    }
  };

  const validatePassword = (value) => {
    const options = {
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    };

    const zxcvbn = new ZxcvbnFactory(options);

    const strength = zxcvbn.check(value);

    if (value) {
      const schema = new PasswordValidator();

      schema
        .is()
        .min(8) // Minimum length 8
        .is()
        .max(100) // Maximum length 100
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits(2) // Must have at least 2 digits
        .has()
        .symbols(1)
        .is()
        .not()
        .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

      const isValidPassword = schema.validate(value);

      if (!isValidPassword) {
        setValidationStatus((prev) => ({
          ...prev,
          status: false,
          password: {
            field: "password",
            status: "invalid",
            strength: strength.score,

            message:
              "Password must be 8-100 characters long and include at least one uppercase letter, one lowercase letter, two digits, and one symbol.",
          },
        }));
      } else {
        setValidationStatus((prev) => ({
          ...prev,
          status: true,
          password: {
            field: "password",
            status: true,
            strength: strength.score,
          },
        }));
      }
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        status: false,
        password: {
          field: "password",
          status: "invalid",
          message: "Please enter a password.",
          strength: strength.score,
        },
      }));
    }
  };

  const validateRePassword = (value, givenPassword) => {
    if (value) {
      if (value === givenPassword) {
        setValidationStatus((prev) => ({
          ...prev,
          status: true,
          rePassword: { field: "rePassword", status: true },
        }));
      } else {
        setValidationStatus((prev) => ({
          ...prev,
          status: false,
          rePassword: {
            field: "rePassword",
            status: "invalid",
            message: "Passwords don't match.",
          },
        }));
      }
    } else {
      setValidationStatus((prev) => ({
        ...prev,
        status: false,
        rePassword: {
          field: "rePassword",
          status: "invalid",
          message: "Please re-enter the password.",
        },
      }));
    }
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

  const getErrorMessage = (error) => {
    return (
      <div
        className={styles.errorMessageContainer}
        key={`${error?.field}_Err_Msg_Container`}
      >
        <p className={styles.errorMessage}>{error?.message}</p>
      </div>
    );
  };

  const getPasswordStrengthText = (score) => {
    switch (score) {
      case 1:
        return <span style={{ color: "red" }}>Very weak</span>;

      case 2:
        return <span style={{ color: "orange" }}>Weak</span>;

      case 3:
        return <span style={{ color: "green" }}>Strong</span>;

      case 4:
        return <span style={{ color: "limegreen" }}>Very strong</span>;

      default:
        return <span style={{ color: "black" }}>Type something</span>;
    }
  };

  const getProgressBarColor = (value) => {
    switch (value) {
      case 1:
        return "red";

      case 2:
        return "orange";

      case 3:
        return "green";

      case 4:
        return "limegreen";
      default:
        return "white";
    }
  };

  return (
    <form
      className={`${styles.regForm} ${styles.form}`}
      onSubmit={handleRegistrationSubmit}
    >
      <div className={styles.formHeading}>Register</div>

      {getMainErrorMessage()}

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="firstName">
          First name
        </label>

        <input
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="given-name"
          onChange={(e) => {
            validateFirstName(e.target.value);
          }}
        />

        {validationStatus?.firstName?.status === "invalid" &&
          getErrorMessage(validationStatus.firstName)}
      </div>

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="lastName">
          Last name
        </label>

        <input
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="family-name"
          onChange={(e) => {
            validateLastName(e.target.value);
          }}
        />

        {validationStatus?.lastName?.status === "invalid" &&
          getErrorMessage(validationStatus.lastName)}
      </div>

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>

        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
          onChange={(e) => {
            validateUsername(e.target.value);
          }}
        />

        {validationStatus?.username?.status === "invalid" &&
          getErrorMessage(validationStatus.username)}
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
            autoComplete="new-password"
            ref={passwordFieldRef}
            onChange={(e) => {
              validatePassword(e.target.value);
              validateRePassword(
                rePasswordFieldRef.current.value,
                e.target.value,
              );
            }}
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

        <div className={styles.passwordStrengthContainer}>
          <div className={styles.strengthMeterContainer}>
            <div className={styles.strengthMeterBG}></div>
            <div
              className={styles.strengthMeter}
              style={{
                backgroundColor: getProgressBarColor(
                  validationStatus?.password?.strength,
                ),
                width: `${validationStatus?.password?.strength * 25}%`,
              }}
            ></div>
          </div>
          <p>
            Strength:{" "}
            {getPasswordStrengthText(validationStatus?.password?.strength)}
          </p>
        </div>

        {validationStatus?.password?.status === "invalid" &&
          getErrorMessage(validationStatus.password)}
      </div>

      <div className={styles.fromInputContainer}>
        <label className={styles.label} htmlFor="rePassword">
          Re-enter the Password
        </label>

        <div className={styles.passwordInputContainer}>
          <input
            type={rePasswordVisibility ? "text" : "password"}
            name="rePassword"
            id="rePassword"
            autoComplete="new-password"
            ref={rePasswordFieldRef}
            onChange={(e) => {
              validateRePassword(
                e.target.value,
                passwordFieldRef.current.value,
              );
            }}
          />
          <button
            type={"button"}
            className={styles.passwordVisibilityToggleBtn}
            onClick={() => {
              setRePasswordVisibility((prev) => !prev);
            }}
            title={rePasswordVisibility ? "Hide password" : "Show password"}
          >
            <img
              src={rePasswordVisibility ? visibilityOffIcon : visibilityIcon}
              alt={
                rePasswordVisibility
                  ? "visibility off icon"
                  : "visibility on icon"
              }
            />
          </button>
        </div>

        {validationStatus?.rePassword?.status === "invalid" &&
          getErrorMessage(validationStatus.rePassword)}
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
        Already have an account? <Link to={"/auth/login"}>Login!</Link>
      </p>
    </form>
  );
}
