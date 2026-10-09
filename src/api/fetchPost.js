export async function fetchPost(postID) {
  const url = `http://localhost:3000/api/posts/${postID}`;

  try {
    const response = await fetch(url);

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
