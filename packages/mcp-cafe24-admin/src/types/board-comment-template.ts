export interface BoardCommentTemplate {
  [key: string]: unknown;
  shop_no: number;
  comment_no: number;
  title: string;
  content: string;
  board_type: number;
  created_date: string;
}

export interface BoardCommentTemplatesResponse {
  [key: string]: unknown;
  commenttemplates: BoardCommentTemplate[];
}

export interface BoardCommentTemplateResponse {
  [key: string]: unknown;
  commenttemplate: BoardCommentTemplate;
}
