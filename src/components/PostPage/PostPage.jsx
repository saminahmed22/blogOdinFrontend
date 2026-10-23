import styles from "./PostPage.module.css";

import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";

// Components
import CommentSection from "../CommentSection/CommentSection";
import PostPageActions from "../PostPageActions/PostPageActions";
import Viewer from "./quillViewer";

// API
import { fetchPost } from "../../api/postsAPI";

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
      !post?.content?.[postId]?.created_at !==
      post?.content?.[postId]?.edited_at
    ) {
      return (
        <p className={styles.postDate}>
          <span>Updated at:</span>{" "}
          {getReadableExtDate(post?.content?.[postId]?.edited_at)}
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
                    {getReadableDate(
                      post?.content?.[postId]?.author?.joined_at,
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.postDetails}>
                <p className={styles.postDate}>
                  <span>Published at:</span>{" "}
                  {getReadableExtDate(post?.content?.[postId]?.created_at)}
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

          {/* <article
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: post?.content?.[postId]?.description,
            }}
          ></article> */}

          <Viewer
            ref={viewerRef}
            defaultValue={[
              {
                insert:
                  "Every developer has been there. You feel a rush of excitement on Monday, plan an ambitious study schedule, and spend four hours working through tutorials. By Thursday the excitement has faded, the schedule is abandoned, and you quietly wonder if you are cut out for this at all.\n",
              },
              {
                insert:
                  "The problem is rarely talent or intelligence. It is almost always a habit problem. Learning a technical skill is a long game, and long games are won by people who show up consistently, not by people who sprint hard for a week and then disappear. In this post, we will look at how to build a learning routine that survives busy weeks, low energy days, and the occasional wave of self doubt.\n",
              },
              {
                insert:
                  "Grab a drink, get comfortable, and let us get into it.\n",
              },
              { insert: "\n" },

              { insert: "Why Motivation Is Not Enough" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Motivation feels wonderful, but it behaves like the weather. Some days it is sunny and you want to learn everything. Other days it is gray, and even opening your editor feels like a chore. If your entire plan depends on feeling motivated, you have built your house on shifting sand.\n",
              },
              { insert: "What you need instead is a " },
              { insert: "system", attributes: { bold: true } },
              {
                insert:
                  ". A system does not care how you feel. It simply makes the next step obvious and easy. As the saying goes:\n",
              },
              {
                insert:
                  "You do not rise to the level of your goals. You fall to the level of your systems.",
              },
              { insert: "\n", attributes: { blockquote: true } },
              {
                insert:
                  "Notice that this idea shifts the focus away from willpower and toward design. Instead of asking yourself how to become more disciplined, ask how to make learning the path of least resistance.\n",
              },
              { insert: "\n" },

              { insert: "Start Smaller Than You Think" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "The most common mistake is starting too big. Promising yourself three hours every evening sounds impressive, but it falls apart the first time life gets in the way. A better approach is to pick a commitment so small that it feels almost silly.\n",
              },
              {
                insert:
                  "Here are a few examples of tiny commitments that work well:\n",
              },
              { insert: "Read one page of documentation each morning" },
              { insert: "\n", attributes: { list: "bullet" } },
              { insert: "Solve a single small coding exercise before bed" },
              { insert: "\n", attributes: { list: "bullet" } },
              { insert: "Write three sentences about what you learned today" },
              { insert: "\n", attributes: { list: "bullet" } },
              {
                insert:
                  "Watch one short video and pause to try the idea yourself",
              },
              { insert: "\n", attributes: { list: "bullet" } },
              {
                insert:
                  "Once the habit is stable, you can grow it naturally. Most days you will do more than the minimum, because starting is the hardest part and momentum does the rest.\n",
              },
              { insert: "The Two Minute Rule" },
              { insert: "\n", attributes: { header: 3 } },
              {
                insert:
                  "If a task takes less than two minutes to begin, you are far more likely to do it. Open the editor, create a new file, and type a single line. That is it. You have started, and starting is the real victory. Often you will keep going, but even if you stop, you have kept the chain alive.\n",
              },
              { insert: "\n" },

              { insert: "Design Your Environment" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Your surroundings quietly shape your behavior. If your phone is beside you buzzing with notifications, deep learning becomes a battle. If your workspace is ready and inviting, learning becomes easy. Try this simple setup routine:\n",
              },
              {
                insert: "Choose a fixed time and place for your study session.",
              },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Close every tab and app you do not need." },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Put your phone in another room or on silent mode." },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Keep a notebook open for questions that pop up." },
              { insert: "\n", attributes: { list: "ordered" } },
              {
                insert:
                  "Start a timer for a focused block of twenty five minutes.",
              },
              { insert: "\n", attributes: { list: "ordered" } },
              {
                insert: "The goal is to remove decisions. ",
                attributes: { bold: true, underline: true },
              },
              {
                insert:
                  "When the time and place are always the same, your brain begins to treat them as a cue, and settling into focus gets easier every week.\n",
              },
              { insert: "\n" },

              { insert: "Find a Learning Partner" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Learning alone is possible, but learning with others is easier to sustain. A partner, a study group, or even an online community gives you a reason to show up. When someone expects an update from you, skipping a day feels different than skipping a promise you only made to yourself.\n",
              },
              {
                insert:
                  "You do not need anything formal. A weekly message sharing what you learned and what confused you is enough. Explaining an idea to another person is also one of the fastest ways to discover what you truly understand and what you only think you understand.\n",
              },
              { insert: "\n" },

              { insert: "The Power of Compounding" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Small efforts feel meaningless in the moment, but they add up in surprising ways. Consider what happens if you improve by just one percent every day for a year. The math looks like this:\n",
              },
              { insert: { formula: "1.01^{365} \\approx 37.8" } },
              { insert: "\n", attributes: { align: "center" } },
              {
                insert:
                  "In other words, tiny improvements multiplied over 365 days leave you nearly thirty eight times better. In plain text you might write it as 1.01",
              },
              { insert: "365", attributes: { script: "super" } },
              {
                insert:
                  " is about 37.8. You can also think of your skill on day n as S",
              },
              { insert: "n", attributes: { script: "sub" } },
              { insert: ", where each day builds on S" },
              { insert: "n-1", attributes: { script: "sub" } },
              {
                insert:
                  ". It is not a perfect model of how learning works, but it captures a real truth: consistency beats intensity.\n",
              },
              { insert: "\n" },

              { insert: "Track Progress Without Obsessing" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Tracking helps you see progress, which fuels the desire to continue. But tracking can turn into a trap if you spend more time updating charts than learning. Keep it simple. A basic log is enough, something like this:\n",
              },
              { insert: "Date: Monday" },
              { insert: "\n", attributes: { "code-block": true } },
              { insert: "Topic: Array methods" },
              { insert: "\n", attributes: { "code-block": true } },
              { insert: "Time: 30 minutes" },
              { insert: "\n", attributes: { "code-block": true } },
              { insert: "Note: map and filter finally clicked" },
              { insert: "\n", attributes: { "code-block": true } },
              {
                insert: "Each week, run a quick review using this checklist:\n",
              },
              { insert: "Did I show up at least four days this week?" },
              { insert: "\n", attributes: { list: "checked" } },
              { insert: "Did I finish something, even something small?" },
              { insert: "\n", attributes: { list: "checked" } },
              { insert: "Did I write down what confused me?" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "Did I celebrate one win?" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "\n" },
              { insert: "Questions Worth Asking" },
              { insert: "\n", attributes: { header: 3 } },
              {
                insert:
                  "At the end of every week, a few honest questions can guide your next steps.\n",
              },
              { insert: "What went well?" },
              { insert: "\n", attributes: { header: 4 } },
              {
                insert:
                  "Identify the moments when learning felt smooth. Maybe you studied in the morning, or maybe a certain resource explained things clearly. Repeat what works.\n",
              },
              { insert: "What got in the way?" },
              { insert: "\n", attributes: { header: 5 } },
              {
                insert:
                  "Look for patterns. Was it tiredness, distractions, or a topic that was too hard? Naming the obstacle makes it much easier to plan around.\n",
              },
              { insert: "What will I adjust?" },
              { insert: "\n", attributes: { header: 6 } },
              {
                insert:
                  "Pick one small change for next week, and only one. Too many changes at once will overwhelm you and make the whole routine feel heavy.\n",
              },
              { insert: "\n" },

              { insert: "Handling Bad Days" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Everyone misses days. What matters is how you respond. The worst reaction is the all or nothing mindset, where one missed day becomes a missed week and then a quit. Adopt a simple rule instead: never miss twice in a row.\n",
              },
              {
                insert:
                  "When a bad day hits, use this ladder of fallback options, from best to minimum:\n",
              },
              { insert: "Do your full session if you can" },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Pick the easiest topic on your list" },
              { insert: "\n", attributes: { list: "bullet", indent: 1 } },
              { insert: "Do a shortened ten minute session" },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Review notes from a previous day" },
              { insert: "\n", attributes: { list: "bullet", indent: 1 } },
              { insert: "Do the bare minimum" },
              { insert: "\n", attributes: { list: "ordered" } },
              { insert: "Open your editor and read yesterday's work" },
              { insert: "\n", attributes: { list: "bullet", indent: 1 } },
              {
                insert: "Remember: ",
                attributes: { bold: true, color: "#e60000" },
              },
              {
                insert:
                  "a messy day of learning still beats a perfect day of nothing. ",
              },
              {
                insert: "Perfection is the goal.",
                attributes: { strike: true },
              },
              { insert: " Progress is the goal.\n" },
              { insert: "\n" },

              { insert: "Final Thoughts" },
              { insert: "\n", attributes: { header: 2 } },
              {
                insert:
                  "Building a learning habit is less about dramatic effort and more about quiet repetition. Start small, shape your environment, find people to learn with, track just enough to stay honest, and forgive yourself on the hard days. None of these ideas is complicated, but together they form a system that keeps working long after the initial excitement fades.\n",
              },
              {
                insert:
                  "If you want to read more about the science behind habits, a good starting point is the ",
              },
              {
                insert: "overview of habits on Wikipedia",
                attributes: {
                  link: "https://en.wikipedia.org/wiki/Habit_(psychology)",
                },
              },
              {
                insert:
                  ". It is a short read, and it explains why cues and repetition matter so much.\n",
              },
              { insert: "\n" },
              {
                insert: "Show up today. Even a little.",
                attributes: { bold: true, italic: true, background: "#fff2cc" },
              },
              { insert: "\n", attributes: { align: "center" } },
            ]}
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
