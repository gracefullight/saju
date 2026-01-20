import { z } from "zod";

export const TaxManagerParamsSchema = z.object({}).strict();

export type TaxManagerParams = z.infer<typeof TaxManagerParamsSchema>;
