import styles from "./PostCard.module.css";

import { Link, useNavigate } from "react-router";

import tempProfilePicture from "../../assets/images/image.png";
// Components
import PostCardActionPopver from "./postCardActBtn/PostCardActBtn";

export default function PostCard({ loading = true }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        className={`postCard ${styles.postCard}`}
        data-testid="postCardSkeleton"
      >
        <div className={styles.postDetails}>
          <div className={styles.authorDetails}>
            <div
              src={tempProfilePicture}
              className={styles.authorImageLoading}
            ></div>
            <address className={styles.authorNameLoading}></address>
          </div>
        </div>

        <div className={styles.postCardArticle}>
          <h3 className={styles.postCardTitleLoading}></h3>

          <div className={styles.skeletonPreviewContainer}>
            <p className={styles.postCardPreviewLoading}></p>
            <p className={styles.postCardPreviewLoading}></p>
            <p className={styles.postCardPreviewLoading}></p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${styles.postCard} postCard`} data-testid="postCard">
        <div className={styles.postCardHeader}>
          <div
            className={styles.authorDetails}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              navigate("/profile/Samin Ahmed");
            }}
          >
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

          <PostCardActionPopver />
        </div>

        <Link to={"/posts/123"} style={{ textDecoration: "none" }}>
          <article className={styles.postCardArticle}>
            <h3 className={styles.postCardTitle}>
              10 Habits That Quietly Make You a Better Developer
            </h3>

            <p className={styles.postCardPreview} data-testid="post-preview">
              From reading other people's code to embracing the discomfort of
              not knowing — small, consistent habits that compound into real
              growth as a developer. A quick read for anyone stuck in a learning
              plateau
            </p>
          </article>
        </Link>
      </div>
    );
  }
}
