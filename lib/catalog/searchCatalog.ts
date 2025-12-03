/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { getUserById } from '../users/getUsers';
import { calculateEffectiveStatus } from '../utils/effectiveStatus';
import { SONGS_AND_OTHER_ITEMS_MOCK } from './mock';
import { getCollectionDetailsById } from './summaryDetails';
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
    orderBy: string;
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
    // Effective status calculated in frontend
    effectiveStatus?:
    | 'scheduled'
    | 'published'
    | 'region_restricted'
    | 'blocked_by_admin'
    | string;
    // Effective status as returned by the backend
    statusInfo?: any,
    artist_blocked_regions?: string[];
    coverUrl?: string;
};




export function buildSearchPayload(filters: CatalogFilters): string {
    ///search?q=b&type=song,collection&status=published,scheduled&publication_date_from=2024-01-01&publication_date_to=2024-12-31&sort_by=date&limit=10&offset=0
    const { searchQuery, selectedType, selectedStatus, publishedFrom, publishedTo, orderBy } = filters;
    let payload: string = "";
    if (searchQuery) payload += `q=${searchQuery}`;
    if (selectedType) payload += `&type=${selectedType}`;
    if (selectedStatus) payload += `&status=${selectedStatus}`;
    if (publishedFrom) payload += `&publication_date_from=${publishedFrom}`;
    if (publishedTo) payload += `&publication_date_to=${publishedTo}`;
    if (orderBy === "date") payload += `&sort_by=date`;
    if (payload !== "") {
        payload += `&limit=${filters.limit}`;
        payload += `&offset=${filters.offset}`;
    }
    console.log("PAYLOAD BUILD SEARCH", payload);
    return (payload === "") ? "" : "?" + payload;
}



export async function getCatalogResults(
    filters: Partial<CatalogFilters>,
): Promise<[CatalogDetails[], number]> {

    try {
        //return { success: true, toastMessage: "Inicio de sesión exitoso" };
        const cfg = await getRuntimeConfig();

        const payload = buildSearchPayload({
            searchQuery: filters.searchQuery ?? '',
            selectedType: filters.selectedType ?? '',
            selectedStatus: filters.selectedStatus ?? '',
            publishedFrom: filters.publishedFrom ?? '',
            publishedTo: filters.publishedTo ?? '',
            orderBy: filters.orderBy ?? '',
            limit: filters.limit ?? '10',
            offset: filters.offset ?? '0',
        });

        const search_songs_url = new URL(`${cfg.SEARCH_SONGS_PATH}${payload}&include_availability_details=true`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
            for (let item of body) {
                if (item?.type === 'song') {

                    let collBody = await getCollectionDetailsById(item.collection_id);
                    let userBody = await getUserById(item.owner_id);

                    console.log("COLLECTION BODY IN SEARCH", collBody);
                    console.log("USER BODY IN SEARCH", userBody);

                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "song",
                        title: item.title,
                        artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                        collection: { id: item.collection_id, title: collBody?.title ?? "" },
                        trackNumber: null,
                        duration: null,
                        video: item.video ?? false,
                        typeLabel: undefined,
                        year: null,
                        owner: null,
                        songs: undefined,
                        publishedAt: item.created_at ?? null,
                        effectiveStatus: calculateEffectiveStatus(item.status_info, "song"),
                    });
                } else if (item?.type === 'collection') {


                    let userBody = await getUserById(item.created_by_user_id);

                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "collection",
                        title: item.title,
                        artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                        collection: null,
                        trackNumber: null,
                        duration: null,
                        video: false,
                        typeLabel: "collection",
                        year: null,
                        owner: null,
                        songs: [],
                        publishedAt: item.created_at ?? null,
                        effectiveStatus: calculateEffectiveStatus(item.status_info, "collection"),
                    });
                } else if (item?.type === 'playlist') {

                    let userBody = await getUserById(item.created_by_user_id);

                    items.push({
                        id: item.id ?? "",
                        type: item.type ?? "collection",
                        title: item.title,
                        artists: userBody?.username ? [userBody.username] : ["Anónimo"],
                        collection: null,
                        trackNumber: null,
                        duration: null,
                        video: false,
                        typeLabel: "collection",
                        year: null,
                        owner: null,
                        songs: [],
                        publishedAt: item.created_at ?? null,
                        effectiveStatus: calculateEffectiveStatus(item.status_info, "playlist", item.is_public),
                    });
                }
            }
            console.log("ITEMS SEARCH CATALOG", items);
            const total = items.length; 

            //Quito cosas si quedaron mal su status
            items = items.filter((item) => item.effectiveStatus === filters.selectedStatus || !filters.selectedStatus);
            return [items, total];
        } else {
            return [[], 0];
        }
    } catch  {
        return [[], 0];
    }
}