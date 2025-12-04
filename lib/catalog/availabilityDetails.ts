

import { getRuntimeConfig } from '../config/envs';
import { getToken } from '../log/cookies';
import { getItemById } from './summaryDetails';
import { getAllRegionsSameState } from '@/components/catalog/utils';

export type RegionAvailability = {
  code: string;
  name: string;
  status: 'published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin';
  scheduledAt: string | null;
};

export type AvailabilityDetails = {
  effectiveStatus: 'published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin';
  scheduledAt?: string | null;
  regions: RegionAvailability[];
};



export async function getAvailabilityById(id: string, type: string): Promise<AvailabilityDetails | null> {


  let availability_details: AvailabilityDetails | null = null;
  let regions_availability: RegionAvailability[] = [];

  try {
    const item = await getItemById(id, type);

    if (type === 'song' || type === 'collection') {
      if (item?.statusInfo.published) {
        regions_availability = getAllRegionsSameState('published');
      } else {
        regions_availability = getAllRegionsSameState('scheduled');
      }
      
      // Process blocked_by_artist first (region_restricted has lower priority)
      if (item?.statusInfo.blocked_by_artist && Array.isArray(item.statusInfo.blocked_by_artist)) {
        if (item.statusInfo.blocked_by_artist.includes('GLOBAL')) {
          regions_availability = getAllRegionsSameState('region_restricted');
        } else {
          regions_availability = regions_availability.map((region) => {
            if (item.statusInfo.blocked_by_artist.includes(region.code)) {
              return { ...region, status: 'region_restricted' as const };
            }
            return region;
          });
        }
      }
      
      // Process admin_blocks (blocked_by_admin has higher priority)
      if (item?.statusInfo.admin_blocks && Array.isArray(item.statusInfo.admin_blocks)) {
        for (const block of item.statusInfo.admin_blocks) {
          if (block.regions && Array.isArray(block.regions)) {
            if (block.regions.includes('GLOBAL')) {
              regions_availability = getAllRegionsSameState('blocked_by_admin');
              break;
            } else {
              regions_availability = regions_availability.map((region) => {
                if (block.regions.includes(region.code)) {
                  return { ...region, status: 'blocked_by_admin' as const };
                }
                return region;
              });
            }
          }
        }
      }
    } else { //if (type === 'playlist')
      regions_availability = getAllRegionsSameState(item?.effectiveStatus as ('published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin') || 'published');

    }

    availability_details = {
      effectiveStatus: item?.effectiveStatus as ('published' | 'scheduled' | 'region_restricted' | 'blocked_by_admin') || 'published',
      scheduledAt: item?.publishedAt || null,
      regions: regions_availability,
    };

  } catch (error) {
    console.error("Error fetching availability details:", error);
    return null;
  }

  return availability_details;
}


export async function getAvailabilityById2(id: string, type: string): Promise<AvailabilityDetails | null> {


  const item = await getItemById(id, type);

  const cfg = await getRuntimeConfig();
  let regions_availability: RegionAvailability[] = [];

  console.log("Item fetched for availability:", item);

  try {
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Buscar bloques del tipo actual (song o collection)
    const blocked_items_url = new URL(`${cfg.CRUD_BLOCK_SONG_PATH}?target_type=${type}&page=1&per_page=20`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

    let res = await fetch(blocked_items_url, {
      method: "GET",
      headers: headers,
    });

    let body = await res?.json();
    console.log(`Blocked ${type}s response:`, body);

    if (res.ok && body) {
      for (const blocked_item of body.blocks) {
        if (blocked_item.target_id === Number(id)) {
          if ((blocked_item.regions as string[]).includes("GLOBAL")) {
            console.log("Item is globally blocked");
            regions_availability = getAllRegionsSameState("blocked_by_admin");
            break;
          } else if (blocked_item.regions.length > 0) {
            regions_availability = regions_availability.map((region) => {
              if ((blocked_item.regions as string[]).includes(region.code)) {
                return {
                  ...region,
                  status: "region_restricted" as const,
                };
              }
              return region;
            });
          }
        }
      }
    }

    // Si es una canción, revisar si su colección está bloqueada
    if (type === 'song' && item?.collection?.id && regions_availability[0].status !== "blocked_by_admin") {
      const blocked_collections_url = new URL(`${cfg.CRUD_BLOCK_SONG_PATH}?target_type=collection&page=1&per_page=20`, cfg.MELODIA_SONGS_BACKOFFICE_API_URL);

      res = await fetch(blocked_collections_url, {
        method: "GET",
        headers: headers,
      });

      body = await res?.json();
      console.log("Blocked collections response:", body);

      if (res.ok && body) {
        for (const blocked_item of body.blocks) {
          if (blocked_item.target_id === Number(item.collection.id)) {
            if ((blocked_item.regions as string[]).includes("GLOBAL")) {
              regions_availability = getAllRegionsSameState("blocked_by_admin");
              break;
            } else if (blocked_item.regions.length > 0) {
              regions_availability = regions_availability.map((region) => {
                if ((blocked_item.regions as string[]).includes(region.code)) {
                  return {
                    ...region,
                    status: "region_restricted" as const,
                  };
                }
                return region;
              });
            }
          }
        }
      }
    }

  } catch (error) {
    console.error("Error fetching blocked items:", error);
  }



  return {
    effectiveStatus: item?.effectiveStatus as ("published" | "scheduled" | "region_restricted" | "blocked_by_admin") ?? 'published',
    scheduledAt: item?.publishedAt || null,
    regions: regions_availability,
  };
}