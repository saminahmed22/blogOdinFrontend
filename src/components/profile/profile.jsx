import { useParams } from "react-router";

export default function Profile() {
  const params = useParams();

  return <div>Profile Page {params.profileId}</div>;
}
