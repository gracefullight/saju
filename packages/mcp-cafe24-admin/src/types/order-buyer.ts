export interface Buyer {
  shop_no: number;
  member_id: string;
  member_group_no: number;
  name: string;
  names_furigana?: string;
  email: string;
  phone: string;
  cellphone: string;
  customer_notification: string;
  updated_date: string;
  user_id: string;
  user_name: string;
  company_name: string;
  company_registration_no: string;
  buyer_zipcode: string;
  buyer_address1: string;
  buyer_address2: string;
}

export interface BuyerResponse {
  buyer: Buyer;
}

export interface BuyerUpdateResponse {
  buyer: {
    shop_no: number;
    order_id: string;
    name: string;
    email: string;
    phone: string;
    cellphone: string;
    customer_notification: string;
  };
}

export interface BuyerHistoryEntry {
  shop_no: number;
  name: string;
  email: string;
  phone: string;
  cellphone: string;
  customer_notification: string;
  updated_date: string;
  user_id: string;
  user_name: string;
}

export interface BuyerHistoryResponse {
  history: BuyerHistoryEntry[];
}
