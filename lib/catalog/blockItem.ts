"use client";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails } from "./searchCatalog";

export async function blockItemById(itemId: string): Promise<CatalogDetails | null> {
    return await blockUnblockItemById(itemId, true);
}

export async function unblockItemById(itemId: string): Promise<CatalogDetails | null> {
    return await blockUnblockItemById(itemId, false);
}

async function blockUnblockItemById(itemId: string, shouldBlock: boolean): Promise<CatalogDetails | null> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cfg = await getRuntimeConfig();
        
        // TODO: Reemplazar con el endpoint real cuando esté disponible
        // Por ahora, asumimos un endpoint similar a:
        // PUT /songs/{id} o /collections/{id} o /playlists/{id}
        // con body: { "blocked": true/false }
        
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const request = {
            "blocked": shouldBlock
        };

        // Simulación de respuesta exitosa
        // TODO: Implementar llamada real a la API cuando esté disponible
        console.log(`${shouldBlock ? "Blocking" : "Unblocking"} item ${itemId}`, request);
        
        // Por ahora retornamos null para indicar que la función necesita implementación
        // Cuando la API esté lista, descomentar el código siguiente:
        
        /*
        const item_url = new URL(`/items/${itemId}`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);
        
        const res = await fetch(item_url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(request),
        });

        const body = await res?.json();

        if (res.ok && body) {
            // Mapear la respuesta de la API a CatalogDetails
            const item: CatalogDetails = {
                id: body.id ?? "",
                type: body.type ?? "",
                title: body.title ?? "",
                artists: body.artists ?? [],
                effectiveStatus: body.blocked ? "blocked_by_admin" : body.status,
                // ... otros campos según la respuesta de la API
            };
            return item;
        } else {
            return null;
        }
        */
        
        return null;
    } catch {
        return null;
    }
}