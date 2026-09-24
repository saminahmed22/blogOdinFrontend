export async function fetchCategories() {
  const url = "http://localhost:3000/api/categories/";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categoriesArr = await response.json();

    return categoriesArr;
  } catch (error) {
    console.error(error.message);
  }
}
