
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { getUserById } from "../users/getUsers";
import { calculateEffectiveStatus } from "../utils/effectiveStatus";
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

        const collection_url = new URL(cfg.CRUD_ID_COLLECTIONS_PATH.replace(":id", collectionId)+`?include_availability_details=true`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
                effectiveStatus: calculateEffectiveStatus(body.status_info, "collection"),
                coverUrl: body.cover_url ?? null,
                statusInfo: body.status_info ?? null,
                artist_blocked_regions: body.artist_blocked_regions ?? undefined,
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
            console.log("BODY PLAYLIST", body);
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
                effectiveStatus: calculateEffectiveStatus(body.status_info, "playlist", body.is_public),
                coverUrl: body.cover_url ?? null,
                artist_blocked_regions: body.artist_blocked_regions ?? undefined,
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

        const collection_url = new URL(cfg.CRUD_ID_SONGS_PATH.replace(":id", songId)+`?include_availability_details=true`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
                trackNumber: 1,
                duration: body.duration,
                video: false,
                typeLabel: undefined,
                year: body.created_at ? body.created_at.substring(0, 4) : null,
                owner: null,
                songs: undefined,
                publishedAt: body.created_at ?? null,
                effectiveStatus: calculateEffectiveStatus(body.status_info, "song"),
                statusInfo: body.status_info ?? null,
                artist_blocked_regions: body.artist_blocked_regions ?? undefined,
            }
            console.log("BODY SONG", body);
            return item;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}
// El primer boolean indica si está bloqueado en una region, el segundo si es globalmente
export async function getIfEffectiveStatusBlocked(id: string, type: string): Promise<[boolean, boolean]> {
    const cfg = await getRuntimeConfig();

    const search_songs_url = new URL(`${cfg.GET_BLOCKED_SONGS_HISTORY_PATH}`.replace(':id', id).replace(':type', type), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

    const token = getToken();

    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(search_songs_url, {
        method: "GET",
        headers: headers,
    });

    if (!res.ok) {
        return [false, false];
    }

    const body = await res.json();

    if (body && body.blocks) {
        for (const block of body.blocks) {
            if (block.is_active) {
                if (block.regions.includes("GLOBAL")) {
                    return [false, true];
                } else {
                    return [true, false];
                }
            }
        }
    }
    return [false, false];
}