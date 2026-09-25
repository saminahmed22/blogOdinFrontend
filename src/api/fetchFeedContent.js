export async function fetchFeedContent(quantity, category) {
  const url = `http://localhost:3000/api/posts/feed/${quantity}`;

  try {
    const response = await fetch(url);

    const posts = await response.json();

    return { status: true, posts };
  } catch (error) {
    return { status: false, posts: [] };
  }
}
