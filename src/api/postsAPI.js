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
  });

  return result;
}

export async function fetchUserDraftedPosts(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["posts", "user", "drafts"],
    params,
  });

  return result;
}

export async function togglePostPublishStatus(body) {
  const result = await callAPI({
    method: "PUT",
    paths: ["posts", "user", "drafts"],
    body,
  });

  return result;
}

export async function createBookmark(body) {
  const result = await callAPI({
    method: "POST",
    paths: ["posts", "user", "bookmark"],
    body,
  });

  return result;
}

export async function deleteBookmakr(body) {
  const result = await callAPI({
    method: "DELETE",
    paths: ["posts", "user", "bookmark"],
    body,
  });

  return result;
}

export async function fetchSearchContent(params) {
  if (!params.query.length) return;

  const result = await callAPI({
    method: "GET",
    paths: ["posts", "search"],
    params,
  });

  return result;
}

export async function fetchPost(postId) {
  const result = await callAPI({
    method: "GET",
    paths: ["posts", postId],
  });

  return result;
}
