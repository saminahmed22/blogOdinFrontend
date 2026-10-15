import callAPI from "./callAPI";

export async function fetchFeedContent(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["posts", "feed"],
    params,
  });

  return result;
}

export async function fetchUserPosts(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["posts", "user"],
    params,
    authRequired: true,
  });

  return result;
}
