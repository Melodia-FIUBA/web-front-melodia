/* eslint-disable prefer-const */
"use client";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails } from "./searchCatalog";
import { ActiveBlock } from "@/types/regionalBlocks";
import { getItemById } from "./summaryDetails";

async function sendBlockRequest(itemId: string, itemType: string, reasonCode: string | undefined, regions: string[]): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const block_url = new URL(cfg.CRUD_BLOCK_SONG_PATH, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const reasonCodeBody = reasonCode ?? "unspecified";

        const request = {
            "target_type": itemType,
            "target_id": Number(itemId),
            "reason_code": reasonCodeBody,
            "regions": regions
        };

        const res = await fetch(block_url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(request),
        });

        const body = await res?.json();

        if (res.ok && body) {
            return {
                id: body.target_id ?? "",
                type: body.target_type ?? "",
                title: body.title ?? "",
                artists: body.artists ?? [],
                effectiveStatus: "blocked_by_admin",
            };
        }

        return null;
    } catch {
        return null;
    }
}

async function sendUnblockRequest(blockId: string, effectiveStatus: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const block_url = new URL(cfg.UNBLOCK_SONGS_PATH.replace(":id", blockId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(block_url, {
            method: "PUT",
            headers: headers,
        });

        const body = await res?.json();
        console.log("RES UNBLOCK", res, body);

        if (res.ok && body) {
            return {
                id: body.target_id ?? "",
                type: body.target_type ?? "",
                title: body.title ?? "",
                artists: body.artists ?? [],
                effectiveStatus,
            };
        }

        return null;
    } catch {
        return null;
    }
}

export async function blockItemGloballyById(itemId: string, itemType: string, reasonCode: string): Promise<CatalogDetails | null> {
    return await sendBlockRequest(itemId, itemType, reasonCode, ["GLOBAL"]);
}

export async function blockItemRegionallyById(itemId: string, itemType: string, reasonCode: string, regions: string[]): Promise<CatalogDetails | null> {
    return await sendBlockRequest(itemId, itemType, reasonCode, regions);
}
export async function unblockItemGloballyById(itemId: string, itemType: string): Promise<CatalogDetails | null> {
    const blockIds = await getBlockIdForGlobal(itemId, itemType);
    if (!blockIds || blockIds.length === 0) return null;
    return await sendUnblockRequest(blockIds[0], "blocked_by_admin");
}

export async function unblockItemRegionallyById(itemId: string, itemType: string, regions: string[]): Promise<CatalogDetails | null> {
    const blockIds = await getBlockIdForRegion(itemId, itemType, regions);
    if (!blockIds || blockIds.length === 0) return null;
    return await sendUnblockRequest(blockIds[0], "region_restricted");
}

async function getBlockIdForGlobal(id: string, type: string): Promise<string[]> {


    if (!id) {
        return [];
    }

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
        return [];
    }

    const body = await res.json();

    if (body && body.blocks) {
        for (const block of body.blocks) {
            if (block.is_active) {
                if (block.regions.includes("GLOBAL")) {
                    return [String(block.id)];
                }
            }
        }
    }

    // If no global block found and type === 'song', get collection id of song id
    if (type === 'song') {
        let data = await getItemById(id, 'song');
        return await getBlockIdForGlobal(data?.collection?.id ?? "", 'collection');
    }

    return [];
}

async function getBlockIdForRegion(id: string, type: string, regions: string[]): Promise<string[]> {
    const cfg = await getRuntimeConfig();

    const search_songs_url = new URL(`${cfg.GET_BLOCKED_SONGS_HISTORY_PATH}`.replace(':id', id).replace(':type', type), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

    const token = getToken();

    const headers: Record<string, string> = { "Content-Type": "application/json" };

    let ids: string[] = [];

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(search_songs_url, {
        method: "GET",
        headers: headers,
    });

    if (!res.ok) {
        return ids;
    }

    const body = await res.json();

    if (body && body.blocks) {
        for (const block of body.blocks) {
                if (block.is_active) {
                if (Array.isArray(block.regions) && regions.every((region: string) => block.regions.includes(region))) {
                    ids.push(String(block.id));
                }
            }
        }
    }
    return ids;
}


export async function getActiveBlocks(id: string, type: string): Promise<ActiveBlock[]> {
    const cfg = await getRuntimeConfig();

    const search_songs_url = new URL(`${cfg.GET_BLOCKED_SONGS_HISTORY_PATH}`.replace(':id', id).replace(':type', type), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

    const token = getToken();
    let data: ActiveBlock[] = []
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(search_songs_url, {
        method: "GET",
        headers: headers,
    });

    if (!res.ok) {
        return data;
    }

    const body = await res.json();

    if (body && body.blocks) {
        for (const block of body.blocks) {
            if (block.is_active) {
                data.push(block);
            }
        }
    }
    return data;
}