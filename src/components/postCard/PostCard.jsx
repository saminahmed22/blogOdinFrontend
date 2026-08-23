import styles from "./PostCard.module.css";

import { Link } from "react-router";

import tempProfilePicture from "../../assets/images/image.png";
// Components
import PostCardActionPopver from "./postCardActBtn/PostCardActBtn";

export default function PostCard() {
  return (
    <article className={styles.postCard}>
      <PostCardActionPopver />

      <h3 className={styles.postCardTitle}>
        <Link to={"/posts/123"}>This is a title</Link>
      </h3>

      <div className={styles.postDetails}>
        <Link to={"/profile/Samin Ahmed"}>
          <div className={styles.authorDetails}>
            <img
              src={tempProfilePicture}
              alt="Author's profile picture"
              className={styles.authorImage}
              data-testid="post-author-image"
            />
            <address
              className={styles.authorName}
              data-testid="post-author-name"
            >
              Samin Ahmed
            </address>
          </div>
        </Link>

        <div className={styles.postDates}>
          <p className={styles.postCardDate} data-testid="post-upload-date">
            Created at: August 10, 2026
          </p>
          &bull;
          <p className={styles.postCardDate} data-testid="post-expiry-date">
            Last modified: August 15, 2026
          </p>
        </div>
      </div>

      <p className={styles.postCardPreview} data-testid="post-preview">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil laborum
        fugiat hic magna.
      </p>
    </article>
  );
}
