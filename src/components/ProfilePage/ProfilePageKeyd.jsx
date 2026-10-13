import { useParams } from "react-router";

import ProfilePage from "./ProfilePage";

export default function ProfilePageKeyd() {
  const { profileId } = useParams();

  return <ProfilePage key={profileId} />;
}
