

import { AVAILABILITY_MOCK } from './mock';
import { getItemById } from './summaryDetails';

export type RegionAvailability = {
  code: string;
  name: string;
  status: 'published' | 'unpublished' | 'not-available-region' | 'blocked-admin';
  scheduledAt: string | null;
};

export type AvailabilityDetails = {
  effectiveStatus: 'published' | 'unpublished' | 'not-available-region' | 'blocked-admin';
  scheduledAt?: string | null;
  regions: RegionAvailability[];
};


export async function getAvailabilityById(id: string, _type: string): Promise<AvailabilityDetails | null> {
  // TODO: agregar la parte de availability al backend y consumirla acá

  const item = await getItemById(id, _type);

  // Return mock data if available, otherwise default to published
  return AVAILABILITY_MOCK[id] || {
    effectiveStatus: item?.effectiveStatus ?? 'published',
    scheduledAt: item?.publishedAt || null,
    regions: [
      { code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
      { code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
      { code: 'BR', name: 'Brasil', status: 'not-available-region', scheduledAt: null },
      { code: 'MX', name: 'México', status: 'published', scheduledAt: null },
    ],
  };
}