import { useParams } from "react-router";

export default function Profile() {
  const { profileId } = useParams();

  return <div>Profile Page {profileId}</div>;
}
