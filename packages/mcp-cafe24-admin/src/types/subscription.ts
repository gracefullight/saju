export interface SubscriptionShipmentSetting {
  shop_no: number;
  subscription_no: number;
  subscription_shipments_name: string;
  product_binding_type: string;
  one_time_purchase: string;
  use_discount: string;
  subscription_shipments_cycle?: string[];
}

export interface SubscriptionShipmentItemBundleComponent {
  variants_code: string | null;
  product_code: string | null;
  product_no: string | null;
  product_name: string | null;
  option_id: string | null;
  option_value: string | null;
  option_value_default: string | null;
  quantity: number | null;
  product_price: string | null;
  option_price: string | null;
}

export interface SubscriptionShipmentItem {
  variants_code: string;
  product_code: string;
  subscription_item_id: number;
  product_no: string;
  product_name: string;
  option_value: string | null;
  option_value_default: string | null;
  option_id: string;
  quantity: number;
  product_price: string;
  option_price: string;
  shipping_payment_option: string;
  subscription_shipments_sequence: number;
  subscription_state: string;
  expected_pay_date: string;
  terminated_date: string | null;
  product_bundle: "T" | "F";
  product_bundle_price: string | null;
  bundle_product_components: SubscriptionShipmentItemBundleComponent[];
  max_delivery_limit: number;
}

export interface SubscriptionShipment {
  subscription_id: string;
  member_id: string;
  buyer_name: string;
  buyer_zipcode: string;
  buyer_address1: string;
  buyer_address2: string;
  buyer_phone: string;
  buyer_cellphone: string;
  buyer_email: string;
  receiver_name: string;
  receiver_zipcode: string;
  receiver_address1: string;
  receiver_address2: string;
  receiver_phone: string;
  receiver_cellphone: string;
  shipping_message: string;
  delivery_type: "A" | "B";
  wished_delivery: "T" | "F";
  wished_delivery_start_hour: string;
  wished_delivery_end_hour: string;
  wished_delivery_hour_asap: "T" | "F";
  store_pickup: "T" | "F";
  use_virtual_phone_no: "T" | "F";
  created_date: string;
  terminated_date: string | null;
  subscription_state: "U" | "P" | "C";
  items: SubscriptionShipmentItem[];
}

export interface ListSubscriptionShipmentsResponse {
  shipments: SubscriptionShipment[];
}
export interface UpdateSubscriptionShipmentItemRequest {
  subscription_item_id: number;
  subscription_state?: "U" | "Q" | "O";
  quantity?: number;
  expected_delivery_date?: string;
  subscription_shipments_cycle?:
    | "1W"
    | "2W"
    | "3W"
    | "4W"
    | "1M"
    | "2M"
    | "3M"
    | "4M"
    | "5M"
    | "6M"
    | "1Y";
  changed_variant_code?: string;
  max_delivery_limit?: 0 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
}

export interface UpdateSubscriptionShipmentItemsRequest {
  shop_no?: number;
  subscription_id: string;
  requests: UpdateSubscriptionShipmentItemRequest[];
}

export interface UpdateSubscriptionShipmentItemsResponse {
  items: Array<{
    subscription_item_id: number;
    subscription_state?: string;
    quantity?: number;
    expected_delivery_date?: string;
    subscription_shipments_cycle?: string;
    changed_variant_code?: string;
    max_delivery_limit?: number;
  }>;
}
