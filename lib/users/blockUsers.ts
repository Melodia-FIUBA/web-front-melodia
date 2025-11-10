"use client";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { UserProfile } from "./getUsers";

export async function blockUserById(userId: string): Promise<UserProfile | null> {
    return await blockUnblockUserById(userId, false);
}

export async function unblockUserById(userId: string): Promise<UserProfile | null> {
    return await blockUnblockUserById(userId, true);
}

async function blockUnblockUserById(userId: string, isActive: boolean): Promise<UserProfile | null> {
    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const users_edit_url = new URL(cfg.CRUD_USERS_ID_PATH.replace(":id", userId), cfg.MELODIA_USERS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const request = {
            "is_active": isActive
        }

        const res = await fetch(users_edit_url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(request),
        });

        const body = await res?.json();

        console.log(res, body);

        if (res.ok && body) {
            const user: UserProfile = {
                id: body.id ?? "",
                username: body.username ?? "",
                email: body.email ?? "",
                email_verified: body.email_verified ?? false,
                role: body.role ?? "",
                status: body.is_active ? "active" : "blocked",
                registeredAt: body.created_at ?? "",
                lastConnection: "",
            };
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}