export interface DiscountInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface PointsInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface MobileDiscountInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface MobilePointsInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface DiscountLimitInformation {
  discount_limit_type: "A" | "B" | "C";
  discount_amount_limit: string | null;
  number_of_discount_limit: number | null;
}

export interface CustomerGroup {
  shop_no: number;
  group_no: number;
  group_name: string;
  group_description: string;
  group_icon: string;
  benefits_paymethod: "A" | "B" | "C";
  buy_benefits: "F" | "D" | "M" | "P";
  ship_benefits: "T" | "F";
  product_availability: "P" | "M" | "A";
  discount_information: DiscountInformation | null;
  points_information: PointsInformation | null;
  mobile_discount_information: MobileDiscountInformation | null;
  mobile_points_information: MobilePointsInformation | null;
  discount_limit_information: DiscountLimitInformation | null;
}

export interface CustomerGroupsResponse {
  customergroups: CustomerGroup[];
}

export interface CustomerGroupsSearchParams {
  shop_no?: number;
  group_no?: string;
  group_name?: string;
}

export interface CustomerGroupParams {
  shop_no?: number;
  group_no: number;
}

export interface CustomerGroupsCountParams {
  shop_no?: number;
  group_no?: string;
  group_name?: string;
}

export interface MoveCustomerToGroupRequest {
  member_id: string;
  fixed_group?: "T" | "F";
}

export interface MoveCustomerToGroupParams {
  shop_no?: number;
  group_no: number;
  requests: MoveCustomerToGroupRequest[];
}
