import callAPI from "./callAPI";

export async function fetchPostComments(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["comments"],
    params,
  });

  return result;
}

export async function fetchUserComments(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["comments", "user"],
    params,
  });

  return result;
}

export async function createComment(body) {
  const result = await callAPI({
    method: "POST",
    paths: ["comments"],
    body,
  });

  return result;
}

export async function editComment(body) {
  const result = await callAPI({
    method: "PUT",
    paths: ["comments"],
    body,
  });

  return result;
}

export async function deleteComment(body) {
  const result = await callAPI({
    method: "DELETE",
    paths: ["comments"],
    body,
  });

  return result;
}
