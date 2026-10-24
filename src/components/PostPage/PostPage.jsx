import styles from "./PostPage.module.css";

import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";

// Components
import CommentSection from "../CommentSection/CommentSection";
import PostPageActions from "../PostPageActions/PostPageActions";
import Viewer from "./quillViewer";

// API
import { fetchPost } from "../../api/postsAPI";

// Helpers
import { getDate } from "../../helpers/getDate";

// Icons
import upIcon from "../../assets/icons/up.svg";
import loadingIcon from "../../assets/icons/loading.svg";

export default function PostPage() {
  const navigate = useNavigate();

  const { postId } = useParams();

  const { userData, feedPosts, setFeedPosts, searchPosts, setSearchPosts } =
    useOutletContext();

  // States
  const [fetchStatus, setFetchStatus] = useState("fetching");
  const [post, setPost] = useState({ content: {} });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [postSource, setPostSource] = useState();

  // Refs
  const postPageRef = useRef();
  const commentSectionRef = useRef();
  const viewerRef = useRef();

  // Effects
  useEffect(() => {
    const getPost = async () => {
      let postObj;

      postObj = feedPosts?.content?.[postId];
      if (postObj) {
        setPostSource("feedPosts");

        setPost({
          content: {
            [postId]: { ...postObj },
          },
        });

        setFetchStatus("success");

        return;
      }

      postObj = searchPosts?.content?.[postId];
      if (postObj) {
        setPostSource("searchPosts");

        setPost({
          content: {
            [postId]: { ...postObj },
          },
        });

        setFetchStatus("success");

        return;
      }

      const response = await fetchPost(postId);

      if (response.success) {
        if (response?.result?.content) {
          setPostSource("fetched");

          setPost({
            content: {
              [postId]: { ...response?.result?.content },
            },
          });

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
    if (post?.content?.[postId]?.author?.profilePictureLink) {
      return (
        <img
          className={styles.profilePicture}
          src={post?.content?.[postId]?.author?.profilePictureLink}
          alt="Author profile picture"
          onClick={handleProfileClick}
        />
      );
    } else {
      return (
        <div
          className={styles.altProfilePicture}
          style={{
            backgroundColor: post?.content?.[postId]?.author?.theme_color,
          }}
          onClick={handleProfileClick}
        >
          {`${post?.content?.[postId]?.author?.firstName[0] || ""}${post?.content?.[postId]?.author?.lastName[0] || ""}`}
        </div>
      );
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();

    navigate(`/profile/${post?.content?.[postId]?.author?.id}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();

    navigate(`/feed/${post?.content?.[postId]?.category?.id}`);
  };

  const handleScrollTopClick = () => {
    postPageRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const getEditedDate = () => {
    if (
      post?.content?.[postId]?.created_at !== post?.content?.[postId]?.edited_at
    ) {
      return (
        <p
          className={styles.postDate}
          title={getDate({
            isoString: post?.content?.[postId]?.edited_at,
            longDate: true,
          })}
        >
          <span>Updated at:</span>{" "}
          {getDate({
            isoString: post?.content?.[postId]?.edited_at,
          })}
        </p>
      );
    }
  };

  const getPostPageContent = () => {
    return (
      <div className={styles.postPage} ref={postPageRef}>
        <div className={styles.postContent}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{post?.content?.[postId]?.title}</h2>

            <p
              className={styles.category}
              onClick={handleCategoryClick}
              style={{
                backgroundColor: post?.content?.[postId]?.category?.color,
              }}
            >
              {post?.content?.[postId]?.category?.name}
            </p>
          </div>

          <div className={styles.secondary}>
            <div className={styles.detailsContainer}>
              <div className={styles.authorDetails}>
                {getProfilePicture()}

                <div className={styles.authorSubDetails}>
                  <p className={styles.authorName} onClick={handleProfileClick}>
                    <span className={styles.name}>
                      <span className={styles.firstName}>
                        {post?.content?.[postId]?.author?.firstName}
                      </span>
                      <span className={styles.lastName}>
                        {post?.content?.[postId]?.author?.lastName}
                      </span>
                    </span>
                  </p>

                  <p className={styles.authorMemberDate}>
                    <span>Member since:</span>{" "}
                    {getDate({
                      isoString: post?.content?.[postId]?.author?.joined_at,
                    })}
                  </p>
                </div>
              </div>

              <div className={styles.postDetails}>
                <p
                  className={styles.postDate}
                  title={getDate({
                    isoString: post?.content?.[postId]?.created_at,
                    longDate: true,
                  })}
                >
                  <span>Published at:</span>{" "}
                  {getDate({ isoString: post?.content?.[postId]?.created_at })}
                </p>

                {getEditedDate()}
              </div>
            </div>

            {userData?.jwt?.token?.length > 1 && (
              <PostPageActions
                userId={userData?.personalData?.id}
                data={post?.content?.[postId]}
                contentState={
                  postSource === "feedPosts"
                    ? feedPosts
                    : postSource === "searchPosts"
                      ? searchPosts
                      : post
                }
                setContentState={
                  postSource === "feedPosts"
                    ? setFeedPosts
                    : postSource === "searchPosts"
                      ? setSearchPosts
                      : setPost
                }
                postId={postId}
                commentSectionRef={commentSectionRef}
              />
            )}
          </div>

          <Viewer
            ref={viewerRef}
            defaultValue={post?.content?.[postId]?.ops || ""}
          />
        </div>

        <CommentSection
          postPageRef={postPageRef}
          postAuthorID={post?.content?.[postId]?.author?.id}
          commentSectionRef={commentSectionRef}
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
