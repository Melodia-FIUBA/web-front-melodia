/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { AuditEvent } from '@/components/catalog/CatalogAuditTab';
import { getUserById } from '../users/getUsers';
import { countryNamesES } from '@/components/catalog/utils';

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  const datePart = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return `${datePart}, ${timePart}`;
};

function getEventLabel(eventType: string): string {
  if (eventType === 'blocked') return 'Bloqueo de Administrador';
  if (eventType === 'unblocked') return 'Desbloqueo de Administrador';
  if (eventType === 'updated') return 'Actualización de Políticas del Artista';
  if (eventType === 'published') return 'Publicación del contenido';
  return eventType;
}

function getReasonLabel(event: { event_type: string; changes: Record<string, unknown> }): string {
  if (event.event_type === 'updated') {
    if ('artist_blocked_regions' in event.changes) {
      return 'Nueva Política Territorial del Artista';
    } else { //('release_date' in event.changes) 
      return 'Nueva Política de Vigencia del Artista';
    }
  }

  const reasonCode = event.changes.reason_code;
  if (!reasonCode) return '-';

  const reasons: Record<string, string> = {
    'copyright_violation': 'Violación de derechos de autor',
    'explicit_content': 'Contenido explícito',
    'legal_request': 'Solicitud legal',
    'terms_violation': 'Violación de términos',
    'legacy_migration': 'Migración de sistema anterior',
    'unspecified': 'No especificado',
  };
  return reasons[reasonCode as string] || String(reasonCode);
}

function formatRegions(regions: string[] | undefined): string {
  if (!regions || regions.length === 0) {
    return 'Disponibilidad Global';
  }
  if (regions.includes('GLOBAL')) {
    return 'Bloqueo Global';
  }
  return regions
    .map(code => countryNamesES[code.toLowerCase()] || code)
    .join(', ');
}

function formatChanges(event: { event_type: string; changes: Record<string, unknown> }): string {
  if (event.event_type === 'blocked' || event.event_type === 'unblocked') {
    return `${formatRegions(event.changes.regions as string[])}`;
  }

  if (event.event_type === 'updated') {
    const lines: string[] = [];

    if ('artist_blocked_regions' in event.changes) {
      const artistRegions = event.changes.artist_blocked_regions as { old?: string[]; new?: string[] };
      const oldRegions = formatRegions(artistRegions.old);
      const newRegions = formatRegions(artistRegions.new);
      lines.push(` ${oldRegions} → ${newRegions}`);
    } else if ('release_date' in event.changes) {
      const releaseDate = event.changes.release_date as { old?: string; new?: string };
      lines.push(`${formatTimestamp(releaseDate.old || '')} → ${formatTimestamp(releaseDate.new || '')}`);
    }

    return lines.join('\n');
  }

  if (event.event_type === 'published' && event.changes.release_date) {
    return `Fecha de lanzamiento: ${event.changes.release_date}`;
  }

  return '-';
}

export async function auditItemById(id: string, type: string): Promise<AuditEvent[] | null> {
  // Solo las canciones y colecciones tienen auditoría
  if (type !== 'song' && type !== 'collection') {
    return null;
  }

  if (type === 'collection') {
    return await auditCollectionById(id, type);
  }

  if (type === 'song') {
    return await auditSongById(id, type);
  }

  return null;
}

export async function auditCollectionById(id: string, _type: string): Promise<AuditEvent[] | null> {
  const cfg = await getRuntimeConfig();

  const search_url = new URL(`${cfg.AUDIT_COLLECTIONS_PATH}?limit=20&offset=0`.replace(':id', id), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

  const token = getToken();

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(search_url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    return [];
  }

  const body = await res.json();

  if (body && body.events) {
    let auditEvents: AuditEvent[] = [];

    for (const event of body.events) {
      const user = await getUserById(event.changed_by_user_id);
      // mientras no se de el caso de un evento buggy que no corresponde a un cambio real del backoffice
      if (!(event.event_type === 'updated' && 'artist_blocked_regions' in event.changes === false && 'release_date' in event.changes === false)) {
        auditEvents.push({
          event_type: event.event_type,
          event_label: getEventLabel(event.event_type),
          changed_by_user_id: user?.username || event.changed_by_user_id,
          timestamp: formatTimestamp(event.timestamp),
          reason: getReasonLabel(event),
          block_id: event.block_id ? String(event.block_id) : '-',
          changes_display: formatChanges(event),
        });
      }
    }

    return auditEvents;
  }

  return [];
}


export async function auditSongById(id: string, _type: string): Promise<AuditEvent[] | null> {
  const cfg = await getRuntimeConfig();

  const search_url = new URL(`${cfg.AUDIT_SONGS_PATH}?limit=20&offset=0`.replace(':id', id), cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

  const token = getToken();

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(search_url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    return [];
  }

  const body = await res.json();

  if (body && body.events) {
    let auditEvents: AuditEvent[] = [];

    for (const event of body.events) {
      const user = await getUserById(event.changed_by_user_id);
      if (!(event.event_type === 'updated' && 'artist_blocked_regions' in event.changes === false && 'release_date' in event.changes === false)) {
        auditEvents.push({
          event_type: event.event_type,
          event_label: getEventLabel(event.event_type),
          changed_by_user_id: user?.username || event.changed_by_user_id,
          timestamp: formatTimestamp(event.timestamp),
          reason: getReasonLabel(event),
          block_id: event.block_id ? String(event.block_id) : '-',
          changes_display: formatChanges(event),
        });
      }
    }

    return auditEvents;
  }

  return [];
}

