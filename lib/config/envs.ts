"use client";

import { adminLoginData } from "@/lib/log/cookies";

type RuntimeConfig = {
    MELODIA_USERS_API_URL: string;
    MELODIA_SONGS_BACKOFFICE_API_URL: string;
    MELODIA_USERS_BACKOFFICE_API_URL: string;
    LOGIN_PATH: string;
    LOGOUT_PATH: string;
    LIST_USERS_PATH: string;
    CRUD_USERS_ID_PATH: string;
};

// Memo en módulo para no pegarle mil veces al endpoint
let configPromise: Promise<RuntimeConfig> | null = null;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
    if (!configPromise) {
        // Usamos un IIFE async para poder leer adminLoginData (localStorage) y construir la URL
        configPromise = (async () => {
            const [token, role] = adminLoginData();
            const params = new URLSearchParams({ token: token , rol: role});
            try {
                const r = await fetch(`/api/config?${params.toString()}`, { cache: "no-store" });
                if (!r.ok) throw new Error("No se pudo cargar la configuración");
                return (await r.json()) as RuntimeConfig;
            } catch (e) {
                // Fallback seguro (strings vacíos) + surface del error
                console.error("Runtime config error:", e);
                return {
                    MELODIA_USERS_API_URL: "",
                    MELODIA_SONGS_BACKOFFICE_API_URL: "",
                    MELODIA_USERS_BACKOFFICE_API_URL: "",
                    LOGIN_PATH: "",
                    LOGOUT_PATH: "",
                    LIST_USERS_PATH: "",
                    CRUD_USERS_ID_PATH: "",
                };
            }
        })();
    }
    return configPromise;
}
