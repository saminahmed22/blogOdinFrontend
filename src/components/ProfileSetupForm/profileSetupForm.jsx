import styles from "./ProfileSetupForm.module.css";

// Hooks
import { useState } from "react";
import { useNavigate } from "react-router";

// API
import { updateProfile } from "../../api/userAPI";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";

export default function ProfileSetupForm({ data }) {
  const navigate = useNavigate();

  const [submitStatus, setSubmitStatus] = useState("halt");
  const [profilePictureLinkValue, setProfilePictureLinkValue] = useState("");
  const [textareaCount, setTextareaCount] = useState(0);

  const handleProfilePictureLinkChange = (e) => {
    setProfilePictureLinkValue(e.target.value);
  };

  const getProfilePicture = () => {
    if (profilePictureLinkValue.length > 1) {
      return (
        <img
          className={styles.profilePicture}
          src={profilePictureLinkValue}
          alt={"Profile picture"}
        />
      );
    } else {
      return (
        <div
          className={styles.profilePicture}
          style={{ background: data.theme_color }}
        >
          {data.firstName[0]} {data.lastName[0]}
        </div>
      );
    }
  };

  const handleTextareaChange = (e) => {
    setTextareaCount(e.target.value.length);
  };

  const handleSkipBtnClick = () => {
    navigate("/feed", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitStatus("submitting");

    const submittedData = new FormData(e.target);

    const dataObj = Object.fromEntries(submittedData);

    const formData = JSON.stringify(dataObj);

    const response = await updateProfile(formData);

    response.success
      ? handleSubmitSuccess(response.result)
      : handleSubmitFail();
  };

  const handleSubmitSuccess = (result) => {
    localStorage.setItem("userData", JSON.stringify(result.user));

    navigate("/feed", { replace: true });
  };

  const handleSubmitFail = () => {
    setSubmitStatus("error");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeading}>
        Hey <span className={styles.name}>{data.firstName}</span>, let's finish
        setting up your profile!
      </div>

      <div className={styles.profilePictureSection}>
        {getProfilePicture()}

        <div className={styles.inputContainer}>
          <label htmlFor="profilePictureLink">
            Link for a profile picture:
          </label>
          <input
            type="text"
            name="profilePictureLink"
            id="profilePictureLink"
            className={styles.profilePictureLink}
            onChange={handleProfilePictureLinkChange}
          />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="bio">Set up a bio:</label>
        <textarea
          name="bio"
          id="bio"
          className={styles.bio}
          onChange={handleTextareaChange}
          maxLength={250}
        ></textarea>
        <p className={styles.lengthCount}>{textareaCount}/ 250</p>
      </div>

      <div className={styles.formFooter}>
        <button type="button" onClick={handleSkipBtnClick}>
          Skip
        </button>

        <button type="submit" disabled={submitStatus === "submitting"}>
          {submitStatus === "halt" ? (
            "Submit"
          ) : submitStatus === "error" ? (
            <span style={{ color: "crimson" }}>Error</span>
          ) : (
            <img
              className={styles.loadingIcon}
              src={loadingIcon}
              alt="Loading icon"
            />
          )}
        </button>
      </div>
    </form>
  );
}
