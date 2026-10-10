export async function fetchPost(postID) {
  const url = `http://192.168.0.150:3000/api/posts/${postID}`;

  try {
    const response = await fetch(url);

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
