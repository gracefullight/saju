// Type definitions for Cafe24 API responses

export interface Cafe24ApiResponse<T> {
  code?: string;
  message?: string;
  // biome-ignore lint/suspicious/noExplicitAny: API response structure is dynamic
  more_info?: Record<string, any>;
  resource?: T;
}

export interface Cafe24Error {
  code: string;
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: API response structure is dynamic
  more_info?: Record<string, any>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}

// Store types
export interface Store {
  mall_id: string;
  mall_name: string;
  shop_no: number;
  currency_code: string;
  currency_symbol: string;
  company_name?: string;
  company_registration_no?: string;
  president_name?: string;
  base_domain?: string;
  primary_domain?: string;
  email?: string;
  phone?: string;
  customer_service_phone?: string;
  address1?: string;
  address2?: string;
  sales_product_categories?: string[] | string;
}

export interface AdminUser {
  user_id: string;
  user_name: string;
  email: string;
  phone: string;
  admin_type: string;
  last_login_date?: string;
  ip_restriction_type?: string;
  nick_name?: string;
  available?: string;
  memo?: string;
  multishop_access_authority?: string;
  ip_access_restriction?: {
    usage: string;
  };
  shop_no?: number;
}

export interface StoreAccount {
  bank_name: string;
  bank_code: string;
  bank_account_no: string;
  bank_account_holder: string;
  use_account: string;
}

export interface Shop {
  shop_no: number;
  shop_name: string;
  currency_code: string;
  locale_code: string;
}

export interface User {
  member_id: string;
  user_id: string;
  user_name: string;
  email: string;
  status: string;
  group: string;
}

// Product types
export interface Product {
  product_no: number;
  product_code: string;
  product_name: string;
  product_name_origin: string;
  summary_description: string;
  detail_description: string;
  price: number;
  selling: boolean;
  display: boolean;
  stock: number;
  created_date: string;
  updated_date: string;
}

export interface Category {
  category_no: number;
  category_name: string;
  full_category_name: string;
  depth: number;
  parent_category_no: number | null;
}

// Order types
export interface Order {
  order_id: string;
  order_name: string;
  order_status_code: string;
  order_status_name: string;
  payment_status: string;
  payment_status_name: string;
  settle_amount: number;
  currency: string;
  order_date: string;
  customer_id: string;
  customer_name: string;
}

// Customer types
export interface Customer {
  member_id: string;
  member_name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  join_date: string;
}

// Board types
export interface Board {
  board_no: number;
  board_name: string;
  board_type: string;
  display: boolean;
  use: boolean;
}

export interface Article {
  article_no: number;
  board_no: number;
  subject: string;
  writer_name: string;
  writer_id: string;
  content: string;
  read_count: number;
  comment_count: number;
  write_date: string;
}
