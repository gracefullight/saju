export interface CustomerPaymentInfo {
  [key: string]: unknown;
  shop_no: number;
  member_id: string;
  payment_method: string;
  payment_gateway: string;
  created_date: string;
  payment_proiority: number;
  payment_method_id: string;
}

export interface CustomerPaymentInfoResponse {
  [key: string]: unknown;
  paymentinformation: CustomerPaymentInfo[];
}

export interface DeleteCustomerPaymentInfoResponse {
  [key: string]: unknown;
  paymentinformation: {
    [key: string]: unknown;
    shop_no: number;
    member_id: string;
    payment_method_id?: string;
  };
}

export interface CustomerPaymentInfoParams {
  shop_no?: number;
  member_id: string;
}

export interface DeletePaymentMethodParams extends CustomerPaymentInfoParams {
  payment_method_id: string;
}
