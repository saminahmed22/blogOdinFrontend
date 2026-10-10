export async function submitComment(data, jwt) {
  let url = "http://localhost:3000/api/comments";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Authorization: jwt.token },
      method: "POST",
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
