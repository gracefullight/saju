import type { Cafe24Enum } from "@/types/common.js";

export interface Automail {
  shop_no: number;
  type: string;
  use_customer: Cafe24Enum;
  use_admin: Cafe24Enum;
  use_supplier: Cafe24Enum;
  [key: string]: unknown;
}

export interface AutomailListResponse {
  automails: Automail[];
  [key: string]: unknown;
}

export interface AutomailSetting {
  type: string;
  use_customer: Cafe24Enum;
  use_admin: Cafe24Enum;
  use_supplier: Cafe24Enum;
  [key: string]: unknown;
}

export interface AutomailUpdateRequest {
  shop_no: number;
  requests: AutomailSetting[];
  [key: string]: unknown;
}
