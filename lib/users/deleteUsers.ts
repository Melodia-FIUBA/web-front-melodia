"use client";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";

export async function deleteUserById(userId: string): Promise<boolean> {
    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const users_edit_url = new URL(cfg.CRUD_USERS_ID_PATH.replace(":id", userId), cfg.MELODIA_USERS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(users_edit_url, {
            method: "DELETE",
            headers: headers,
        });
        if (res.ok) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}