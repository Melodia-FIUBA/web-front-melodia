/* Consolidated mock data for catalog: songs/collections/playlists, appearances and audit events */

export const SONGS_AND_OTHER_ITEMS_MOCK = {
	items: [
		// Songs (realistic examples)
		{
			id: 's1',
			type: 'song',
			title: 'Bohemian Rhapsody',
			artists: ['Queen'],
			collection: { id: 'col1', title: 'A Night at the Opera' },
			trackNumber: 11,
			duration: 354, // 5:54
			video: true,
			publishedAt: '1975-10-31',
			effectiveStatus: 'published',
		},
		{
			id: 's2',
			type: 'song',
			title: 'Imagine',
			artists: ['John Lennon'],
			collection: { id: 'col2', title: 'Imagine (Single)' },
			trackNumber: 1,
			duration: 183,
			video: false,
			publishedAt: '1971-10-11',
			effectiveStatus: 'published',
		},
		{
			id: 's3',
			type: 'song',
			title: 'Billie Jean',
			artists: ['Michael Jackson'],
			collection: { id: 'col3', title: 'Thriller' },
			trackNumber: 6,
			duration: 294,
			video: true,
			publishedAt: '1983-01-02',
			effectiveStatus: 'published',
		},
		{
			id: 's4',
			type: 'song',
			title: 'Hotel California',
			artists: ['Eagles'],
			collection: { id: 'col4', title: 'Hotel California' },
			trackNumber: 1,
			duration: 391,
			video: true,
			publishedAt: '1976-12-08',
			effectiveStatus: 'published',
		},
		{
			id: 's5',
			type: 'song',
			title: 'Shape of You',
			artists: ['Ed Sheeran'],
			collection: { id: 'col6', title: '÷ (Divide)' },
			trackNumber: 4,
			duration: 233,
			video: true,
			publishedAt: '2017-01-06',
			effectiveStatus: 'published',
		},
		{
			id: 's6',
			type: 'song',
			title: 'Blinding Lights',
			artists: ['The Weeknd'],
			collection: { id: 'col7', title: 'After Hours' },
			trackNumber: 6,
			duration: 200,
			video: true,
			publishedAt: '2019-11-29',
			effectiveStatus: 'published',
		},
		{
			id: 's7',
			type: 'song',
			title: 'Smells Like Teen Spirit',
			artists: ['Nirvana'],
			collection: { id: 'col5', title: 'Nevermind' },
			trackNumber: 1,
			duration: 301,
			video: true,
			publishedAt: '1991-09-10',
			effectiveStatus: 'published',
		},
		{
			id: 's8',
			type: 'song',
			title: 'Rolling in the Deep',
			artists: ['Adele'],
			collection: { id: 'col8', title: '21' },
			trackNumber: 2,
			duration: 228,
			video: true,
			publishedAt: '2010-11-29',
			effectiveStatus: 'published',
		},
		{
			id: 's9',
			type: 'song',
			title: 'Get Lucky',
			artists: ['Daft Punk', 'Pharrell Williams'],
			collection: { id: 'col9', title: 'Random Access Memories' },
			trackNumber: 8,
			duration: 369,
			video: true,
			publishedAt: '2013-04-19',
			effectiveStatus: 'published',
		},
		{
			id: 's10',
			type: 'song',
			title: 'One Dance',
			artists: ['Drake', 'Wizkid', 'Kyla'],
			collection: { id: 'col10', title: 'Views' },
			trackNumber: 4,
			duration: 173,
			video: true,
			publishedAt: '2016-04-05',
			effectiveStatus: 'published',
		},
		{
			id: 's11',
			type: 'song',
			title: 'Love of My Life',
			artists: ['Queen'],
			collection: { id: 'col1', title: 'A Night at the Opera' },
			trackNumber: 9,
			duration: 217,
			video: false,
			publishedAt: '1975-10-31',
			effectiveStatus: 'published',
		},
		{
			id: 's12',
			type: 'song',
			title: 'Thriller',
			artists: ['Michael Jackson'],
			collection: { id: 'col3', title: 'Thriller' },
			trackNumber: 4,
			duration: 357,
			video: true,
			publishedAt: '1982-11-30',
			effectiveStatus: 'published',
		},
		{
			id: 's13',
			type: 'song',
			title: 'Beat It',
			artists: ['Michael Jackson'],
			collection: { id: 'col3', title: 'Thriller' },
			trackNumber: 5,
			duration: 258,
			video: true,
			publishedAt: '1982-11-30',
			effectiveStatus: 'blocked_by_admin',
		},
		{
			id: 's14',
			type: 'song',
			title: 'Come As You Are',
			artists: ['Nirvana'],
			collection: { id: 'col5', title: 'Nevermind' },
			trackNumber: 3,
			duration: 219,
			video: false,
			publishedAt: '1991-09-24',
			effectiveStatus: 'published',
		},
		{
			id: 's15',
			type: 'song',
			title: 'Lithium',
			artists: ['Nirvana'],
			collection: { id: 'col5', title: 'Nevermind' },
			trackNumber: 5,
			duration: 257,
			video: false,
			publishedAt: '1991-09-24',
			effectiveStatus: 'published',
		},
		{
			id: 's16',
			type: 'song',
			title: 'Starlight Symphony',
			artists: ['Aurora Collective'],
			collection: { id: 'col11', title: 'Cosmic Dreams' },
			trackNumber: 1,
			duration: 245,
			video: true,
			publishedAt: null,
			effectiveStatus: 'scheduled',
		},
		{
			id: 's17',
			type: 'song',
			title: 'Midnight Echo',
			artists: ['Aurora Collective'],
			collection: { id: 'col11', title: 'Cosmic Dreams' },
			trackNumber: 2,
			duration: 198,
			video: true,
			publishedAt: null,
			effectiveStatus: 'scheduled',
		},
		{
			id: 's18',
			type: 'song',
			title: 'Celestial Waves',
			artists: ['Aurora Collective'],
			collection: { id: 'col11', title: 'Cosmic Dreams' },
			trackNumber: 3,
			duration: 312,
			video: false,
			publishedAt: null,
			effectiveStatus: 'scheduled',
		},

		// Collections (Album/EP/Single/Playlist)
		{
			id: 'col1',
			type: 'collection',
			title: 'A Night at the Opera',
			typeLabel: 'Album',
			year: 1975,
			owner: 'Queen',
			songs: [
				{ id: 's11', title: 'Love of My Life', position: 9, duration: 217 },
				{ id: 's1', title: 'Bohemian Rhapsody', position: 11, duration: 354 },
			],
			video: true,
			publishedAt: '1975-11-21',
			effectiveStatus: 'published',
		},
		{
			id: 'col2',
			type: 'collection',
			title: 'Imagine (Single)',
			typeLabel: 'Single',
			year: 1971,
			owner: 'John Lennon',
			songs: [
				{ id: 's2', title: 'Imagine', position: 1, duration: 183 },
			],
			video: false,
			publishedAt: '1971-10-11',
			effectiveStatus: 'published',
		},
		{
			id: 'col3',
			type: 'collection',
			title: 'Thriller',
			typeLabel: 'Album',
			year: 1982,
			owner: 'Michael Jackson',
			songs: [
				{ id: 's12', title: 'Thriller', position: 4, duration: 357 },
				{ id: 's13', title: 'Beat It', position: 5, duration: 258 },
				{ id: 's3', title: 'Billie Jean', position: 6, duration: 294 },
			],
			video: true,
			publishedAt: '1982-11-30',
			effectiveStatus: 'published',
		},
		{
			id: 'col4',
			type: 'collection',
			title: 'Hotel California',
			typeLabel: 'Album',
			year: 1976,
			owner: 'Eagles',
			songs: [
				{ id: 's4', title: 'Hotel California', position: 1, duration: 391 },
			],
			video: true,
			publishedAt: '1976-12-08',
			effectiveStatus: 'published',
		},
		{
			id: 'col5',
			type: 'collection',
			title: 'Nevermind',
			typeLabel: 'Album',
			year: 1991,
			owner: 'Nirvana',
			songs: [
				{ id: 's7', title: 'Smells Like Teen Spirit', position: 1, duration: 301 },
				{ id: 's14', title: 'Come As You Are', position: 3, duration: 219 },
				{ id: 's15', title: 'Lithium', position: 5, duration: 257 },
			],
			video: true,
			publishedAt: '1991-09-24',
			effectiveStatus: 'published',
		},
		{
			id: 'col6',
			type: 'collection',
			title: '÷ (Divide)',
			typeLabel: 'Album',
			year: 2017,
			owner: 'Ed Sheeran',
			songs: [
				{ id: 's5', title: 'Shape of You', position: 4, duration: 233 },
			],
			video: true,
			publishedAt: '2017-03-03',
			effectiveStatus: 'published',
		},
		{
			id: 'col7',
			type: 'collection',
			title: 'After Hours',
			typeLabel: 'Album',
			year: 2020,
			owner: 'The Weeknd',
			songs: [
				{ id: 's6', title: 'Blinding Lights', position: 6, duration: 200 },
			],
			video: true,
			publishedAt: '2020-03-20',
			effectiveStatus: 'published',
		},
		{
			id: 'col8',
			type: 'collection',
			title: '21',
			typeLabel: 'Album',
			year: 2011,
			owner: 'Adele',
			songs: [
				{ id: 's8', title: 'Rolling in the Deep', position: 2, duration: 228 },
			],
			video: true,
			publishedAt: '2011-01-24',
			effectiveStatus: 'published',
		},
		{
			id: 'col9',
			type: 'collection',
			title: 'Random Access Memories',
			typeLabel: 'Album',
			year: 2013,
			owner: 'Daft Punk',
			songs: [
				{ id: 's9', title: 'Get Lucky', position: 8, duration: 369 },
			],
			video: true,
			publishedAt: '2013-05-17',
			effectiveStatus: 'published',
		},
		{
			id: 'col10',
			type: 'collection',
			title: 'Views',
			typeLabel: 'Album',
			year: 2016,
			owner: 'Drake',
			songs: [
				{ id: 's10', title: 'One Dance', position: 4, duration: 173 },
			],
			video: true,
			publishedAt: '2016-04-29',
			effectiveStatus: 'published',
		},
		{
			id: 'col11',
			type: 'collection',
			title: 'Cosmic Dreams',
			typeLabel: 'Album',
			year: 2026,
			owner: 'Aurora Collective',
			songs: [
				{ id: 's16', title: 'Starlight Symphony', position: 1, duration: 245 },
				{ id: 's17', title: 'Midnight Echo', position: 2, duration: 198 },
				{ id: 's18', title: 'Celestial Waves', position: 3, duration: 312 },
			],
			video: true,
			publishedAt: null,
			effectiveStatus: 'scheduled',
		},

		// Playlists (curated)
		{
			id: 'pl1',
			type: 'playlist',
			title: 'Classic Rock Essentials',
			owner: 'Editorial',
			songs: [
				{ id: 's1', title: 'Bohemian Rhapsody', position: 1, duration: 354 },
				{ id: 's11', title: 'Love of My Life', position: 2, duration: 217 },
				{ id: 's4', title: 'Hotel California', position: 3, duration: 391 },
				{ id: 's7', title: 'Smells Like Teen Spirit', position: 4, duration: 301 },
			],
			video: true,
			publishedAt: null,
			effectiveStatus: 'published',
		},
		{
			id: 'pl2',
			type: 'playlist',
			title: 'Pop Hits 2010s',
			owner: 'TopCharts',
			songs: [
				{ id: 's5', title: 'Shape of You', position: 1, duration: 233 },
				{ id: 's6', title: 'Blinding Lights', position: 2, duration: 200 },
				{ id: 's10', title: 'One Dance', position: 3, duration: 173 },
				{ id: 's9', title: 'Get Lucky', position: 4, duration: 369 },
			],
			video: true,
			publishedAt: null,
			effectiveStatus: 'published',
		},
		{
			id: 'pl3',
			type: 'playlist',
			title: 'Acoustic & Chill',
			owner: 'UserCurator',
			songs: [
				{ id: 's2', title: 'Imagine', position: 1, duration: 183 },
				{ id: 's8', title: 'Rolling in the Deep', position: 2, duration: 228 },
				{ id: 's11', title: 'Love of My Life', position: 3, duration: 217 },
			],
			video: false,
			publishedAt: null,
			effectiveStatus: 'region_restricted',
		},
		{
			id: 'pl4',
			type: 'playlist',
			title: 'Dancefloor Anthems',
			owner: 'DJ Set',
			songs: [
				{ id: 's9', title: 'Get Lucky', position: 1, duration: 369 },
				{ id: 's6', title: 'Blinding Lights', position: 2, duration: 200 },
				{ id: 's3', title: 'Billie Jean', position: 3, duration: 294 },
				{ id: 's12', title: 'Thriller', position: 4, duration: 357 },
			],
			video: true,
			publishedAt: null,
			effectiveStatus: 'published',
		},
		{
			id: 'pl5',
			type: 'playlist',
			title: '80s & 90s Throwback',
			owner: 'RetroCurator',
			songs: [
				{ id: 's3', title: 'Billie Jean', position: 1, duration: 294 },
				{ id: 's12', title: 'Thriller', position: 2, duration: 357 },
				{ id: 's1', title: 'Bohemian Rhapsody', position: 3, duration: 354 },
				{ id: 's7', title: 'Smells Like Teen Spirit', position: 4, duration: 301 },
			],
			video: true,
			publishedAt: '2021-09-09',
			effectiveStatus: 'blocked_by_admin',
		},
		{
			id: 'pl6',
			type: 'playlist',
			title: 'Grunge Forever',
			owner: 'Alt Rock Fanatic',
			songs: [
				{ id: 's7', title: 'Smells Like Teen Spirit', position: 1, duration: 301 },
				{ id: 's14', title: 'Come As You Are', position: 2, duration: 219 },
				{ id: 's15', title: 'Lithium', position: 3, duration: 257 },
			],
			video: false,
			publishedAt: null,
			effectiveStatus: 'published',
		},
		{
			id: 'pl7',
			type: 'playlist',
			title: 'MJ Greatest Hits',
			owner: 'King of Pop',
			songs: [
				{ id: 's12', title: 'Thriller', position: 1, duration: 357 },
				{ id: 's13', title: 'Beat It', position: 2, duration: 258 },
				{ id: 's3', title: 'Billie Jean', position: 3, duration: 294 },
			],
		video: true,
		publishedAt: null,
		effectiveStatus: 'published',
	},
],
total: 36,
page: 1,
pageSize: 50,
};// Mock availability data consolidated here so other modules can reuse it.
// Keep coherence with `SONGS_AND_OTHER_ITEMS_MOCK` effectiveStatus values.
export const AVAILABILITY_MOCK: Record<string, {
	effectiveStatus: 'published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin';
	scheduledAt?: string | null;
	regions: { code: string; name: string; status: 'published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin'; scheduledAt: string | null }[];
}> = {
	// Songs
	's1': {
		effectiveStatus: 'published',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
		],
	},
	's2': {
		effectiveStatus: 'published',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
		],
	},
	's3': {
		effectiveStatus: 'published',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
		],
	},
	's13': {
		effectiveStatus: 'blocked_by_admin',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'blocked_by_admin', scheduledAt: null },
		],
	},
	's16': {
		effectiveStatus: 'scheduled',
		scheduledAt: '2025-12-15T00:00:00Z',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'AR', name: 'Argentina', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'BR', name: 'Brasil', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'MX', name: 'México', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
		],
	},
	's17': {
		effectiveStatus: 'scheduled',
		scheduledAt: '2025-12-15T00:00:00Z',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'AR', name: 'Argentina', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'BR', name: 'Brasil', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'MX', name: 'México', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
		],
	},
	's18': {
		effectiveStatus: 'scheduled',
		scheduledAt: '2025-12-15T00:00:00Z',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'AR', name: 'Argentina', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'BR', name: 'Brasil', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'MX', name: 'México', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
		],
	},

	// Playlists
	'pl3': {
		effectiveStatus: 'region_restricted',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'region_restricted', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
		],
	},
	'pl5': {
		effectiveStatus: 'blocked_by_admin',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'blocked_by_admin', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'blocked_by_admin', scheduledAt: null },
		],
	},

	// Collections
	'col1': {
		effectiveStatus: 'published',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
			{ code: 'ES', name: 'España', status: 'published', scheduledAt: null },
		],
	},
	'col3': {
		effectiveStatus: 'published',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
			{ code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
			{ code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
			{ code: 'MX', name: 'México', status: 'published', scheduledAt: null },
			{ code: 'ES', name: 'España', status: 'published', scheduledAt: null },
		],
	},
	'col11': {
		effectiveStatus: 'scheduled',
		scheduledAt: '2025-12-15T00:00:00Z',
		regions: [
			{ code: 'US', name: 'Estados Unidos', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'AR', name: 'Argentina', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'BR', name: 'Brasil', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'MX', name: 'México', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
			{ code: 'ES', name: 'España', status: 'scheduled', scheduledAt: '2025-12-15T00:00:00Z' },
		],
	},
};


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
	includedCount: number;
	totalSongs: number;
};

export type AppearancesData = {
	collections?: CollectionAppearance[];
	playlists?: PlaylistAppearance[];
};

// Mock appearances
export const MOCK_APPEARANCES: Record<string, AppearancesData> = {
	// Song examples - where each song appears
	's1': { // Bohemian Rhapsody
		collections: [
			{ id: 'col1', type: 'album', title: 'A Night at the Opera', position: 11 },
			{ id: 'pl1', type: 'playlist', title: 'Classic Rock Essentials', position: 1, owner: 'Editorial' },
			{ id: 'pl5', type: 'playlist', title: '80s & 90s Throwback', position: 3, owner: 'RetroCurator' },
		],
	},
	's2': { // Imagine
		collections: [
			{ id: 'col2', type: 'single', title: 'Imagine (Single)', position: 1 },
			{ id: 'pl3', type: 'playlist', title: 'Acoustic & Chill', position: 1, owner: 'UserCurator' },
		],
	},
	's3': { // Billie Jean
		collections: [
			{ id: 'col3', type: 'album', title: 'Thriller', position: 6 },
			{ id: 'pl4', type: 'playlist', title: 'Dancefloor Anthems', position: 3, owner: 'DJ Set' },
			{ id: 'pl5', type: 'playlist', title: '80s & 90s Throwback', position: 1, owner: 'RetroCurator' },
			{ id: 'pl7', type: 'playlist', title: 'MJ Greatest Hits', position: 3, owner: 'King of Pop' },
		],
	},
	's4': { // Hotel California
		collections: [
			{ id: 'col4', type: 'album', title: 'Hotel California', position: 1 },
			{ id: 'pl1', type: 'playlist', title: 'Classic Rock Essentials', position: 3, owner: 'Editorial' },
		],
	},
	's5': { // Shape of You
		collections: [
			{ id: 'col6', type: 'album', title: '÷ (Divide)', position: 4 },
			{ id: 'pl2', type: 'playlist', title: 'Pop Hits 2010s', position: 1, owner: 'TopCharts' },
		],
	},
	's6': { // Blinding Lights
		collections: [
			{ id: 'col7', type: 'album', title: 'After Hours', position: 6 },
			{ id: 'pl2', type: 'playlist', title: 'Pop Hits 2010s', position: 2, owner: 'TopCharts' },
			{ id: 'pl4', type: 'playlist', title: 'Dancefloor Anthems', position: 2, owner: 'DJ Set' },
		],
	},
	's7': { // Smells Like Teen Spirit
		collections: [
			{ id: 'col5', type: 'album', title: 'Nevermind', position: 1 },
			{ id: 'pl1', type: 'playlist', title: 'Classic Rock Essentials', position: 4, owner: 'Editorial' },
			{ id: 'pl5', type: 'playlist', title: '80s & 90s Throwback', position: 4, owner: 'RetroCurator' },
			{ id: 'pl6', type: 'playlist', title: 'Grunge Forever', position: 1, owner: 'Alt Rock Fanatic' },
		],
	},
	's8': { // Rolling in the Deep
		collections: [
			{ id: 'col8', type: 'album', title: '21', position: 2 },
			{ id: 'pl3', type: 'playlist', title: 'Acoustic & Chill', position: 2, owner: 'UserCurator' },
		],
	},
	's9': { // Get Lucky
		collections: [
			{ id: 'col9', type: 'album', title: 'Random Access Memories', position: 8 },
			{ id: 'pl2', type: 'playlist', title: 'Pop Hits 2010s', position: 4, owner: 'TopCharts' },
			{ id: 'pl4', type: 'playlist', title: 'Dancefloor Anthems', position: 1, owner: 'DJ Set' },
		],
	},
	's10': { // One Dance
		collections: [
			{ id: 'col10', type: 'album', title: 'Views', position: 4 },
			{ id: 'pl2', type: 'playlist', title: 'Pop Hits 2010s', position: 3, owner: 'TopCharts' },
		],
	},
	's11': { // Love of My Life
		collections: [
			{ id: 'col1', type: 'album', title: 'A Night at the Opera', position: 9 },
			{ id: 'pl1', type: 'playlist', title: 'Classic Rock Essentials', position: 2, owner: 'Editorial' },
			{ id: 'pl3', type: 'playlist', title: 'Acoustic & Chill', position: 3, owner: 'UserCurator' },
		],
	},
	's12': { // Thriller
		collections: [
			{ id: 'col3', type: 'album', title: 'Thriller', position: 4 },
			{ id: 'pl4', type: 'playlist', title: 'Dancefloor Anthems', position: 4, owner: 'DJ Set' },
			{ id: 'pl5', type: 'playlist', title: '80s & 90s Throwback', position: 2, owner: 'RetroCurator' },
			{ id: 'pl7', type: 'playlist', title: 'MJ Greatest Hits', position: 1, owner: 'King of Pop' },
		],
	},
	's13': { // Beat It
		collections: [
			{ id: 'col3', type: 'album', title: 'Thriller', position: 5 },
			{ id: 'pl7', type: 'playlist', title: 'MJ Greatest Hits', position: 2, owner: 'King of Pop' },
		],
	},
	's14': { // Come As You Are
		collections: [
			{ id: 'col5', type: 'album', title: 'Nevermind', position: 3 },
			{ id: 'pl6', type: 'playlist', title: 'Grunge Forever', position: 2, owner: 'Alt Rock Fanatic' },
		],
	},
	's15': { // Lithium
		collections: [
			{ id: 'col5', type: 'album', title: 'Nevermind', position: 5 },
			{ id: 'pl6', type: 'playlist', title: 'Grunge Forever', position: 3, owner: 'Alt Rock Fanatic' },
		],
	},

	// Collection examples - playlists that contain songs from these collections
	'col1': { // A Night at the Opera (Queen)
		playlists: [
			{ id: 'pl1', title: 'Classic Rock Essentials', owner: 'Editorial', includedCount: 2, totalSongs: 2 },
			{ id: 'pl3', title: 'Acoustic & Chill', owner: 'UserCurator', includedCount: 1, totalSongs: 2 },
			{ id: 'pl5', title: '80s & 90s Throwback', owner: 'RetroCurator', includedCount: 1, totalSongs: 2 },
		],
	},
	'col2': { // Imagine (Single)
		playlists: [
			{ id: 'pl3', title: 'Acoustic & Chill', owner: 'UserCurator', includedCount: 1, totalSongs: 1 },
		],
	},
	'col3': { // Thriller (Michael Jackson)
		playlists: [
			{ id: 'pl4', title: 'Dancefloor Anthems', owner: 'DJ Set', includedCount: 2, totalSongs: 3 },
			{ id: 'pl5', title: '80s & 90s Throwback', owner: 'RetroCurator', includedCount: 2, totalSongs: 3 },
			{ id: 'pl7', title: 'MJ Greatest Hits', owner: 'King of Pop', includedCount: 3, totalSongs: 3 },
		],
	},
	'col4': { // Hotel California (Eagles)
		playlists: [
			{ id: 'pl1', title: 'Classic Rock Essentials', owner: 'Editorial', includedCount: 1, totalSongs: 1 },
		],
	},
	'col5': { // Nevermind (Nirvana)
		playlists: [
			{ id: 'pl1', title: 'Classic Rock Essentials', owner: 'Editorial', includedCount: 1, totalSongs: 3 },
			{ id: 'pl5', title: '80s & 90s Throwback', owner: 'RetroCurator', includedCount: 1, totalSongs: 3 },
			{ id: 'pl6', title: 'Grunge Forever', owner: 'Alt Rock Fanatic', includedCount: 3, totalSongs: 3 },
		],
	},
	'col6': { // ÷ (Divide) (Ed Sheeran)
		playlists: [
			{ id: 'pl2', title: 'Pop Hits 2010s', owner: 'TopCharts', includedCount: 1, totalSongs: 1 },
		],
	},
	'col7': { // After Hours (The Weeknd)
		playlists: [
			{ id: 'pl2', title: 'Pop Hits 2010s', owner: 'TopCharts', includedCount: 1, totalSongs: 1 },
			{ id: 'pl4', title: 'Dancefloor Anthems', owner: 'DJ Set', includedCount: 1, totalSongs: 1 },
		],
	},
	'col8': { // 21 (Adele)
		playlists: [
			{ id: 'pl3', title: 'Acoustic & Chill', owner: 'UserCurator', includedCount: 1, totalSongs: 1 },
		],
	},
	'col9': { // Random Access Memories (Daft Punk)
		playlists: [
			{ id: 'pl2', title: 'Pop Hits 2010s', owner: 'TopCharts', includedCount: 1, totalSongs: 1 },
			{ id: 'pl4', title: 'Dancefloor Anthems', owner: 'DJ Set', includedCount: 1, totalSongs: 1 },
		],
	},
	'col10': { // Views (Drake)
		playlists: [
			{ id: 'pl2', title: 'Pop Hits 2010s', owner: 'TopCharts', includedCount: 1, totalSongs: 1 },
		],
	},
};

// Mock audit data
export interface AuditEvent {
  id: string;
  user: string;
  timestamp: string;
  event: 'blocked' | 'unblocked' | 'region-unavailable' | 'region-available';
  region?: string;
}

export const MOCK_AUDIT_DATA: Record<string, AuditEvent[]> = {
	's1': [ // Bohemian Rhapsody
		{
			id: 'e3',
			user: 'admin@melodia.com',
			timestamp: '2025-09-05T09:15:00Z',
			event: 'region-unavailable',
			region: 'CN',
		},
		{
			id: 'e4',
			user: 'admin@melodia.com',
			timestamp: '2025-10-20T16:45:00Z',
			event: 'region-available',
			region: 'US',
		},
		{
			id: 'e7',
			user: 'admin@melodia.com',
			timestamp: '2025-11-01T08:30:00Z',
			event: 'blocked',
		},
		{
			id: 'e1',
			user: 'admin@melodia.com',
			timestamp: '2025-11-01T10:30:00Z',
			event: 'region-available',
			region: 'EU',
		},
		{
			id: 'e2',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-15T14:20:00Z',
			event: 'unblocked',
		},
	],
	's2': [ // Imagine
		{
			id: 'e3',
			user: 'admin@melodia.com',
			timestamp: '2025-11-05T09:15:00Z',
			event: 'region-unavailable',
			region: 'CN',
		},
		{
			id: 'e4',
			user: 'admin@melodia.com',
			timestamp: '2025-10-20T16:45:00Z',
			event: 'region-available',
			region: 'US',
		},
	],
	's3': [ // Billie Jean
		{
			id: 'e5',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-10T14:30:00Z',
			event: 'region-available',
			region: 'LATAM',
		},
		{
			id: 'e6',
			user: 'admin@melodia.com',
			timestamp: '2025-11-08T11:00:00Z',
			event: 'unblocked',
		},
		{
			id: 'e7',
			user: 'admin@melodia.com',
			timestamp: '2025-11-01T08:30:00Z',
			event: 'blocked',
		},
	],
	's4': [ // Hotel California
		{
			id: 'e8',
			user: 'admin@melodia.com',
			timestamp: '2025-10-28T13:45:00Z',
			event: 'region-available',
			region: 'US',
		},
	],
	's5': [ // Shape of You
		{
			id: 'e9',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-07T10:20:00Z',
			event: 'region-unavailable',
			region: 'RU',
		},
		{
			id: 'e10',
			user: 'admin@melodia.com',
			timestamp: '2025-10-25T15:30:00Z',
			event: 'region-available',
			region: 'EU',
		},
	],
	's6': [ // Blinding Lights
		{
			id: 'e11',
			user: 'admin@melodia.com',
			timestamp: '2025-11-09T12:00:00Z',
			event: 'region-available',
			region: 'GLOBAL',
		},
	],
	's7': [ // Smells Like Teen Spirit
		{
			id: 'e12',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-06T16:10:00Z',
			event: 'unblocked',
		},
		{
			id: 'e13',
			user: 'admin@melodia.com',
			timestamp: '2025-10-30T09:45:00Z',
			event: 'blocked',
		},
		{
			id: 'e14',
			user: 'admin@melodia.com',
			timestamp: '2025-10-22T14:00:00Z',
			event: 'region-unavailable',
			region: 'JP',
		},
	],
	's8': [ // Rolling in the Deep
		{
			id: 'e15',
			user: 'admin@melodia.com',
			timestamp: '2025-11-04T11:30:00Z',
			event: 'region-available',
			region: 'UK',
		},
	],
	's9': [ // Get Lucky
		{
			id: 'e16',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-11T13:15:00Z',
			event: 'region-available',
			region: 'FR',
		},
		{
			id: 'e17',
			user: 'admin@melodia.com',
			timestamp: '2025-11-02T10:00:00Z',
			event: 'region-unavailable',
			region: 'DE',
		},
	],
	's10': [ // One Dance
		{
			id: 'e18',
			user: 'admin@melodia.com',
			timestamp: '2025-11-03T15:20:00Z',
			event: 'region-available',
			region: 'CA',
		},
	],
	's11': [ // Love of My Life
		{
			id: 'e19',
			user: 'moderator@melodia.com',
			timestamp: '2025-10-29T12:30:00Z',
			event: 'region-available',
			region: 'UK',
		},
	],
	's12': [ // Thriller
		{
			id: 'e20',
			user: 'admin@melodia.com',
			timestamp: '2025-11-08T14:45:00Z',
			event: 'region-available',
			region: 'US',
		},
		{
			id: 'e21',
			user: 'moderator@melodia.com',
			timestamp: '2025-10-18T09:30:00Z',
			event: 'unblocked',
		},
	],
	's13': [ // Beat It
		{
			id: 'e22',
			user: 'admin@melodia.com',
			timestamp: '2025-11-10T16:00:00Z',
			event: 'blocked',
		},
		{
			id: 'e23',
			user: 'moderator@melodia.com',
			timestamp: '2025-11-05T13:20:00Z',
			event: 'region-unavailable',
			region: 'CN',
		},
		{
			id: 'e24',
			user: 'admin@melodia.com',
			timestamp: '2025-10-12T11:00:00Z',
			event: 'unblocked',
		},
	],
	's14': [ // Come As You Are
		{
			id: 'e25',
			user: 'admin@melodia.com',
			timestamp: '2025-11-02T10:45:00Z',
			event: 'region-available',
			region: 'US',
		},
	],
	's15': [ // Lithium
		{
			id: 'e26',
			user: 'moderator@melodia.com',
			timestamp: '2025-10-31T15:30:00Z',
			event: 'region-available',
			region: 'EU',
		},
	],
};
