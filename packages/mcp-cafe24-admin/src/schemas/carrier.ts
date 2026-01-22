import { z } from "zod";

const CarrierCategorySchema = z.object({
  category_no: z.number(),
});

const DomesticShippingFeeSchema = z.object({
  country_code: z.string().optional(),
  conditional: z.string(),
  min_value: z.string(),
  max_value: z.string(),
  shipping_fee: z.string(),
});

const ShippingFeeSettingDomesticSchema = z.object({
  shipping_fee_type: z.enum(["T", "R", "M", "D", "W", "C", "N"]),
  shipping_fee: z.string().nullable().optional(),
  min_price: z.string().nullable().optional(),
  use_product_category: z.enum(["O", "F"]),
  product_category_list: z.array(CarrierCategorySchema).optional(),
  shipping_fee_criteria: z.enum(["D", "A"]),
  domestic_shipping_fee_list: z.array(DomesticShippingFeeSchema).optional(),
  available_shipping_zone: z.string().nullable().optional(),
  available_shipping_zone_list: z.array(z.string()).nullable().optional(),
  available_order_time: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
});

const OverseaShippingCountrySchema = z.object({
  country_code: z.string(),
});

const OverseaShippingFeeSchema = z.object({
  country_code: z.string(),
  conditional: z.string(),
  min_value: z.string(),
  max_value: z.string(),
  shipping_fee: z.string(),
});

const AdditionalHandlingFeeSchema = z.object({
  country_code: z.string(),
  text: z.string().optional(),
  min_value: z.string(),
  max_value: z.string(),
  additional_handling_fee: z.string(),
  unit: z.enum(["W", "P"]),
  rounding_unit: z.enum(["F", "0", "1", "2", "3"]).nullable().optional(),
  rounding_rule: z.enum(["L", "U", "C"]).nullable().optional(),
});

const ShippingFeeSettingOverseaSchema = z.object({
  shipping_fee_criteria: z.string().nullable().optional(),
  shipping_country_list: z.array(OverseaShippingCountrySchema).optional(),
  country_shipping_fee_list: z.array(OverseaShippingFeeSchema).optional(),
  additional_handling_fee: z.enum(["T", "F"]),
  additional_handling_fee_list: z.array(AdditionalHandlingFeeSchema).optional(),
  maximum_quantity: z.number().nullable().optional(),
  product_category_limit: z.enum(["T", "F"]).nullable().optional(),
  product_category_limit_list: z.array(CarrierCategorySchema).nullable().optional(),
});

const ShippingFeeSettingDetailSchema = z.object({
  shipping_type: z.enum(["A", "B", "C", "F"]),
  available_shipping_zone: z.string().optional(),
  min_shipping_period: z.number().optional(),
  max_shipping_period: z.number().optional(),
  shipping_information: z.string().optional(),
  shipping_fee_setting_domestic: ShippingFeeSettingDomesticSchema.optional(),
  shipping_fee_setting_oversea: ShippingFeeSettingOverseaSchema.optional(),
});

export const ListCarriersParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
  })
  .strict();

export const GetCarrierParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    carrier_id: z.number().describe("Shipping company ID"),
  })
  .strict();

export const CreateCarrierParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    shipping_carrier_code: z.string().describe("Shipping carrier code"),
    contact: z.string().max(16).describe("Primary contact"),
    email: z.string().email().max(255).describe("Email"),
    shipping_carrier: z.string().max(80).optional().describe("Shipping carrier name"),
    track_shipment_url: z.string().max(255).optional().describe("URL for tracking shipment"),
    secondary_contact: z.string().max(16).optional().describe("Secondary contact"),
    default_shipping_fee: z.string().optional().describe("Default shipping fee"),
    homepage_url: z.string().max(255).optional().describe("Home page address"),
    shipping_fee_setting: z.enum(["T", "F"]).default("F").describe("Default shipping fee settings"),
    shipping_fee_setting_detail: ShippingFeeSettingDetailSchema.optional().describe(
      "Default shipping fee data",
    ),
  })
  .strict();

export const UpdateCarrierParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    carrier_id: z.number().describe("Shipping company ID"),
    default_shipping_carrier: z
      .enum(["T", "F"])
      .default("T")
      .describe("Default shipping carrier settings"),
  })
  .strict();

export const DeleteCarrierParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    carrier_id: z.number().describe("Shipping company ID"),
    delete_default_carrier: z.enum(["T", "F"]).default("F").describe("Delete default carrier"),
  })
  .strict();
