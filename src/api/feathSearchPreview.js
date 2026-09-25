export async function fetchSearchPreview(queryString) {
  if (!queryString.length) return;

  const url = `http://localhost:3000/api/search/${queryString}`;

  try {
    const response = await fetch(url);

    const previewItems = await response.json();

    return { status: true, previewItems: [...previewItems.posts] };
  } catch (error) {
    return { status: false, previewItems: [] };
  }
}
