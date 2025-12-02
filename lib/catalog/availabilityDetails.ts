

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


  const item = await getItemById(id, type);

  const cfg = await getRuntimeConfig();
  let regions_availability: RegionAvailability[] = [];

  if (item?.effectiveStatus === 'scheduled') {
    regions_availability = getAllRegionsSameState("scheduled");
  } else {
    regions_availability = getAllRegionsSameState("published");

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
            if ((blocked_item.regions as string[]).includes("GLOBAL")){
              console.log("Item is globally blocked");
              regions_availability = getAllRegionsSameState("blocked_by_admin");
              break;
            } else if (blocked_item.regions.length > 0){
              regions_availability = regions_availability.map((region) => {
                if ((blocked_item.regions as string[]).includes(region.code)){
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
              if ((blocked_item.regions as string[]).includes("GLOBAL")){
                regions_availability = getAllRegionsSameState("blocked_by_admin");
                break;
              } else if (blocked_item.regions.length > 0){
                regions_availability = regions_availability.map((region) => {
                  if ((blocked_item.regions as string[]).includes(region.code)){
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
  }


  return {
    effectiveStatus: item?.effectiveStatus as ("published" | "scheduled" | "region_restricted" | "blocked_by_admin") ?? 'published',
    scheduledAt: item?.publishedAt || null,
    regions: regions_availability,
  };
}