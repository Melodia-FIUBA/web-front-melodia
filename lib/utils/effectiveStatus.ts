

// Helper function to get status label
export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'published':
            return 'Publicado';
        case 'scheduled':
            return 'Programado';
        case 'region_restricted':
            return 'No disponible en región';
        case 'blocked_by_admin':
            return 'Bloqueado por admin';
        default:
            return status;
    }
};

// Retorna la paleta de color a usar en componentes Chakra (ej: 'green', 'blue', 'orange', 'red')
export const getStatusPalette = (status: string) => {
    switch (status) {
        case 'published':
            return 'green';
        case 'scheduled':
            return 'yellow';
        case 'region_restricted':
            return 'orange';
        case 'blocked_by_admin':
            return 'red';
        default:
            return 'gray';
    }
};

// Retorna el color hexadecimal para usar en mapas SVG basándose en la paleta
export const getMapColor = (status: string) => {
    const palette = getStatusPalette(status);
    
    // Mapeo de paletas Chakra a colores hexadecimales
    const paletteToHex: Record<string, string> = {
        'green': '#10b981',
        'blue': '#3b82f6',
        'orange': '#f97316',
        'red': '#ef4444',
        'gray': '#6b7280',
        'yellow': '#f5b00b',
    };
    
    return paletteToHex[palette] || '#6b7280';
};

export function calculateEffectiveStatus(status_info: any, type: string, is_public_playlist?: boolean): string {
    if (type === 'song' || type === 'collection') {
        //si status_info.admin_blocks no es vacio, entonces está bloqueado por admin
        if (status_info.admin_blocks && status_info.admin_blocks.length > 0) {
            return 'blocked_by_admin';
        } else if (status_info.blocked_by_artist && status_info.blocked_by_artist.length > 0) {
            return 'region_restricted';
        }
        if (status_info.published) {
            return 'published';
        } else {
            return 'scheduled';
        }

    } else if (type === 'playlist') {
        if (is_public_playlist) {
            return 'published';
        } else {
            return 'scheduled';
        }
    }
    return 'published';
}
