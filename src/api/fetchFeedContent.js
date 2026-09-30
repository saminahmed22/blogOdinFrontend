export async function fetchFeedContent(category, quantity = 10) {
  let url = `http://localhost:3000/api/posts/feed`;

  url += category ? `/${category}` : "/0";

  url += `/${quantity}`;

  try {
    const response = await fetch(url);

    const posts = await response.json();

    return { status: true, posts };
  } catch (error) {
    return { status: false, error, posts: [] };
  }
}
