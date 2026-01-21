import type { ArticleFile } from "@/types/board.js";

export interface BoardComment {
  [key: string]: unknown;
  shop_no: number;
  board_no: number;
  article_no: number;
  comment_no: number;
  content: string;
  writer: string;
  member_id: string;
  created_date: string;
  client_ip: string;
  rating: number;
  secret: "T" | "F";
  parent_comment_no: number | null;
  input_channel: "P" | "M";
  attach_file_urls?: ArticleFile[];
}

export interface BoardCommentsResponse {
  [key: string]: unknown;
  comments: BoardComment[];
}

export interface BoardCommentResponse {
  [key: string]: unknown;
  comment: BoardComment;
}

export interface DeleteBoardCommentResponse {
  [key: string]: unknown;
  comment: {
    shop_no: number;
    board_no: number;
    article_no: number;
    comment_no: number;
  };
}
