import styles from "./PostCardActBtn.module.css";

import optionsIcon from "../../assets/icons/options.svg";

export default function PostCardActionPopver() {
  const handlePostCardActionClick = (e) => {};

  return (
    <PostCardActionPopver>
      <button
        title="Post card actions"
        className={`${styles.postCardActBtn} invertSVG`}
        popoverTarget="postCardActPopover"
        popoverTargetAction="toggle"
        onClick={handlePostCardActionClick}
      >
        <img src={optionsIcon} alt="Options icon" />
      </button>

      <dialog
        id="postCardActPopover"
        className={styles.postCardActPopover}
        popover="auto"
        data-testid="dialog"
      >
        <button className={styles.editBtn}>Edit</button>
        <button className={styles.deleteBtn}>Delete</button>
        <button className={styles.saveBtn}>Save</button>
        <button className={styles.reportBtn}>Report</button>
      </dialog>
    </PostCardActionPopver>
  );
}
