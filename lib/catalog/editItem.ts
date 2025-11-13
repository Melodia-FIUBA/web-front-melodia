"use client";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails } from "./searchCatalog";

export async function editItemById(itemId: string, updatedData?: Partial<CatalogDetails>): Promise<CatalogDetails | null> {
    if (updatedData?.type === "song") {
        return await editSongById(itemId, updatedData);
    } else if (updatedData?.type === "collection") {
        return await editCollectionById(itemId, updatedData);
    }else if (updatedData?.type === "playlist") {
        return await editPlaylistById(itemId, updatedData);
    }
    return null;
}


export async function editSongById(itemId: string, updatedData?: Partial<CatalogDetails>): Promise<CatalogDetails | null> {
    try {

        const cfg = await getRuntimeConfig();

        const users_edit_url = new URL(cfg.CRUD_ID_SONGS_PATH.replace(":id", itemId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const request = {
            "title": updatedData?.title
        }

        const res = await fetch(users_edit_url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(request),
        });


        const body = await res?.json();

        if (res.ok && body.song) {
            const song: CatalogDetails = {
                title: body.song.title ?? "",
                id: body.song.id ?? "",
                type: "song",
                artists: [],
                effectiveStatus: body.song.status,
            };
            return song;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}


export async function editPlaylistById(itemId: string, updatedData?: Partial<CatalogDetails>): Promise<CatalogDetails | null> {
    try {
        
        const cfg = await getRuntimeConfig();

        const users_edit_url = new URL(cfg.CRUD_ID_PLAYLISTS_PATH.replace(":id", itemId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const request = {
            "title": updatedData?.title
        }

        const res = await fetch(users_edit_url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(request),
        });

        const body = await res?.json();

        if (res.ok && body) {
            const song: CatalogDetails = {
                title: body.title ?? "",
                id: body.id ?? "",
                type: "playlist",
                artists: [],
                effectiveStatus: body.status,
            };
            return song;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}


export async function editCollectionById(itemId: string, updatedData?: Partial<CatalogDetails>): Promise<CatalogDetails | null> {
    try {
        
        const cfg = await getRuntimeConfig();

        const users_edit_url = new URL(cfg.CRUD_ID_COLLECTIONS_PATH.replace(":id", itemId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const request = {
            "title": updatedData?.title
        }

        const res = await fetch(users_edit_url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(request),
        });

        console.log("Edit collection response:", res);

        const body = await res?.json();


        if (res.ok && body) {
            const song: CatalogDetails = {
                title: body.title ?? "",
                id: body.id ?? "",
                type: "collection",
                artists: [],
                effectiveStatus: body.status,
            };
            return song;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}