import { useParams } from "react-router";

export default function Post() {
  const params = useParams();

  return <div>Post Page {params.postId}</div>;
}
