export async function fetchUserComments(params, jwt) {
  const url = new URL(`http://192.168.0.150:3000/api/comments/user`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: jwt.token,
      },
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
