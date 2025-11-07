import { getRuntimeConfig } from "../config/envs";
import { clearUserDataFromLocalStorage, getToken } from "./cookies";

export async function logout() {
  try {

    const cfg = await getRuntimeConfig();

    const logout_url = new URL(cfg.LOGOUT_PATH, cfg.MELODIA_USERS_API_URL);

    const token = getToken();

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(logout_url.toString(), {
      method: "POST",
      headers,
    });

    if (res.ok) {
      clearUserDataFromLocalStorage();
      window.location.href = "/";
    }

  } catch (err: unknown) {
    console.error("Error clearing cache:", err);
    window.location.href = "/";
  }
}