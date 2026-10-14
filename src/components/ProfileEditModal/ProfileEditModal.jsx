import styles from "./ProfileEditModal.module.css";

// Hooks
import { useState, useRef } from "react";
import { useOutletContext } from "react-router";

// API
import { submitProfileUpdate } from "../../api/submitProfileUpdate";

// Icons
import loadingIcon from "../../assets/icons/loading.svg";
import closeIcon from "../../assets/icons/close.svg";

export default function ProfileEditModal() {
  const { userData, setUserData } = useOutletContext();

  const [submitStatus, setSubmitStatus] = useState("halt");
  const [profilePictureLinkValue, setProfilePictureLinkValue] = useState(
    userData?.personalData?.profilePictureLink,
  );
  const [textareaCount, setTextareaCount] = useState(
    userData?.personalData?.bio?.length || 0,
  );

  const modalRef = useRef();

  const handleProfilePictureLinkChange = (e) => {
    setProfilePictureLinkValue(e.target.value);
  };

  const getProfilePicture = () => {
    if (profilePictureLinkValue?.length > 1) {
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
          style={{ background: userData?.personalData?.theme_color }}
        >
          {userData?.personalData?.firstName[0]}{" "}
          {userData?.personalData?.lastName[0]}
        </div>
      );
    }
  };

  const handleTextareaChange = (e) => {
    setTextareaCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitStatus("submitting");

    const submittedData = new FormData(e.target);

    const dataObj = Object.fromEntries(submittedData);

    dataObj["userId"] = userData?.personalData?.id || "";

    const formData = JSON.stringify(dataObj);

    const result = await submitProfileUpdate(formData, userData?.jwt, "PUT");

    result.success ? handleSubmitSuccess(result) : handleSubmitFail(result);
  };

  const handleSubmitSuccess = (result) => {
    setUserData((prev) => ({ ...prev, personalData: { ...result.user } }));

    localStorage.setItem("userData", JSON.stringify(result.user));

    modalRef.current.close();
  };

  const handleSubmitFail = () => {
    setSubmitStatus("error");
  };

  return (
    <dialog className={styles.dialog} id="editProfileModal" ref={modalRef}>
      <div className={styles.dialogHeader}>
        <p>Edit your profile</p>

        <button commandfor={"editProfileModal"} command={"close"}>
          <img src={closeIcon} alt="Close icon" />
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
              defaultValue={userData?.personalData?.profilePictureLink || ""}
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
            defaultValue={userData?.personalData?.bio || ""}
          ></textarea>
          <p className={styles.lengthCount}>{textareaCount}/ 250</p>
        </div>

        <div className={styles.formFooter}>
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
    </dialog>
  );
}
