/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { getUserById } from '../users/getUsers';
import { SONGS_AND_OTHER_ITEMS_MOCK } from './mock';
export { SONGS_AND_OTHER_ITEMS_MOCK };

export function validateDateRange(publishedFrom?: string, publishedTo?: string) {
    if (!publishedFrom || !publishedTo) return true;
    // YYYY-MM-DD strings compare lexicographically
    return publishedFrom <= publishedTo;
}

export type CatalogFilters = {
    searchQuery: string;
    selectedType: string;
    selectedStatus: string;
    publishedFrom: string;
    publishedTo: string;
    limit: string
    offset: string
};


export type CatalogDetails = {
    id: string;
    // Type of item: 'song' | 'collection' | 'playlist' (string to match backend)
    type: 'song' | 'collection' | 'playlist' | string;
    // Title of the item
    title: string;
    // Artists (for songs) — one or more names, or null if unknown
    artists: string[];
    // If item is a song, the parent collection info (nullable)
    collection?: { id: string; title?: string } | null;
    // Track number / position within its collection (if applicable)
    trackNumber?: number | null;
    // Duration in seconds (if applicable)
    duration?: number | null;
    // Whether a video is available
    video?: boolean;
    // For collection items: human-readable type label (Album/EP/Single/Playlist)
    typeLabel?: 'Album' | 'EP' | 'Single' | 'Playlist' | string;
    // Year of the collection (if applicable)
    year?: number | null;
    // Owner or curator (for playlists)
    owner?: string | null;
    // List of songs for collection/playlist items (each with optional position/duration)
    songs?: Array<{
        id: string;
        title?: string;
        position?: number;
        duration?: number;
    }>;
    // Publication date in ISO (nullable)
    publishedAt?: string | null;
    // Effective status as returned by the backend
    effectiveStatus?:
    | 'unpublished'
    | 'published'
    | 'not-available-region'
    | 'blocked-admin'
    | string;
    coverUrl?: string;
};




export function buildSearchPayload(filters: CatalogFilters): string {
    ///search?q=b&type=song,collection&status=published,unpublished&publication_date_from=2024-01-01&publication_date_to=2024-12-31&sort_by=date&limit=10&offset=0
    const { searchQuery, selectedType, selectedStatus, publishedFrom, publishedTo } = filters;
    let payload: string = "";
    if (searchQuery) payload += `q=${searchQuery}`;
    if (selectedType) payload += `&type=${selectedType}`;
    if (selectedStatus) payload += `&status=${selectedStatus}`;
    if (publishedFrom) payload += `&publication_date_from=${publishedFrom}`;
    if (publishedTo) payload += `&publication_date_to=${publishedTo}`;
    if (payload !== "") {
        payload += `&limit=${filters.limit}`;
        payload += `&offset=${filters.offset}`;
    }
    return (payload === "") ? "" : "?" + payload;
}



export async function fetchCatalogResults(
    filters: Partial<CatalogFilters>,
): Promise<any> {

    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const payload = buildSearchPayload({
            searchQuery: filters.searchQuery ?? '',
            selectedType: filters.selectedType ?? '',
            selectedStatus: filters.selectedStatus ?? '',
            publishedFrom: filters.publishedFrom ?? '',
            publishedTo: filters.publishedTo ?? '',
            limit: '10',
            offset: filters.offset ?? '0',
        });

        const search_songs_url = new URL(`${cfg.SEARCH_SONGS_PATH}${payload}`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(search_songs_url, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        console.log("BODY SEARCH CATALOG", body);

        if (res.ok && body) {
            let items: CatalogDetails[] = []
            for (let item of body.items) {
                if (item?.type === 'song') {

                    let collBody = await fetchCollectionDetailsById(item.collection_id);
                    let trackNumber = 1;

                    let userBody = await getUserById(item.owner_id);

                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "song",
                        title: item.title,
                        artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                        collection: { id: item.collection_id, title: collBody?.title ?? "" },
                        trackNumber: trackNumber, //TODO: no se como encontrarlo
                        duration: item.duration,
                        video: item.video ?? false,
                        typeLabel: undefined,
                        year: item.created_at.substring(0, 4) ?? null,
                        owner: null,
                        songs: undefined,
                        publishedAt: item.created_at ?? null,
                        effectiveStatus: item.is_published ? 'published' : 'unpublished', //TODO: no considera si esta bloqueado o por region
                    });
                } else if (item?.type === 'collection') {


                    let userBody = await getUserById(item.owner_id);


                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "collection",
                        title: item.title ?? "",
                        artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                        collection: null,
                        trackNumber: null,
                        duration: item.duration ?? null,
                        video: false,
                        typeLabel: "collection",
                        year: item.release_date.substring(0, 4) ?? null,
                        owner: item.owner ?? null,
                        songs: item.songs ?? [],
                        publishedAt: item.published_at ?? null,
                        effectiveStatus: item.effective_status ?? "",
                    });
                } else if (item?.type === 'playlist') {
                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "",
                        title: item.title ?? "",
                        artists: item.artists ?? [],
                        collection: item.collection ?? null,
                        trackNumber: item.track_number ?? null,
                        duration: item.duration ?? null,
                        video: item.video ?? false,
                        typeLabel: item.type_label ?? "",
                        year: item.year ?? null,
                        owner: item.owner ?? null,
                        songs: item.songs ?? [],
                        publishedAt: item.published_at ?? null,
                        effectiveStatus: item.effective_status ?? "",
                    });
                }
            }
            return items;
        } else {
            return []
        }
    } catch {
        return [];
    }


    return SONGS_AND_OTHER_ITEMS_MOCK;
}


export async function fetchCollectionDetailsById(collectionId: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.GET_ID_COLLECTIONS_PATH.replace(":id", collectionId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
            const item: CatalogDetails = {
                id: body.id ?? "",
                type: body.type ?? "",
                title: body.title ?? "",
                artists: body.artists ?? [],
                collection: body.collection ?? null,
                trackNumber: body.track_number ?? null,
                duration: body.duration ?? null,
                video: body.video ?? false,
                typeLabel: body.type_label ?? "",
                year: body.year ?? null,
                owner: body.owner ?? null,
                songs: body.songs ?? [],
                publishedAt: body.published_at ?? null,
                effectiveStatus: body.effective_status ?? "",
            }
            return item;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}