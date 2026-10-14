import styles from "./AuthAction.module.css";

// Hooks
import { useState } from "react";
import { useParams } from "react-router";

// Components
import { LoginForm } from "../LoginForm/LoginForm";
import { RegForm } from "../RegForm/RegForm";
import ProfileSetupForm from "../profileSetupForm/profileSetupForm";

// Icons
import checkIcon from "../../assets/icons/check.svg";

export function AuthAction() {
  const { mode } = useParams();

  //  onGoing, halt, complete
  const [regStep, setRegStep] = useState({
    step: "reg",
    reg: "onGoing",
    profile: "halt",
  });

  if (mode !== "login" && mode !== "register") {
    window.history.pushState(null, "", "/auth/register");
  }

  const getHelloMessage = () => {
    if (mode === "login") {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (userData) {
        return (
          <h2 className={styles.helloMsg}>
            Welcome back, {<p className={styles.name}>{userData?.firstName}</p>}
            !
          </h2>
        );
      }
    }
  };

  const getRegProgressBar = () => {
    if (mode !== "register") return;

    const regCircle = (
      <div
        className={`${styles.stepCircle} ${regStep.reg === "complete" ? styles.stepCircleComplete : styles.stepCircleCurrent}`}
        onClick={moveRegStepTwo}
      >
        {regStep.reg === "complete" ? (
          <img className="invertImg" src={checkIcon} alt="Check icon" />
        ) : regStep.reg === "onGoing" ? (
          <div className={styles.stepCircleInner}></div>
        ) : (
          ""
        )}
      </div>
    );

    const profileCircle = (
      <div
        className={`${styles.stepCircle}  ${regStep.profile === "complete" ? styles.stepCircleComplete : styles.stepCircleCurrent} ${regStep.profile === "onGoing" ? styles.stepCircleCurrentProfile : ""}`}
      >
        {regStep.profile === "complete" ? (
          <img className="invertImg" src={checkIcon} alt="Check icon" />
        ) : regStep.profile === "onGoing" ? (
          <div
            className={`${styles.stepCircleInner} ${regStep.profile === "onGoing" ? styles.stepCircleInnerProfile : ""}`}
          ></div>
        ) : (
          ""
        )}
      </div>
    );

    const progressLine = (
      <div
        className={`${regStep.step === "reg" ? styles.progressLine : styles.progressLineProfile}`}
      ></div>
    );

    return (
      <div className={styles.getRegProgressBar}>
        {regCircle}
        {progressLine}
        {profileCircle}
      </div>
    );
  };

  const moveRegStepTwo = () => {
    setRegStep({
      step: "profile",
      reg: "complete",
      profile: "onGoing",
    });
  };

  return (
    <div className={styles.authAction}>
      {getHelloMessage()}
      {getRegProgressBar()}
      {mode === "login" ? (
        <LoginForm />
      ) : regStep.step === "reg" ? (
        <RegForm moveRegStepTwo={moveRegStepTwo} />
      ) : (
        <ProfileSetupForm />
      )}
    </div>
  );
}
