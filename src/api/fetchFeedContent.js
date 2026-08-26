export async function fetchFeedContent(quantity) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/posts/feed/${quantity}`,
    );

    const posts = await response.json();
    return { status: response.status, posts };
  } catch (error) {
    return { status: 0, error };
  }
}
