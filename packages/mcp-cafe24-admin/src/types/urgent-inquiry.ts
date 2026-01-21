export interface UrgentInquiry {
  [key: string]: unknown;
  shop_no: number;
  article_no: number;
  article_type: string;
  title: string;
  writer: string;
  member_id: string;
  start_date: string;
  reply_status: "F" | "I" | "T";
  hit: number;
  content: string;
  writer_email: string;
  phone: string;
  search_type: "P" | "O";
  keyword: string;
  attached_file_detail: {
    no: number;
    source: string;
    name: string;
  }[];
}

export interface UrgentInquiryResponse {
  [key: string]: unknown;
  urgentinquiry: UrgentInquiry[];
  links: {
    rel: string;
    href: string;
  }[];
}

export interface UrgentInquiryReply {
  [key: string]: unknown;
  shop_no: number;
  article_no: number;
  created_date: string;
  status: "F" | "I" | "T";
  content: string;
  method: "E" | "S" | "A";
  count: number;
  user_id: string;
  attached_file_detail: {
    no: number;
    source: string;
    name: string;
  }[];
}

export interface UrgentInquiryReplyResponse {
  [key: string]: unknown;
  reply: UrgentInquiryReply;
}
