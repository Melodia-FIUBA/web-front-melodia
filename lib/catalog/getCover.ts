import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails } from "./searchCatalog";


export async function getCover(item: CatalogDetails): Promise<string | null> {
    try {
        const cfg = await getRuntimeConfig();
        
        const collection_url = new URL(`${cfg.COVER_DOWNLOAD_PATH}?file_type=cover&resource_id=${item.id}`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        const token = getToken();

        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(collection_url, {
            method: "GET",
            headers: headers,
        });

        const body = (await res?.json()) ?? null;

        if (res.ok && body) {
            return body.download_url ?? null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}