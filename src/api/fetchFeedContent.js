export async function fetchFeedContent(params) {
  const url = new URL(`http://localhost:3000/api/posts/feed`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url);

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
