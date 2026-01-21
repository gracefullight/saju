export interface CustomerProperty {
  [key: string]: unknown;
  key: string;
  name: string;
  use: "T" | "F";
  required: "T" | "F";
}

export interface CustomerPropertiesResponse {
  [key: string]: unknown;
  customer: {
    [key: string]: unknown;
    shop_no: number;
    type: "join" | "edit";
    properties: CustomerProperty[];
  };
}

export interface CustomerPropertiesParams {
  shop_no?: number;
  type?: "join" | "edit";
}
