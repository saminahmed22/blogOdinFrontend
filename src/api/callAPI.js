export default async function callAPI({
  method,
  paths,
  params,
  authRequired = false,
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

  switch (method) {
    case "GET":
      try {
        const response = await fetch(
          url,
          authRequired && jwt?.token?.length > 1
            ? {
                headers: {
                  Authorization: jwt.token,
                },
              }
            : {},
        );

        if (!response.ok) {
          return { success: false };
        }

        const result = await response.json();

        return { success: true, result };
      } catch (error) {
        return { success: false, error };
      }

    default:
      throw new Error("No method has been provided");
  }
}
