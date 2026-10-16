import callAPI from "./callAPI";

export async function fetchCategories() {
  const result = await callAPI({
    method: "GET",
    paths: ["categories"],
    params: {},
  });

  return result;
}
