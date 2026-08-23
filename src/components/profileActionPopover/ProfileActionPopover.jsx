import { Link } from "react-router";

import tempProfilePicture from "../../assets/images/image.png";

import styles from "./ProfileActionPopover.module.css";

export default function ProfileActionPopover() {
  return (
    <>
      <button
        title="Profile actions"
        className={`${styles.profileActBtn}`}
        popoverTarget="ProfileActionPopover"
        popoverTargetAction="toggle"
      >
        <img src={tempProfilePicture} alt="Profile picture" />
      </button>

      <dialog
        id="ProfileActionPopover"
        className={styles.ProfileActionPopover}
        popover="auto"
      >
        <Link to="/profile/1">Profile</Link>
        <Link to="/auth/logout">Logout</Link>
      </dialog>
    </>
  );
}
