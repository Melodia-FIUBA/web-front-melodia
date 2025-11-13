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

import { MOCK_APPEARANCES } from './mock';
import { CatalogFilters, getCatalogResults } from './searchCatalog';

export async function getAppearancesById(id: string, type: string): Promise<AppearancesData | null> {
    
    return MOCK_APPEARANCES[id] || null;
}