import { useParams, useOutletContext, useNavigate } from "react-router";

import styles from "./PostPage.module.css";
import { useEffect, useState } from "react";

export default function PostPage() {
  const navigate = useNavigate();

  const { postId } = useParams();

  const { feedPosts, searchPosts } = useOutletContext();

  const [post, setPost] = useState({});

  useEffect(() => {
    const getPost = () => {
      let foundPost;

      foundPost = feedPosts?.posts?.find((postObj) => postObj.id === postId);

      if (!foundPost) {
        foundPost = searchPosts?.posts?.find(
          (postObj) => postObj.id === postId,
        );
      }

      if (foundPost) {
        setPost(foundPost);
      } else {
        console.log(searchPosts);
        throw new Error("No post has been found for the ID: " + postId);
      }
    };

    getPost();
  }, [feedPosts?.posts, postId, searchPosts]);

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
        >
          {`${post?.author?.firstName[0]}${post?.author?.lastName[0]}`}
        </div>
      );
    }
  };

  const getReadableDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getReadableExtDate = (date) => {
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

  const getEditedDate = () => {
    if (post.created_at !== post.edited_at) {
      return (
        <>
          &bull;
          <p>
            <span>Updated at:</span> {getReadableExtDate(post?.edited_at)}
          </p>
        </>
      );
    }
  };

  return (
    <div className={styles.postPage}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>{post?.title}</p>

        <p className={styles.category}>{post?.category?.name}</p>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.authorDetails}>
          {getProfilePicture()}

          <div className={styles.authorSubDetails}>
            <p className={styles.authorName}>
              {`${post?.author?.firstName} ${post?.author?.lastName}`}
            </p>

            <p className={styles.authorMemberDate}>
              <span>Member since:</span>{" "}
              {getReadableDate(post?.author?.joined_at)}
            </p>
          </div>
        </div>

        <div className={styles.postDetails}>
          <p>
            <span>Published at:</span> {getReadableExtDate(post?.created_at)}
          </p>

          {getEditedDate()}
        </div>
      </div>

      <article
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: post?.description }}
      ></article>
    </div>
  );
}
