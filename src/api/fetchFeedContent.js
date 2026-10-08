export async function fetchFeedContent(params) {
  const url = new URL(`http://localhost:3000/api/posts/feed`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const response = await fetch(url);

  const result = await response.json();

  return result;
}
