import styles from "./LoadingMessage.module.css";

import loadingIcon from "../../assets/icons/loading.svg";

export default function LoadingMessage({
  message = null,
  customStylings = {},
}) {
  return (
    <div className={styles.messageContainer} style={customStylings}>
      <span className={styles.messageSpan}>
        <img src={loadingIcon} alt="Loading icon" />
        <p className={styles.message}>{message || "Loading categories"}</p>
      </span>
    </div>
  );
}
