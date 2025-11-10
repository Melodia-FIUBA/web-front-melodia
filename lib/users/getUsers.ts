/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";

export interface UserDetails {
    id: string;
    username: string;
    email: string;
    role: string;
    status: "active" | "blocked";
}


export async function getUsersList(limit: number, offset: number): Promise<[UserDetails[],number]> {

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

        console.log(res, body);

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
            return [[],0]
        }
    } catch {
        return [[],0];
    }

}