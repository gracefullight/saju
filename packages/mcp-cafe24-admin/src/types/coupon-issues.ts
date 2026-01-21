export interface CouponIssue {
  shop_no: number;
  coupon_no: string;
  issue_no: string;
  member_id: string;
  group_no: number;
  issued_date: string;
  expiration_date: string;
  used_coupon: "T" | "F";
  used_date: string | null;
  related_order_id: string | null;
}

export interface CouponIssueLink {
  rel: string;
  href: string;
}

export interface CouponIssuesListResponse {
  issues: CouponIssue[];
  links?: CouponIssueLink[];
}

export interface CouponIssueCreateRequest {
  shop_no?: number;
  request: {
    issued_member_scope: "A" | "G" | "M";
    group_no?: number;
    member_id?: string;
    send_sms_for_issue?: "T" | "F";
    allow_duplication?: "T" | "F" | "S";
    single_issue_per_once?: "T" | "F";
    issue_count_per_once?: number;
    issued_place_type?: "W" | "M" | "P";
    issued_by_action_type?: "INSTALLATION" | "ACCEPTING_PUSH";
    issued_by_event_type?: "C" | "U" | "B" | "R" | "Z" | "Y" | "X" | "M" | "W" | "V" | "L";
    request_admin_id?: string;
  };
}

export interface CouponIssueCreateResponse {
  issues: {
    shop_no: number;
    count: Record<string, number>;
  };
}
