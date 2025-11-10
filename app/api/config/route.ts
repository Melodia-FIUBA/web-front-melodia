import { NextResponse } from "next/server";

// Opcional: si usás App Router, esto evita cacheo estático
export const dynamic = "force-dynamic";

export async function GET() {
    // Whitelist de variables que viajan al cliente
    const payload = {
        MELODIA_USERS_API_URL: process.env.MELODIA_USERS_API_URL ?? "",
        MELODIA_SONGS_BACKOFFICE_API_URL: process.env.MELODIA_SONGS_BACKOFFICE_API_URL ?? "",
        MELODIA_USERS_BACKOFFICE_API_URL: process.env.MELODIA_USERS_BACKOFFICE_API_URL ?? "",
        LOGIN_PATH: process.env.LOGIN_PATH ?? "",
        LOGOUT_PATH: process.env.LOGOUT_PATH ?? "",
        LIST_USERS_PATH: process.env.LIST_USERS_PATH ?? "",
        CRUD_USERS_ID_PATH: process.env.CRUD_USERS_ID_PATH ?? "",
    };

    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "no-store, max-age=0",
        },
    });
}
