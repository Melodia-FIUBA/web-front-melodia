/* eslint-disable @typescript-eslint/no-explicit-any */
// Type definitions for appearances data
export type CollectionAppearance = {
    id: string;
    type: 'album' | 'ep' | 'single' | 'playlist';
    title: string;
    position?: number;
    owner?: string | null;
};

export type PlaylistAppearance = {
    id: string;
    title: string;
    owner: string | null;
    includedCount: number;  // Number of songs from the collection included
    totalSongs: number;     // Total songs in the original collection
};

export type AppearancesData = {
    // For songs: collections that include this song
    collections?: CollectionAppearance[];
    // For collections: playlists that contain songs from this collection
    playlists?: PlaylistAppearance[];
};

import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { getUserById } from '../users/getUsers';

export async function getAppearancesById(id: string, type: string): Promise<AppearancesData | null> {
    if (type === "song") {
        return await getSongAppearances(id);
    } else if (type === "collection") {
        return await getCollectionAppearances(id);
    } else if (type === "playlist") {
        return null; // Playlists do not have appearances
    } else {
        return null;
    }
}

export async function getSongAppearances(songId: string): Promise<AppearancesData | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.APPEARANCES_SONGS_PATH.replace(":id", songId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
            const appearances = body.appearances;

            // Map collections asynchronously because we need to fetch the owner username
            const collectionPromises: Promise<CollectionAppearance>[] = (appearances.collections || []).map(async (col: any) => {

                const userBody = await getUserById(col.created_by_user_id);

                console.log("OWNER ID FOR COLLECTION APPEARANCE", userBody);

                return {
                    id: col.id ?? "",
                    type: col.type,
                    title: col.title ?? "",
                    position: col.position ?? 1, // TODO: no esta la position de la collection en el back
                    owner: userBody?.username ?? null,
                } as CollectionAppearance;
            });

            const collections: CollectionAppearance[] = await Promise.all(collectionPromises);

            console.log("COLLECTION APPEARANCES MAPPED", collections);

            // Map playlists asynchronously because we need to fetch the owner username
            const playlistPromises: Promise<PlaylistAppearance>[] = (appearances.playlists || []).map(async (pl: any) => {
                const userBody = await getUserById(pl.created_by_user_id);
                return {
                    id: pl.id ?? "",
                    title: pl.title ?? "",
                    owner: userBody?.username ?? null,
                    includedCount: pl.songs_from_collection ?? 0,
                    totalSongs: pl.total_songs ?? 5, //TODO: falta esto en el back
                } as PlaylistAppearance;
            });

            const playlists: PlaylistAppearance[] = await Promise.all(playlistPromises);

            const data: AppearancesData = {
                collections,
                playlists,
            };

            return data;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export async function getCollectionAppearances(collectionId: string): Promise<AppearancesData | null> {
    try {
        const cfg = await getRuntimeConfig();

        const collection_url = new URL(cfg.APPEARANCES_COLLECTIONS_PATH.replace(":id", collectionId), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

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
            const appearances = body.appearances;

            // Map playlists asynchronously because we need to fetch the owner username
            const playlistPromises: Promise<PlaylistAppearance>[] = (appearances.playlists || []).map(async (pl: any) => {
                const userBody = await getUserById(pl.created_by_user_id);
                return {
                    id: pl.id ?? "",
                    title: pl.title ?? "",
                    owner: userBody?.username ?? null,
                    includedCount: pl.songs_from_collection ?? 0,
                    totalSongs: pl.total_songs ?? 0,
                } as PlaylistAppearance;
            });

            const playlists: PlaylistAppearance[] = await Promise.all(playlistPromises);

            const data: AppearancesData = {
                playlists,
            };

            return data;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

