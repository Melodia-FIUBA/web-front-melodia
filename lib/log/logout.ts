import { clearUserDataFromLocalStorage, getToken } from "./cookies";

export async function logout() {
  try {
    const logout_url = new URL(process.env.NEXT_PUBLIC_LOGOUT_PATH ?? "", process.env.NEXT_PUBLIC_MELODIA_USERS_API_URL ?? "");

    const token = getToken();

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(logout_url.toString(), {
      method: "POST",
      headers,
    });

    const body = await res?.json();

    if (res.ok) {
      clearUserDataFromLocalStorage();
      window.location.href = "/";
    }

  } catch (err: unknown) {
    console.error("Error during logout:", err);
  }
}