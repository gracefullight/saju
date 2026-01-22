import { z } from "zod";

export const SupplierManagerSchema = z.object({
  no: z.number().int().optional().describe("Manager number (unique ID)"),
  name: z.string().describe("Manager name"),
  phone: z.string().describe("Manager phone number"),
  email: z.string().email().describe("Manager email address"),
  use_sms: z.enum(["T", "F"]).optional().describe("Whether to use SMS"),
});

export const ListSuppliersSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    supplier_code: z.string().optional().describe("Supplier code (comma separated for multiple)"),
    supplier_name: z.string().optional().describe("Supplier name (comma separated for multiple)"),
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .optional()
      .default(0)
      .describe("Start location of list"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(10)
      .describe("Limit the number of results"),
  })
  .strict();

export const CountSuppliersSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    supplier_code: z.string().optional().describe("Supplier code"),
    supplier_name: z.string().optional().describe("Supplier name"),
  })
  .strict();

export const GetSupplierSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    supplier_code: z.string().describe("Supplier code"),
  })
  .strict();

export const CreateSupplierSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    request: z
      .object({
        supplier_name: z.string().max(50).describe("Supplier name"),
        manager_information: z
          .array(SupplierManagerSchema)
          .max(3)
          .optional()
          .describe("Person in charge information (up to 3)"),
        use_supplier: z
          .enum(["T", "F"])
          .optional()
          .default("T")
          .describe("Set whether to use the supplier information"),
        trading_type: z
          .enum(["D", "C"])
          .optional()
          .default("D")
          .describe("Retail : D, Direct shipping : C"),
        supplier_type: z
          .enum(["WS", "SF", "BS", "ET"])
          .optional()
          .default("WS")
          .describe("Wholesale: WS, Retail: SF, Store in mall: BS, Other: ET"),
        status: z
          .enum(["A", "P", "N"])
          .optional()
          .default("A")
          .describe("Business on going: A, On hold: P, Business terminated: N"),
        business_item: z.string().max(255).optional().describe("Product type for business"),
        payment_type: z
          .enum(["P", "D"])
          .optional()
          .default("P")
          .describe("Commission type: P, Buying type: D"),
        payment_period: z
          .enum(["0", "C", "B", "A"])
          .optional()
          .default("0")
          .describe("Do not set: 0, Daily: C, Weekly: B, Monthly: A"),
        payment_method: z
          .union([z.literal("10"), z.literal("30"), z.literal("40")])
          .optional()
          .describe("Complete payment: 10, Start shipping: 30, Shipping complete: 40"),
        payment_start_day: z
          .number()
          .int()
          .min(0)
          .max(6)
          .optional()
          .describe("Payment start day (0: Sunday, 1: Monday, ... 6: Saturday)"),
        payment_end_day: z
          .number()
          .int()
          .min(0)
          .max(6)
          .optional()
          .describe("Payment end day (0: Sunday, 1: Monday, ... 6: Saturday)"),
        payment_start_date: z
          .number()
          .int()
          .min(1)
          .max(31)
          .optional()
          .describe("Payment start date (1-31)"),
        payment_end_date: z
          .number()
          .int()
          .min(1)
          .max(31)
          .optional()
          .describe("Payment end date (1-31)"),
        commission: z
          .string()
          .optional()
          .default("10")
          .describe("Commission rate for commission payment type (P)"),
        phone: z.string().max(20).optional().describe("Office phone number"),
        fax: z.string().max(20).optional().describe("Office fax number"),
        country_code: z.string().optional().describe("Country code of business address"),
        zipcode: z.string().max(10).optional().describe("Zipcode"),
        address1: z.string().max(255).optional().describe("Address 1"),
        address2: z.string().max(255).optional().describe("Address 2"),
        market_country_code: z.string().optional().describe("Country code of market address"),
        market_zipcode: z.string().max(10).optional().describe("Market address zip code"),
        market_address1: z.string().optional().describe("Market address 1"),
        market_address2: z.string().optional().describe("Market address 2"),
        exchange_country_code: z.string().optional().describe("Country code of return address"),
        exchange_zipcode: z.string().max(10).optional().describe("Return address zip code"),
        exchange_address1: z.string().max(255).optional().describe("Return address 1"),
        exchange_address2: z.string().max(255).optional().describe("Return address 2"),
        homepage_url: z.string().max(100).optional().describe("Home page address"),
        mall_url: z.string().max(100).optional().describe("Shopping mall address"),
        account_start_date: z
          .string()
          .max(10)
          .optional()
          .describe("Transaction start date (YYYY-MM-DD)"),
        account_stop_date: z
          .string()
          .max(10)
          .optional()
          .describe("Transaction stop date (YYYY-MM-DD)"),
        memo: z.string().max(255).optional().describe("Memo"),
        company_registration_no: z
          .string()
          .max(12)
          .optional()
          .describe("Company registration number"),
        company_name: z.string().max(30).optional().describe("Company name"),
        president_name: z.string().max(20).optional().describe("CEO name"),
        company_condition: z.string().max(20).optional().describe("Business type"),
        company_line: z.string().max(20).optional().describe("Business category"),
        company_introduction: z.string().optional().describe("About us"),
      })
      .strict(),
  })
  .strict();

export const UpdateSupplierSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    supplier_code: z.string().length(8).describe("Supplier code"),
    request: z
      .object({
        supplier_name: z.string().max(50).optional().describe("Supplier name"),
        use_supplier: z.enum(["T", "F"]).optional().describe("Whether to use the supplier"),
        trading_type: z.enum(["D", "C"]).optional().describe("Retail: D, Direct shipping: C"),
        supplier_type: z.enum(["WS", "SF", "BS", "ET"]).optional().describe("Supplier type"),
        status: z.enum(["A", "P", "N"]).optional().describe("Approval status"),
        payment_type: z.enum(["P", "D"]).optional().describe("Payment type"),
        payment_period: z.enum(["0", "C", "B", "A"]).optional().describe("Payment frequency term"),
        commission: z.string().optional().describe("Commission rate"),
        manager_information: z
          .array(SupplierManagerSchema)
          .max(3)
          .optional()
          .describe("Information on a specific manager can be edited by using 'no'."),
        business_item: z.string().max(255).optional().describe("Product type for business"),
        payment_method: z
          .union([z.number(), z.string()])
          .optional()
          .describe("Criteria status for payment"),
        payment_start_day: z.number().min(0).max(6).optional().describe("Payment start day"),
        payment_end_day: z.number().min(0).max(6).optional().describe("Payment end day"),
        payment_start_date: z.number().min(1).max(31).optional().describe("Payment start date"),
        payment_end_date: z.number().min(1).max(31).optional().describe("Payment end date"),
        phone: z.string().optional().describe("Office phone number"),
        fax: z.string().optional().describe("Office fax number"),
        country_code: z.string().optional().describe("Country code"),
        zipcode: z.string().optional().describe("Zipcode"),
        address1: z.string().optional().describe("Address 1"),
        address2: z.string().optional().describe("Address 2"),
        market_country_code: z.string().optional().describe("Market country code"),
        market_zipcode: z.string().optional().describe("Market zipcode"),
        market_address1: z.string().optional().describe("Market address 1"),
        market_address2: z.string().optional().describe("Market address 2"),
        exchange_country_code: z.string().optional().describe("Exchange country code"),
        exchange_zipcode: z.string().optional().describe("Exchange zipcode"),
        exchange_address1: z.string().optional().describe("Exchange address 1"),
        exchange_address2: z.string().optional().describe("Exchange address 2"),
        homepage_url: z.string().optional().describe("Homepage URL"),
        mall_url: z.string().optional().describe("Mall URL"),
        account_start_date: z.string().optional().describe("Account start date"),
        account_stop_date: z.string().optional().describe("Account stop date"),
        memo: z.string().optional().describe("Memo"),
        company_registration_no: z.string().optional().describe("Business registration number"),
        company_name: z.string().optional().describe("Company name"),
        president_name: z.string().optional().describe("Representative name"),
        company_condition: z.string().optional().describe("Industry"),
        company_line: z.string().optional().describe("Business line"),
        company_introduction: z.string().optional().describe("Company introduction"),
      })
      .strict(),
  })
  .strict();

export const DeleteSupplierSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    supplier_code: z.string().length(8).describe("Supplier code"),
  })
  .strict();

export type ListSuppliers = z.infer<typeof ListSuppliersSchema>;
export type CountSuppliers = z.infer<typeof CountSuppliersSchema>;
export type GetSupplier = z.infer<typeof GetSupplierSchema>;
export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;
export type UpdateSupplier = z.infer<typeof UpdateSupplierSchema>;
export type DeleteSupplier = z.infer<typeof DeleteSupplierSchema>;
