export default async function callAPI({
  method,
  paths = [],
  params = {},
  body,
  authRequired = true,
}) {
  const url = new URL("http://192.168.0.150:3000/api");

  //   Appends paths for specific routes at the end
  for (const path of paths) {
    url.href += `/${path}`;
  }

  //   Injects query parameters if there's any provided
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const jwt = JSON.parse(localStorage.getItem("jwt"));

  const options = {
    headers: {
      ...(method !== "GET" && { "Content-Type": "application/json" }),

      ...(authRequired && jwt?.token?.length > 1
        ? { Authorization: jwt.token }
        : {}),
    },

    ...(method !== "GET" && { body }),
    method,
  };

  try {
    const response = await fetch(url, options);

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: `Response is NOT ok: ${response.status}`,
        ...result,
      };
    }

    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}
