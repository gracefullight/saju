import { z } from "zod";

export const CollectRequestUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request_no: z.number().int().min(1).describe("Request number"),
    request: z.object({
      collect_tracking_no: z.string().max(40).describe("Collection tracking number"),
    }),
  })
  .strict();
