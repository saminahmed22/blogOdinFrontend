export async function fetchComments(postId) {
  const url = new URL(`http://localhost:3000/api/comments/${postId}`);

  try {
    const response = await fetch(url);

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
