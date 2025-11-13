export interface AuditEvent {
  id: string;
  user: string;
  timestamp: string;
  event: 'blocked' | 'unblocked' | 'region-unavailable' | 'region-available';
  region?: string; // Solo para eventos de región
}

import { MOCK_AUDIT_DATA } from './mock';

export async function auditItemById(id: string, type: string): Promise<AuditEvent[] | null> {
  // Solo las canciones tienen auditoría
  if (type !== 'song') {
    return null;
  }

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Retornar datos mock
  return MOCK_AUDIT_DATA[id] || [];
}