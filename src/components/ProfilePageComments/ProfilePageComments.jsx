// Hooks
import { useOutletContext } from "react-router";

// Components
import InfiniteScrollProvider from "../InfiniteScrollProvider/InfiniteScrollProvider";
import ProfileCommentCard from "../ProfileCommentCard/ProfileCommentCard";

// API
import { fetchUserComments } from "../../api/commentsAPI";

export default function ProfilePageComments({
  profileId,
  comments,
  setComments,
  userFirstName,
}) {
  const { userData } = useOutletContext();

  return (
    <InfiniteScrollProvider
      Card={ProfileCommentCard}
      fetchFunction={fetchUserComments}
      reInitializeFactor={profileId}
      contentState={comments}
      setContentState={setComments}
      queryParams={{ userId: profileId }}
      options={{
        scrollTopBtn: true,
        cardsSeparator: true,
        customLoadingMessage:
          profileId === userData?.personalData?.id
            ? "Loading your comments"
            : `Loading ${userFirstName}'s comments`,

        customLoadingMoreMessage: userData?.personalData?.id
          ? "Loading more of your comments"
          : `Loading more of ${userFirstName}'s comments`,

        customNoContentMessage:
          profileId === userData?.personalData?.id
            ? "You haven't commented anything yet."
            : `${userFirstName} hasn't commented anything yet`,

        customErrorMessage:
          profileId === userData?.personalData?.id
            ? "Failed to fetch your comments."
            : `Failed to fetch ${userFirstName}'s comments.`,

        customRefetchFailMessage:
          profileId === userData?.personalData?.id
            ? "Failed to fetch more of your comments."
            : `Failed to fetch more of ${userFirstName}'s comments.`,
      }}
    />
  );
}
