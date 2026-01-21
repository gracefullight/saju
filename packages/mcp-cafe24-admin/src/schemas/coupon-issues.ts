import { z } from "zod";

export const CouponIssuesSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().min(1).describe("Coupon number"),
    member_id: z.string().max(20).optional().describe("Member ID"),
    group_no: z.number().int().optional().describe("Group number"),
    issued_date: z.string().optional().describe("Issued on (YYYY-MM-DD)"),
    issued_start_date: z.string().optional().describe("Search start date (YYYY-MM-DD)"),
    issued_end_date: z.string().optional().describe("Search end date (YYYY-MM-DD)"),
    used_coupon: z.enum(["T", "F"]).optional().describe("Status (T: Used, F: Not used)"),
    since_issue_no: z
      .string()
      .optional()
      .describe("Search for coupons issued after this issue number (cannot use with offset)"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export const CouponIssueCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    coupon_no: z.string().min(1).describe("Coupon number"),
    request: z
      .object({
        issued_member_scope: z
          .enum(["A", "G", "M"])
          .describe("Issue member scope (A: all, G: group, M: member)"),
        group_no: z.number().int().optional().describe("Group number (required when scope is G)"),
        member_id: z.string().max(20).optional().describe("Member ID (required when scope is M)"),
        send_sms_for_issue: z
          .enum(["T", "F"])
          .default("F")
          .describe("Send SMS for issue (T: send, F: do not send)"),
        allow_duplication: z
          .enum(["T", "F", "S"])
          .default("F")
          .describe("Allow duplication (T: issued, F: not issued, S: not issued w/o validation)"),
        single_issue_per_once: z
          .enum(["T", "F"])
          .default("T")
          .describe("Single issue per request (T: one by one, F: as many as configured)"),
        issue_count_per_once: z
          .number()
          .int()
          .min(2)
          .max(10)
          .default(2)
          .describe("Issue count per request (2-10)"),
        issued_place_type: z.enum(["W", "M", "P"]).optional().describe("Issued place (W, M, P)"),
        issued_by_action_type: z
          .enum(["INSTALLATION", "ACCEPTING_PUSH"])
          .optional()
          .describe("Issued action type"),
        issued_by_event_type: z
          .enum(["C", "U", "B", "R", "Z", "Y", "X", "M", "W", "V", "L"])
          .optional()
          .describe("Reason for issuance"),
        request_admin_id: z.string().optional().describe("Request admin ID"),
      })
      .strict()
      .describe("Issue request"),
  })
  .strict();

export type CouponIssuesSearchParams = z.infer<typeof CouponIssuesSearchParamsSchema>;
export type CouponIssueCreateParams = z.infer<typeof CouponIssueCreateParamsSchema>;
