/* eslint-disable prefer-const */


import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { AuditEvent } from '@/components/catalog/CatalogAuditTab';
import { getUserById } from '../users/getUsers';

export async function auditItemById(id: string, type: string): Promise<AuditEvent[] | null> {
  // Solo las canciones y colecciones tienen auditoría
  if (type !== 'song' && type !== 'collection') {
    return null;
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
    let blocks: AuditEvent[] = [];

    for (const block of body.blocks) {
      const createdByUser = await getUserById(block.created_by_admin_id);
      const deactivatedByUser = block.deactivated_by_admin_id 
        ? await getUserById(block.deactivated_by_admin_id)
        : null;

      blocks.push({
        ...block,
        created_by_admin_id: createdByUser?.username || block.created_by_admin_id,
        deactivated_by_admin_id: deactivatedByUser?.username || block.deactivated_by_admin_id,
      });
    }

    return blocks;
  }

  return [];
}