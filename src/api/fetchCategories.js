export async function fetchCategories() {
  const url = "http://localhost:3000/api/categories/";

  try {
    const response = await fetch(url);

    const categories = await response.json();

    return { status: true, categories };
  } catch (error) {
    return { status: false, categories: [] };
  }
}
