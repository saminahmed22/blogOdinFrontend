import { useOutletContext } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import PostCard from "../postCard/PostCard";

// API
import { fetchUserPosts } from "../../api/postsAPI";

export default function ProfilePagePosts({
  profileId,
  posts,
  setPosts,
  userFirstName,
}) {
  const { userData } = useOutletContext();

  return (
    <InfiniteScrollProvider
      Card={PostCard}
      fetchFunction={fetchUserPosts}
      reInitializeFactor={profileId}
      contentState={posts}
      setContentState={setPosts}
      queryParams={{ userId: profileId }}
      options={{
        scrollTopBtn: true,
        cardsSeparator: true,
        customLoadingMessage:
          profileId === userData?.personalData?.id
            ? "Loading your posts"
            : `Loading ${userFirstName}'s posts`,

        customNoContentMessage:
          profileId === userData?.personalData?.id
            ? "You haven't posted anything yet."
            : `${userFirstName} hasn't posted anything yet`,

        customErrorMessage:
          profileId === userData?.personalData?.id
            ? "Failed to fetch your posts."
            : `Failed to fetch ${userFirstName}'s posts.`,

        customRefetchFailMessage:
          profileId === userData?.personalData?.id
            ? "Failed to fetch more of your posts."
            : `Failed to fetch more of ${userFirstName}'s posts.`,
      }}
    />
  );
}
