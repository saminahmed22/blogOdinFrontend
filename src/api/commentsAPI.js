import callAPI from "./callAPI";

export async function fetchUserComments(params) {
  const result = await callAPI({
    method: "GET",
    paths: ["comments", "user"],
    params,
    authRequired: true,
  });

  return result;
}
