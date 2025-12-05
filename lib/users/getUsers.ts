
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";

export interface UserDetails {
    id: string;
    username: string;
    email: string;
    role: string;
    status: "active" | "blocked";
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    email_verified: boolean;
    role: string;
    status: "active" | "blocked";
    registeredAt: string;
    lastConnection: string;
}

export async function getUsersList(limit: number, offset: number): Promise<[UserDetails[], number]> {

    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const users_list_url = new URL(`${cfg.LIST_USERS_PATH}?offset=${offset}&limit=${limit}`, cfg.MELODIA_USERS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(users_list_url, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();


        if (res.ok && body?.users) {
            const users: UserDetails[] = body.users.map((user: any) => ({
                id: user.id ?? "",
                username: user.username ?? "",
                email: user.email ?? "",
                role: user.role ?? "",
                status: user.is_active ? "active" : "blocked",
            }));
            return [users, body.pagination?.total ?? 0];
        } else {
            // rechazar con mensaje para que toaster.promise muestre el error
            return [[], 0]
        }
    } catch {
        return [[], 0];
    }

}


export async function getUserById(userId: string): Promise<UserProfile | null> {
    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const users_list_url = new URL(cfg.CRUD_USERS_ID_PATH.replace(":id", userId), cfg.MELODIA_USERS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(users_list_url, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        if (res.ok && body) {
            const user: UserProfile = {
                id: body.id ?? "",
                username: body.username ?? "",
                email: body.email ?? "",
                email_verified: body.email_verified ?? false,
                role: body.role ?? "",
                status: body.is_active ? "active" : "blocked",
                registeredAt: body.created_at ?? "",
                lastConnection: body.last_connection ?? "",
            };
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}


export async function getLastSessionById(userId: string): Promise<string | null> {
    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();
        const sessionsUrl = new URL(`${cfg.SESSIONS_PATH}?offset=0&user_id=${userId}&limit=1`, cfg.MELODIA_USERS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(sessionsUrl, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        if (res.ok && body.sessions && body.sessions.length > 0) {
            
            return body.sessions[0].created_at ?? null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}