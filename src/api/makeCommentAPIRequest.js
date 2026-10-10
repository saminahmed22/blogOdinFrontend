export async function makeCommentAPIRequest(data, jwt, method) {
  let url = "http://192.168.0.150:3000/api/comments";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Authorization: jwt.token },
      method: method,
      body: data,
    });

    if (!response.ok) {
      return { success: false, status: response.status };
    }

    const comments = await response.json();

    return comments;
  } catch (error) {
    return { success: false, error };
  }
}
