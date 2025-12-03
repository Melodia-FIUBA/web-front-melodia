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
    SESSIONS_PATH: string;
    SEARCH_SONGS_PATH: string;
    CRUD_ID_COLLECTIONS_PATH: string;
    CRUD_ID_SONGS_PATH: string;
    CRUD_ID_PLAYLISTS_PATH: string;
    APPEARANCES_SONGS_PATH: string;
    APPEARANCES_COLLECTIONS_PATH: string;
    COVER_DOWNLOAD_PATH: string;
    CRUD_BLOCK_SONG_PATH: string;
    GET_ID_BLOCKED_SONG_PATH: string;
    GET_BLOCKED_SONGS_HISTORY_PATH: string;
    GET_SONGS_REASON_CODES_PATH: string;
    UNBLOCK_SONGS_PATH: string;
    AUDIT_COLLECTIONS_PATH: string;
    AUDIT_SONGS_PATH: string;
};

// Memo en módulo para no pegarle mil veces al endpoint
let configPromise: Promise<RuntimeConfig> | null = null;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
    if (!configPromise) {
        // Usamos un IIFE async para poder leer adminLoginData (localStorage) y construir la URL
        configPromise = (async () => {
            const [token, role] = adminLoginData();
            const params = new URLSearchParams({ token: token, rol: role });
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
                    SESSIONS_PATH: "",
                    SEARCH_SONGS_PATH: "",
                    CRUD_ID_COLLECTIONS_PATH: "",
                    CRUD_ID_SONGS_PATH: "",
                    CRUD_ID_PLAYLISTS_PATH: "",
                    APPEARANCES_SONGS_PATH: "",
                    APPEARANCES_COLLECTIONS_PATH: "",
                    COVER_DOWNLOAD_PATH: "",
                    CRUD_BLOCK_SONG_PATH: "",
                    GET_ID_BLOCKED_SONG_PATH: "",
                    GET_BLOCKED_SONGS_HISTORY_PATH: "",
                    GET_SONGS_REASON_CODES_PATH: "",
                    UNBLOCK_SONGS_PATH: "",
                    AUDIT_COLLECTIONS_PATH: "",
                    AUDIT_SONGS_PATH: "",
                };
            }
        })();
    }
    return configPromise;
}
