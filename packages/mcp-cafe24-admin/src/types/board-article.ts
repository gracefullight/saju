import type { ArticleFile, AttachedFileDetail } from "@/types/board.js";

export interface BoardArticle {
  [key: string]: unknown;
  shop_no: number;
  article_no: number;
  parent_article_no: number;
  board_no: number;
  product_no: number;
  category_no: number;
  board_category_no: number;
  reply_sequence: number;
  reply_depth: number;
  created_date: string;
  writer: string;
  writer_email: string;
  member_id: string;
  title: string;
  content: string;
  supplier_id: string;
  client_ip: string;
  nick_name: string;
  rating: number;
  reply_mail: "Y" | "N";
  display: "T" | "F";
  secret: "T" | "F";
  notice: "T" | "F";
  fixed: "T" | "F";
  deleted: "T" | "F" | "B";
  input_channel: "P" | "M";
  order_id: string;
  attach_file_urls?: ArticleFile[];
  hit: number;
  reply: "T" | "F";
  reply_user_id: string;
  reply_status: "N" | "P" | "C";
  naverpay_review_id: string;
  display_time: "T" | "F";
  display_time_start_hour?: number | string;
  display_time_end_hour?: number | string;
  attached_file_detail?: AttachedFileDetail[];
}

export interface BoardArticlesResponse {
  [key: string]: unknown;
  articles: BoardArticle[];
}

export interface BoardArticleResponse {
  [key: string]: unknown;
  article: BoardArticle;
}

export interface DeleteBoardArticleResponse {
  [key: string]: unknown;
  article: {
    shop_no: number;
    board_no: number;
    article_no: number;
  };
}
