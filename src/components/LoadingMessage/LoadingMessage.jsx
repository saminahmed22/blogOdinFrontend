import styles from "./LoadingMessage.module.css";

import loadingIcon from "../../assets/icons/loading.svg";

export default function LoadingMessage({ message = null }) {
  return (
    <div className={styles.messageContainer}>
      <span className={styles.messageSpan}>
        <img src={loadingIcon} alt="Loading icon" />
        <p className={styles.message}>{message || "Loading categories"}</p>
      </span>
    </div>
  );
}
