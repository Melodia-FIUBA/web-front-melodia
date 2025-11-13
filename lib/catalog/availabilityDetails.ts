

import { AVAILABILITY_MOCK } from './mock';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchAvailabilityById(id: string, _type: string): Promise<AvailabilityDetails | null> {
  // TODO: Replace with actual API call
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data if available, otherwise default to published
  return AVAILABILITY_MOCK[id] || {
    effectiveStatus: 'published',
    regions: [
      { code: 'US', name: 'Estados Unidos', status: 'published', scheduledAt: null },
      { code: 'AR', name: 'Argentina', status: 'published', scheduledAt: null },
      { code: 'BR', name: 'Brasil', status: 'published', scheduledAt: null },
      { code: 'MX', name: 'México', status: 'published', scheduledAt: null },
    ],
  };
}