export interface BoardCategory {
  id: number;
  name: string;
}

export interface BoardAuthorProtection {
  is_use: "T" | "F";
  author_name_type?: string;
  comment_writer_name_type?: string;
  partial_character_display: number;
  alternative_text_display: string;
}

export interface BoardSpamPrevention {
  apply_scope: ("post_actions" | "comment")[];
  member_scope: "A" | "N";
}

export interface BoardWritePermissionExtra {
  is_member_buy: "T" | "F" | null;
  member_write_after: string | null;
  use_member_write_period: "T" | "F" | null;
  member_write_period: number | null;
  is_guest_buy: "T" | "F" | null;
  guest_write_after: string | null;
  use_guest_write_period: "T" | "F" | null;
  guest_write_period: number | null;
  product_info_option: "T" | "F" | null;
  post_length_limit: "T" | "F" | null;
  post_min_length: number | null;
  post_editable: "T" | "F" | null;
}

export interface BoardAdminFixed {
  is_use: "T" | "F";
  admin_title_list?: string[];
  admin_reply_list?: string[];
  staff_skip_post_title?: "T" | "F";
  staff_skip_reply_title?: "T" | "F";
}

export interface BoardInputForm {
  is_use: "T" | "F";
  input_form_title: string[];
  enable_input_form_title: ("T" | "F")[];
}

export interface Board {
  [key: string]: unknown;
  shop_no: number;
  board_no: number;
  board_type: number;
  board_name: string;
  use_additional_board: "T" | "F";
  use_board: "T" | "F";
  use_display: "T" | "F";
  use_top_image: "T" | "F";
  top_image_url: string;
  use_report: "T" | "F";
  use_writer_block: "T" | "F";
  display_order: number;
  attached_file: "T" | "F";
  attached_file_size_limit: number;
  article_display_type: "A" | "T" | "F";
  image_display: "T" | "F";
  image_resize: number;
  use_category: "T" | "F";
  categories: BoardCategory[];
  secret_only: "T" | "F";
  admin_confirm: "T" | "F";
  comment_author_display: "N" | "U" | "I";
  comment_author_protection: BoardAuthorProtection;
  spam_auto_prevention: BoardSpamPrevention;
  reply_feature: "T" | "F";
  write_permission: "A" | "V" | "I" | "N" | "G";
  write_member_group_no: number[];
  write_permission_extra: BoardWritePermissionExtra;
  reply_permission: "A" | "M" | "N" | "G";
  reply_member_group_no: number[];
  author_display: "N" | "U" | "I";
  author_protection: BoardAuthorProtection;
  board_guide: string;
  use_comment: "T" | "F";
  admin_title_fixed: BoardAdminFixed;
  admin_reply_fixed: BoardAdminFixed;
  input_form: BoardInputForm;
  page_size: number;
  product_page_size: number;
  page_display_count: number;
}

export interface BoardResponse {
  [key: string]: unknown;
  boards: Board[];
}

export interface BoardParams {
  shop_no?: number;
}

export interface ArticleFile {
  no: number;
  name: string;
  url: string;
}

export interface AttachedFileDetail {
  no: number;
  path: string;
  name: string;
  size: number;
  source: string;
  type: string;
  ext: string;
  width: number;
  height: number;
  thumb: string;
}
