import { NextResponse } from "next/server";

// Opcional: si usás App Router, esto evita cacheo estático
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    // Whitelist de variables que viajan al cliente
    // Leer params 'token' y 'rol' que envía el cliente y convertirlos a booleanos
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const rol = url.searchParams.get("rol");

    // Considerar definidos sólo valores no nulos/undefined/empty
    const isToken = !!(token && token !== "undefined" && token !== "null");
    const isRole = !!(rol && rol !== "undefined" && rol !== "null");

    let payload;
    if (isToken && isRole) {
        payload = {
            MELODIA_USERS_API_URL: process.env.MELODIA_USERS_API_URL ?? "",
            MELODIA_SONGS_BACKOFFICE_API_URL: process.env.MELODIA_SONGS_BACKOFFICE_API_URL ?? "",
            MELODIA_USERS_BACKOFFICE_API_URL: process.env.MELODIA_USERS_BACKOFFICE_API_URL ?? "",
            LOGIN_PATH: process.env.LOGIN_PATH ?? "",
            LOGOUT_PATH: process.env.LOGOUT_PATH ?? "",
            LIST_USERS_PATH: process.env.LIST_USERS_PATH ?? "",
            CRUD_USERS_ID_PATH: process.env.CRUD_USERS_ID_PATH ?? "",
            SESSIONS_PATH: process.env.SESSIONS_PATH ?? "",
            SEARCH_SONGS_PATH: process.env.SEARCH_SONGS_PATH ?? "",
            GET_ID_COLLECTIONS_PATH: process.env.GET_ID_COLLECTIONS_PATH ?? "",
            GET_ID_SONGS_PATH: process.env.GET_ID_SONGS_PATH ?? "",
            GET_ID_PLAYLISTS_PATH: process.env.GET_ID_PLAYLISTS_PATH ?? "",
        };
    } else {
        payload = {
            MELODIA_USERS_API_URL: process.env.MELODIA_USERS_API_URL ?? "",
            LOGIN_PATH: process.env.LOGIN_PATH ?? "",
        };
    }

    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "no-store, max-age=0",
        },
    });
}
