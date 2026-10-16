import callAPI from "./callAPI";

export async function fetchFeedContent(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["posts", "feed"],
    params,
    authRequired: false,
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

export async function fetchSearchContent(params) {
  if (!params.query.length) return;

  const result = await callAPI({
    method: "GET",
    paths: ["posts", "search"],
    params,
    authRequired: false,
  });

  return result;
}
