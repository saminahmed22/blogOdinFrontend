export async function fetchLoginCredit(data) {
  let url = "http://192.168.0.150:3000/api/auth/login";

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: data,
    });

    const authData = await response.json();

    return authData;
  } catch (error) {
    return error;
  }
}
