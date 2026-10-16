import callAPI from "./callAPI";

export async function fetchUserData(userId) {
  const result = await callAPI({
    method: "GET",
    paths: ["users", userId],
  });

  return result;
}

export async function updateProfile(body) {
  const result = await callAPI({
    method: "PUT",
    paths: ["users"],
    body,
  });

  return result;
}

export async function fetchLoginCredit(body) {
  const result = await callAPI({
    method: "POST",
    paths: ["auth", "login"],
    body,
    authRequired: false,
  });

  return result;
}

export async function fetchRegCredit(body) {
  const result = await callAPI({
    method: "POST",
    paths: ["users"],
    body,
    authRequired: false,
  });

  return result;
}
