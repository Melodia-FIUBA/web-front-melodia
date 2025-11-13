import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails, SONGS_AND_OTHER_ITEMS_MOCK } from "./searchCatalog";


export async function fetchItemById(id: string, type: string): Promise<CatalogDetails | null> {

    // quick mock lookup
    const mock = SONGS_AND_OTHER_ITEMS_MOCK.items.find((r: { id?: string; type?: string }) => r.id === id && r.type === type);
    return mock as CatalogDetails;
    
    try {
        const cfg = await getRuntimeConfig();

        // Construct the URL for the catalog item detail endpoint
        // Assuming the backend has an endpoint like: /catalog/{type}/{id}
        const itemUrl = new URL(`/catalog/${type}/${id}`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(itemUrl, {
            method: "GET",
            headers: headers,
        });

        const body = await res?.json();

        if (res.ok && body) {
            const item: CatalogDetails = {
                id: body.id ?? "",
                type: body.type ?? type,
                title: body.title ?? "",
                artists: body.artists ?? [],
                collection: body.collection ?? null,
                trackNumber: body.track_number ?? body.trackNumber ?? null,
                duration: body.duration ?? null,
                video: body.video ?? false,
                typeLabel: body.type_label ?? body.typeLabel,
                year: body.year ?? null,
                owner: body.owner ?? null,
                songs: body.songs ?? undefined,
                publishedAt: body.published_at ?? body.publishedAt ?? null,
                effectiveStatus: body.effective_status ?? body.effectiveStatus ?? "published",
            };
            return item;
        } else {
            console.error("Error fetching item:", body);
            return null;
        }
    } catch (error) {
        console.error("Error fetching item by ID:", error);
        return null;
    }
}

