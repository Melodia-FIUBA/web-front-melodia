// Utilities extracted so they can be moved to a separate file later.
/**
 * Validate a date range expressed as YYYY-MM-DD strings.
 * Accepts undefined or empty strings as "no value".
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


/**
 * A single catalog item returned from the API. The server may return many more fields
 * than what the filters represent; allow an index signature so callers can access
 * additional properties while still having some typed fields.
 */
export type CatalogDetails = {
    id: string;
    // Type of item: 'song' | 'collection' | 'playlist' (string to match backend)
    type: 'song' | 'collection' | 'playlist' | string;
    // Title of the item
    title: string;
    // Main artist name
    mainArtist?: string | null;
    // If item is a song, the parent collection info (nullable)
    collection?: { id: string; title?: string } | null;
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

/**
 * The shape of the API response. Typical fields: items array, total count, pagination.
 * Adjust to match your backend contract. Using a generic here allows easier reuse.
 */
export type CatalogResponse<TItem = CatalogDetails> = {
    items: TItem[];
    total: number;
    page?: number;
    pageSize?: number;
    // allow backend to return facets/aggregations or other meta info
    facets?: Record<string, unknown> | null;
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
): Promise<CatalogResponse<TItem> | null> {
    // Validate date range first
    if (!validateDateRange(filters.publishedFrom, filters.publishedTo)) return null;

    const endpoint = options?.endpoint ?? '/api/catalog/search';
    const payload = buildApiPayload({
        searchQuery: filters.searchQuery ?? '',
        selectedType: filters.selectedType ?? '',
        selectedStatus: filters.selectedStatus ?? '',
        publishedFrom: filters.publishedFrom ?? '',
        publishedTo: filters.publishedTo ?? '',
    });

    // TODO: Build URL with query parameters
    /*
    const url = new URL(endpoint, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    Object.entries(payload).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString(), { method: 'GET', signal: options?.signal });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Catalog API error: ${res.status} ${res.statusText} - ${text}`);
    }
    const data = (await res.json()) as CatalogResponse<TItem>;
    */
   
    // For now, return mock data
    // Mock data for local testing (5 items)
    const MOCK_RESPONSE: CatalogResponse = {
        items: [
            {
                id: 's1',
                type: 'song',
                title: 'Primera Canción',
                mainArtist: 'Artista A',
                collection: { id: 'c1', title: 'Colección A' },
                publishedAt: '2021-05-10',
                effectiveStatus: 'published',
            },
            {
                id: 's2',
                type: 'song',
                title: 'Segunda Canción',
                mainArtist: 'Artista B',
                collection: null,
                publishedAt: '2022-01-20',
                effectiveStatus: 'scheduled',
            },
            {
                id: 'col1',
                type: 'collection',
                title: 'Colección Especial',
                mainArtist: 'Varios',
                collection: null,
                publishedAt: '2020-11-01',
                effectiveStatus: 'published',
            },
            {
                id: 'p1',
                type: 'playlist',
                title: 'Playlist de Prueba',
                mainArtist: null,
                collection: null,
                publishedAt: null,
                effectiveStatus: 'not-available-region',
            },
            {
                id: 's3',
                type: 'song',
                title: 'Tercera Canción',
                mainArtist: 'Artista C',
                collection: { id: 'c2', title: 'Colección B' },
                publishedAt: '2019-07-15',
                effectiveStatus: 'blocked-admin',
            },
        ],
        total: 5,
        page: 1,
        pageSize: 25,
    };
    return MOCK_RESPONSE as CatalogResponse<TItem>;
}

/**
 * UI-oriented helper that performs the search and optionally updates UI state via callbacks.
 *
 * This mirrors the previous `handleApplyFilters` logic that lived in the Catalog page.
 * The function is intentionally flexible: callers can provide callbacks for loading, error,
 * and result state, or they can simply `await` the returned CatalogResponse.
 */
export async function handleApplyFilters(
    filters: Partial<CatalogFilters>,
    callbacks?: {
        setItems?: (items: CatalogDetails[]) => void;
        setTotal?: (n: number) => void;
        setLoading?: (b: boolean) => void;
        setError?: (s: string | null) => void;
        fetchOptions?: { endpoint?: string; signal?: AbortSignal };
    }
): Promise<CatalogResponse | null> {
    const { setItems, setTotal, setLoading, setError, fetchOptions } = callbacks ?? {};

    // Clear previous error
    setError?.(null);

    // Validate date range before calling
    if (!validateDateRange(filters.publishedFrom ?? '', filters.publishedTo ?? '')) {
        setError?.('Rango de fechas inválido');
        return null;
    }

    setLoading?.(true);
    try {
        const res = await fetchCatalogResults(filters, fetchOptions);

        if (!res) {
            // validation returned null
            setItems?.([]);
            setTotal?.(0);
            setError?.('Rango de fechas inválido');
            return null;
        }

        setItems?.(res.items ?? []);
        setTotal?.(typeof res.total === 'number' ? res.total : res.items.length);
        return res as CatalogResponse;
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError?.(message);
        setItems?.([]);
        setTotal?.(0);
        return null;
    } finally {
        setLoading?.(false);
    }
}