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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAppearancesById(id: string, _type: string): Promise<AppearancesData | null> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/catalog/${type}/${id}/appearances`);
    // return response.json();
    
    // Mock implementation with simulated delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_APPEARANCES[id] || null;
}