import { ReasonCodes } from "@/components/catalog/utils";

export interface ActiveBlock {
  id: number;
  target_id: number;
  target_type: string;
  regions: string[];
  reason_code: ReasonCodes;
  created_at: string;
  created_by_admin_id: string;
  is_active: boolean;
}

export interface ActiveBlocksResponse {
  blocks: ActiveBlock[];
  target_id: number;
  target_type: string;
  total: number;
}

export interface ActiveBlockDisplay {
  id: number;
  regions: string[];
  regionNames: string;
  reason_code: ReasonCodes;
  created_at: string;
}
