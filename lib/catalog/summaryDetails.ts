/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { getUserById } from "../users/getUsers";
import { CatalogDetails } from "./searchCatalog";


export async function getItemById(id: string, type: string): Promise<CatalogDetails | null> {

    if (type === "collection") {
        return await getCollectionDetailsById(id);
    } else if (type === "playlist") {
        return await getPlaylistDetailsById(id);
    } else if (type === "song") {
        return await getSongDetailsById(id);
    } else {
        return null;
    }
}

export async function getCollectionDetailsById(collectionId: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.CRUD_ID_COLLECTIONS_PATH.replace(":id", collectionId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(collection_url, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        if (res.ok && body) {

            const userBody = await getUserById(body.created_by_user_id);

            const item: CatalogDetails = {
                id: body.id ?? "",
                type: "collection",
                title: body.title,
                artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                collection: null,
                trackNumber: null,
                duration: null,
                video: false,
                typeLabel: body.type,
                year: body.release_date ? body.release_date.substring(0, 4) : null,
                owner: null,
                songs: body.songs.map((song: any, index: number) => ({
                    id: song.id ?? "",
                    title: song.title ?? "",
                    position: String(index + 1),
                    duration: song.duration ?? null,
                })),
                publishedAt: body.release_date ?? null,
                effectiveStatus: body.status === "published" ? "published" : "unpublished", //TODO: faltan estados
                coverUrl: body.cover_url ?? null,
            }
            return item;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export async function getPlaylistDetailsById(playlistId: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.CRUD_ID_PLAYLISTS_PATH.replace(":id", playlistId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(collection_url, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        if (res.ok && body) {

            const userBody = await getUserById(body.created_by_user_id);

            const item: CatalogDetails = {
                id: body.id ?? "",
                type: "playlist",
                title: body.title,
                artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                collection: null,
                trackNumber: null,
                duration: null,
                video: false,
                typeLabel: body.type,
                year: body.created_at ? body.created_at.substring(0, 4) : null,
                owner: null,
                songs: body.songs.map((song: any) => ({
                    id: song.id ?? "",
                    title: song.title ?? "",
                    position: song.position ?? "",
                    duration: song.duration ?? null,
                })),
                publishedAt: body.created_at ?? null,
                effectiveStatus: body.is_public === "published" ? "published" : "unpublished", //TODO: faltan estados
                coverUrl: body.cover_url ?? null,
            }
            return item;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export async function getSongDetailsById(songId: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.CRUD_ID_SONGS_PATH.replace(":id", songId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(collection_url, {
            method: "GET",
            headers: headers,
        });

        const body = (await res?.json()).song ?? null;

        if (res.ok && body) {

            const userBody = await getUserById(body.owner_id);
            const collBody = await getCollectionDetailsById(body.collection_id);

            const item: CatalogDetails = {
                id: body.id ?? "",
                type: "song",
                title: body.title,
                artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                collection: { id: body.collection_id, title: collBody?.title ?? "" },
                trackNumber: 1, //TODO URGENTE: DE DONDE SACO ESTO?
                duration: body.duration,
                video: false,
                typeLabel: undefined,
                year: body.created_at ? body.created_at.substring(0, 4) : null,
                owner: null,
                songs: undefined,
                publishedAt: body.created_at ?? null,
                effectiveStatus: body.is_published ? 'published' : 'unpublished', //TODO: no considera si esta bloqueado o por region
            }
            return item;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}