export interface CollectRequest {
  shop_no: number;
  request_no: number;
  order_id: string;
  order_item_code: string[];
  shipping_company_name: string;
  collect_tracking_no: string;
}
