export async function submitProfileUpdate(data, jwt, method = "PUT") {
  let url = "http://192.168.0.150:3000/api/users";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Authorization: jwt.token },
      method: method,
      body: data,
    });

    if (!response.ok) {
      return { success: false, status: response.status };
    }

    const result = await response.json();

    return result;
  } catch (error) {
    return { success: false, error };
  }
}
