import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CountSuppliers,
  CountSuppliersSchema,
  type CreateSupplier,
  CreateSupplierSchema,
  type DeleteSupplier,
  DeleteSupplierSchema,
  type GetSupplier,
  GetSupplierSchema,
  type ListSuppliers,
  ListSuppliersSchema,
  type UpdateSupplier,
  UpdateSupplierSchema,
} from "@/schemas/supplier.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CountSuppliersResponse,
  ListSuppliersResponse,
  SupplierResponse,
} from "@/types/index.js";

async function cafe24_list_suppliers(params: ListSuppliers) {
  try {
    const data = await makeApiRequest<ListSuppliersResponse>(
      "/admin/suppliers",
      "GET",
      undefined,
      params,
    );
    const suppliers = data.suppliers || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${suppliers.length} suppliers\n\n` +
            suppliers
              .map(
                (s) =>
                  `## ${s.supplier_name} (${s.supplier_code})\n` +
                  `- Status: ${s.status}\n` +
                  `- Type: ${s.supplier_type}\n` +
                  `- Trading: ${s.trading_type}\n` +
                  `- Phone: ${s.phone || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_suppliers(params: CountSuppliers) {
  try {
    const data = await makeApiRequest<CountSuppliersResponse>(
      "/admin/suppliers/count",
      "GET",
      undefined,
      params,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Total suppliers: ${data.count}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_supplier(params: GetSupplier) {
  try {
    const { shop_no, supplier_code } = params;
    const data = await makeApiRequest<SupplierResponse>(
      `/admin/suppliers/${supplier_code}`,
      "GET",
      undefined,
      { shop_no },
    );
    const s = data.supplier;
    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Supplier: ${s.supplier_name} (${s.supplier_code})\n` +
            `- Status: ${s.status}\n` +
            `- Company: ${s.company_name || "N/A"}\n` +
            `- Phone: ${s.phone || "N/A"}\n` +
            `- Address: ${s.address1} ${s.address2 || ""}\n` +
            `- Managers: ${s.manager_information?.map((m) => `${m.name} (${m.phone})`).join(", ") || "None"}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_supplier(params: CreateSupplier) {
  try {
    const data = await makeApiRequest<SupplierResponse>("/admin/suppliers", "POST", params);
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created supplier: ${data.supplier.supplier_name} (${data.supplier.supplier_code})`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_supplier(params: UpdateSupplier) {
  try {
    const { shop_no, supplier_code, request } = params;
    const data = await makeApiRequest<SupplierResponse>(
      `/admin/suppliers/${supplier_code}`,
      "PUT",
      { shop_no, request },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated supplier: ${data.supplier.supplier_name} (${data.supplier.supplier_code})`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_supplier(params: DeleteSupplier) {
  try {
    const { shop_no, supplier_code } = params;
    const data = await makeApiRequest<{ supplier: { supplier_code: string } }>(
      `/admin/suppliers/${supplier_code}`,
      "DELETE",
      undefined,
      { shop_no },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted supplier: ${data.supplier.supplier_code}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_suppliers",
    {
      title: "List Cafe24 Suppliers",
      description: "Retrieve a list of suppliers from Cafe24. Supports filtering and pagination.",
      inputSchema: ListSuppliersSchema,
    },
    cafe24_list_suppliers,
  );

  server.registerTool(
    "cafe24_count_suppliers",
    {
      title: "Count Cafe24 Suppliers",
      description: "Count the number of suppliers matching the search criteria.",
      inputSchema: CountSuppliersSchema,
    },
    cafe24_count_suppliers,
  );

  server.registerTool(
    "cafe24_retrieve_supplier",
    {
      title: "Retrieve Cafe24 Supplier",
      description: "Retrieve details of a specific supplier by supplier code.",
      inputSchema: GetSupplierSchema,
    },
    cafe24_retrieve_supplier,
  );

  server.registerTool(
    "cafe24_create_supplier",
    {
      title: "Create Cafe24 Supplier",
      description: "Create a new supplier.",
      inputSchema: CreateSupplierSchema,
    },
    cafe24_create_supplier,
  );

  server.registerTool(
    "cafe24_update_supplier",
    {
      title: "Update Cafe24 Supplier",
      description: "Update an existing supplier's information.",
      inputSchema: UpdateSupplierSchema,
    },
    cafe24_update_supplier,
  );

  server.registerTool(
    "cafe24_delete_supplier",
    {
      title: "Delete Cafe24 Supplier",
      description: "Delete a supplier by supplier code.",
      inputSchema: DeleteSupplierSchema,
    },
    cafe24_delete_supplier,
  );
}
