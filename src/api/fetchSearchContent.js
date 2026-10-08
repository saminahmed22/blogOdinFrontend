export async function fetchSearchContent(params) {
  if (!params.query.length) return;

  const url = new URL(`http://localhost:3000/api/posts/search`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  console.log(url.href);

  try {
    const response = await fetch(url);

    const result = await response.json();

    console.log(result);

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
