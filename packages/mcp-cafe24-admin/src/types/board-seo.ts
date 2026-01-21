export interface BoardSEO {
  shop_no: number;
  board_no: number;
  meta_title: string;
  meta_author: string;
  meta_description: string;
  meta_keywords: string;
}

export interface BoardSEOResponse {
  [key: string]: unknown;
  seo: BoardSEO;
}
