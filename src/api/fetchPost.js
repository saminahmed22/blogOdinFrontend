export async function fetchPost(postID) {
  const url = `http://localhost:3000/api/posts/${postID}`;

  try {
    const response = await fetch(url);

    const post = await response.json();

    return { status: true, post };
  } catch (error) {
    return { status: false, error, post: null };
  }
}
