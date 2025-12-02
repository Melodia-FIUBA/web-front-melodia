"use client";
import { ReasonCodes } from "@/components/catalog/utils";
import { getRuntimeConfig } from "../config/envs";
import { getToken } from "../log/cookies";
import { CatalogDetails } from "./searchCatalog";

export async function blockItemGloballyById(itemId: string, itemType: string, reasonCode: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const block_url = new URL(cfg.CRUD_BLOCK_SONG_PATH, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);


        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const reasonCodeBody = reasonCode as ReasonCodes ?? ReasonCodes.unspecified;

        const request = {
            "target_type": itemType,
            "target_id": Number(itemId),
            "reason_code": reasonCodeBody,
            "regions": [
                "GLOBAL"
            ]
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

export async function unblockItemGloballyById(itemId: string, itemType: string): Promise<CatalogDetails | null> {
    try {
        const cfg = await getRuntimeConfig();
        const token = getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const blockIds = await getBlockId(itemId, itemType);

        const block_url = new URL(cfg.UNBLOCK_SONGS_PATH.replace(":id", blockIds[0]), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);


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
                effectiveStatus: "blocked_by_admin",
            };
        }

        return null;
    } catch {
        return null;
    }
}

async function getBlockId(id: string, type: string): Promise<string[]> {
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
    return [];
}