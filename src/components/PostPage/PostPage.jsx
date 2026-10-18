import styles from "./PostPage.module.css";

import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";

// Components
import CommentSection from "../CommentSection/CommentSection";

// API
import { fetchPost } from "../../api/postsAPI";

// Icons
import upIcon from "../../assets/icons/up.svg";
import loadingIcon from "../../assets/icons/loading.svg";

export default function PostPage() {
  const navigate = useNavigate();

  const { postId } = useParams();

  const { feedPosts, searchPosts } = useOutletContext();

  // States
  const [fetchStatus, setFetchStatus] = useState("fetching");
  const [post, setPost] = useState();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs
  const postPageRef = useRef();

  // Effects
  useEffect(() => {
    const getPost = async () => {
      let post;

      post = feedPosts?.content?.[postId];
      if (post) {
        setPost(post);

        setFetchStatus("success");

        return;
      }

      post = searchPosts?.content?.[postId];
      if (post) {
        setPost(post);

        setFetchStatus("success");

        return;
      }

      const response = await fetchPost(postId);

      if (response.success) {
        if (response?.result?.content) {
          setPost(response?.result?.content);

          setFetchStatus("success");

          return;
        } else {
          setFetchStatus("noPost");

          return;
        }
      } else {
        setFetchStatus("error");

        return;
      }
    };

    getPost();
  }, [postId, feedPosts?.content, searchPosts?.content]);

  // Scroll listener
  const showScrollTopRef = useRef(showScrollTop);
  useEffect(() => {
    const postPageElemRef = postPageRef.current;

    if (!postPageElemRef) return;

    const handleScroll = () => {
      const scrollTopPos = postPageElemRef.scrollTop;

      if (scrollTopPos >= 50) {
        if (!showScrollTopRef.current) {
          showScrollTopRef.current = true;

          setShowScrollTop(true);
        }
      } else {
        if (showScrollTopRef.current) {
          showScrollTopRef.current = false;

          setShowScrollTop(false);
        }
      }
    };

    postPageElemRef.addEventListener("scroll", handleScroll);

    return () => {
      postPageElemRef.removeEventListener("scroll", handleScroll);
    };
  }, [fetchStatus]);

  const getProfilePicture = () => {
    if (post?.author?.profilePictureLink) {
      return (
        <img
          className={styles.profilePicture}
          src={post?.author?.profilePictureLink}
          alt="Author profile picture"
          onClick={handleProfileClick}
        />
      );
    } else {
      return (
        <div
          className={styles.altProfilePicture}
          style={{ backgroundColor: post?.author?.theme_color }}
          onClick={handleProfileClick}
        >
          {`${post?.author?.firstName[0] || ""}${post?.author?.lastName[0] || ""}`}
        </div>
      );
    }
  };

  const getReadableDate = (date) => {
    if (!date) return "";

    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getReadableExtDate = (date) => {
    if (!date) return "";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    navigate(`/profile/${post?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${post?.category?.id}`);
  };

  const handleScrollTopClick = () => {
    postPageRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const getEditedDate = () => {
    if (post?.created_at !== post?.edited_at) {
      return (
        <p>
          <span>Updated at:</span> {getReadableExtDate(post?.edited_at)}
        </p>
      );
    }
  };

  const getPostPageContent = () => {
    return (
      <div className={styles.postPage} ref={postPageRef}>
        <div className={styles.postContet}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{post?.title}</h2>

            <p className={styles.category} onClick={handleCategoryClick}>
              {post?.category?.name}
            </p>
          </div>

          <div className={styles.detailsContainer}>
            <div className={styles.authorDetails}>
              {getProfilePicture()}

              <div className={styles.authorSubDetails}>
                <p className={styles.authorName} onClick={handleProfileClick}>
                  <span className={styles.name}>
                    <span className={styles.firstName}>
                      {post?.author?.firstName}
                    </span>
                    <span className={styles.lastName}>
                      {post?.author?.lastName}
                    </span>
                  </span>
                </p>

                <p className={styles.authorMemberDate}>
                  <span>Member since:</span>{" "}
                  {getReadableDate(post?.author?.joined_at)}
                </p>
              </div>
            </div>

            <div className={styles.postDetails}>
              <p className={styles.postDate}>
                <span>Published at:</span>{" "}
                {getReadableExtDate(post?.created_at)}
              </p>

              {getEditedDate()}
            </div>
          </div>

          <article
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: post?.description,
            }}
          ></article>
        </div>

        <CommentSection
          postPageRef={postPageRef}
          postAuthorID={post?.author?.id}
        />

        <button
          className={`${styles.scrollTopBtn} ${showScrollTop ? styles.scrollTopBtnShow : styles.scrollTopBtnHide}`}
          aria-label="Scroll top"
          title="Scroll top"
          onClick={handleScrollTopClick}
        >
          <img src={upIcon} alt="Up icon" />
        </button>
      </div>
    );
  };

  const getMessage = (message) => {
    return (
      <div className={styles.messageContainer}>
        {fetchStatus === "fetching" && (
          <img src={loadingIcon} alt="Loading icon" />
        )}
        <p className={styles.message}>{message}</p>
      </div>
    );
  };

  switch (fetchStatus) {
    case "fetching":
      return getMessage("Loading the post");

    case "success":
      return getPostPageContent();

    case "noPost":
      return getMessage(`Couldn't find any post with the ID: ${postId}.`);

    case "error":
      return getMessage("An error occured.");
  }
}
