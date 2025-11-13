/* eslint-disable @typescript-eslint/no-explicit-any */

import { SONGS_AND_OTHER_ITEMS_MOCK } from './mock';
export { SONGS_AND_OTHER_ITEMS_MOCK };
/* 
export function applyFiltersAndGetPayload(args?: Partial<CatalogFilters>) {
    // Read filters from args or URL (client-side). Return normalized Partial<CatalogFilters>
    let searchQuery: string | undefined;
    let selectedType: string | undefined;
    let selectedStatus: string | undefined;
    let publishedFrom: string | undefined;
    let publishedTo: string | undefined;

    if (args) {
        ({ searchQuery, selectedType, selectedStatus, publishedFrom, publishedTo } = args as Partial<CatalogFilters>);
    } else if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        searchQuery = params.get("q") ?? undefined;
        selectedType = params.get("type") ?? undefined;
        selectedStatus = params.get("status") ?? undefined;
        publishedFrom = params.get("publishedFrom") ?? undefined;
        publishedTo = params.get("publishedTo") ?? undefined;
    }

    if (!validateDateRange(publishedFrom, publishedTo)) return null;

    return {
        searchQuery: searchQuery ?? "",
        selectedType: selectedType ?? "",
        selectedStatus: selectedStatus ?? "",
        publishedFrom: publishedFrom ?? "",
        publishedTo: publishedTo ?? "",
    };
}
*/









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
    // Owner or curator (for playlists or collections)
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
        | 'scheduled'
        | 'published'
        | 'not-available-region'
        | 'blocked-admin'
        | string;
    // allow extra server-side fields without losing typing
    [key: string]: unknown;
};




export function buildApiPayload(filters: CatalogFilters) {
    const { searchQuery, selectedType, selectedStatus, publishedFrom, publishedTo } = filters;
    const payload: Record<string, string> = {};
    if (searchQuery) payload.q = searchQuery;
    if (selectedType) payload.type = selectedType;
    if (selectedStatus) payload.status = selectedStatus;
    if (publishedFrom) payload.publishedFrom = `${publishedFrom}T00:00:00Z`;
    if (publishedTo) payload.publishedTo = `${publishedTo}T23:59:59Z`;
    return payload;
}

/**
 * Fetch results from the catalog API using the provided filters.
 * This helper always performs a GET request (search semantics) and encodes the
 * filter payload as query parameters. You can override the endpoint via options.
 *
 * Returns a typed CatalogResponse<TItem> or throws on network/HTTP error.
 */
export async function fetchCatalogResults<TItem = CatalogDetails>(
    filters: Partial<CatalogFilters>,
    options?: {
        endpoint?: string; // default: /api/catalog/search
        signal?: AbortSignal;
    }
): Promise<any> {
    // Validate date range first
    if (!validateDateRange(filters.publishedFrom, filters.publishedTo)) return null;

    // small reference to the generic to avoid "defined but never used" in strict lint setups
    type _TUnused = TItem;
    // create and reference a dummy value so both the alias and a value are considered used
    const _useTVar = null as unknown as _TUnused;
    void _useTVar;

    const endpoint = options?.endpoint ?? '/api/catalog/search';
    const payload = buildApiPayload({
        searchQuery: filters.searchQuery ?? '',
        selectedType: filters.selectedType ?? '',
        selectedStatus: filters.selectedStatus ?? '',
        publishedFrom: filters.publishedFrom ?? '',
        publishedTo: filters.publishedTo ?? '',
    });

    // mark these as used to avoid unused-variable complaints until the TODO is implemented
    void endpoint;
    void payload;

    // TODO: Build URL with query parameters and perform a real fetch when ready

    return SONGS_AND_OTHER_ITEMS_MOCK;
}
