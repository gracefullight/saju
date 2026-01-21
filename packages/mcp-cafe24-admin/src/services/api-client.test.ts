import type { AxiosError } from "axios";

import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

vi.mock("axios");

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CAFE24_MALL_ID = "test_mall_id";
    process.env.CAFE24_ACCESS_TOKEN = "test_access_token";
  });

  describe("makeApiRequest", () => {
    it("should make a GET request successfully", async () => {
      const mockResponse = {
        data: {
          resource: { test: "data" },
        },
      };
      vi.mocked(axios).mockResolvedValue(mockResponse);

      const result = await makeApiRequest<{ test: string }>("/test");

      expect(axios).toHaveBeenCalledWith({
        method: "GET",
        url: "https://test_mall_id.cafe24api.com/api/v2/test",
        data: undefined,
        params: undefined,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer test_access_token",
        },
      });
      expect(result).toEqual({ resource: { test: "data" } });
    });

    it("should make a POST request with data", async () => {
      const mockResponse = {
        data: {
          resource: { created: true },
        },
      };
      vi.mocked(axios).mockResolvedValue(mockResponse);

      const result = await makeApiRequest<{ created: boolean }>("/test", "POST", { name: "test" });

      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "https://test_mall_id.cafe24api.com/api/v2/test",
        data: { name: "test" },
        params: undefined,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer test_access_token",
        },
      });
      expect(result).toEqual({ resource: { created: true } });
    });

    it("should include query parameters", async () => {
      const mockResponse = {
        data: {
          resource: { items: [] },
        },
      };
      vi.mocked(axios).mockResolvedValue(mockResponse);

      await makeApiRequest<{ items: any[] }>("/test", "GET", undefined, { limit: 10, offset: 0 });

      expect(axios).toHaveBeenCalledWith({
        method: "GET",
        url: "https://test_mall_id.cafe24api.com/api/v2/test",
        data: undefined,
        params: { limit: 10, offset: 0 },
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer test_access_token",
        },
      });
    });

    it("should throw error when CAFE24_MALL_ID is not set", async () => {
      delete process.env.CAFE24_MALL_ID;

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "CAFE24_MALL_ID environment variable is required",
      );
    });

    it("should throw error when CAFE24_ACCESS_TOKEN is not set", async () => {
      delete process.env.CAFE24_ACCESS_TOKEN;
      delete process.env.CAFE24_CLIENT_ID;
      delete process.env.CAFE24_CLIENT_SECRET;
      vi.mocked(axios).mockResolvedValue({ data: { resource: {} } });

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "CAFE24_ACCESS_TOKEN environment variable is required",
      );
    });

    it("should throw error when API response contains error", async () => {
      const mockResponse = {
        data: {
          error: {
            code: "E001",
            message: "Invalid request",
          },
        },
      };
      vi.mocked(axios).mockResolvedValue(mockResponse);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Cafe24 API Error: Invalid request (E001)",
      );
    });

    it("should handle 401 Unauthorized error", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Unauthorized: Invalid or expired access token",
      );
    });

    it("should handle 403 Forbidden error", async () => {
      const mockError = {
        response: {
          status: 403,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Forbidden: Access denied or insufficient permissions",
      );
    });

    it("should handle 404 Not Found error", async () => {
      const mockError = {
        response: {
          status: 404,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow("Not Found: Resource not found");
    });

    it("should handle 422 Unprocessable Entity error", async () => {
      const mockError = {
        response: {
          status: 422,
          data: {
            error: {
              message: "Validation failed",
            },
          },
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Unprocessable Entity: Validation failed",
      );
    });

    it("should handle 429 Rate Limit error", async () => {
      const mockError = {
        response: {
          status: 429,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Too Many Requests: Rate limit exceeded. Please wait before making more requests.",
      );
    });

    it("should handle 500 Internal Server Error", async () => {
      const mockError = {
        response: {
          status: 500,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Internal Server Error: Temporary error occurred. Please try again later.",
      );
    });

    it("should handle timeout error", async () => {
      const mockError = {
        code: "ECONNABORTED",
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow("Request timed out. Please try again.");
    });

    it("should handle 400 Bad Request error with custom message", async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              message: "Bad parameters",
            },
          },
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow("Bad Request: Bad parameters");
    });

    it("should handle 409 Conflict error", async () => {
      const mockError = {
        response: {
          status: 409,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow("Conflict: Resource already exists");
    });

    it("should handle 503 Service Unavailable error", async () => {
      const mockError = {
        response: {
          status: 503,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Service Unavailable: Server is temporarily unavailable",
      );
    });

    it("should handle 504 Gateway Timeout error", async () => {
      const mockError = {
        response: {
          status: 504,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Gateway Timeout: Request timed out. Please try again.",
      );
    });

    it("should handle unknown HTTP status codes", async () => {
      const mockError = {
        response: {
          status: 418,
          data: {},
        },
      };
      vi.mocked(axios).mockRejectedValue(mockError);
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(makeApiRequest("/test")).rejects.toThrow("API Request failed with status 418");
    });

    it("should handle 403 Forbidden error", async () => {
      const mockError = {
        response: {
          status: 403,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Forbidden: Access denied or insufficient permissions",
      );
    });

    it("should handle 404 Not Found error", async () => {
      const mockError = {
        response: {
          status: 404,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow("Not Found: Resource not found");
    });

    it("should handle 422 Unprocessable Entity error", async () => {
      const mockError = {
        response: {
          status: 422,
          data: {
            error: {
              message: "Validation failed",
            },
          },
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Unprocessable Entity: Validation failed",
      );
    });

    it("should handle 429 Rate Limit error", async () => {
      const mockError = {
        response: {
          status: 429,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Too Many Requests: Rate limit exceeded. Please wait before making more requests.",
      );
    });

    it("should handle 500 Internal Server Error", async () => {
      const mockError = {
        response: {
          status: 500,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Internal Server Error: Temporary error occurred. Please try again later.",
      );
    });

    it("should handle timeout error", async () => {
      const mockError = {
        code: "ECONNABORTED",
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow("Request timed out. Please try again.");
    });

    it("should handle 400 Bad Request error with custom message", async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              message: "Bad parameters",
            },
          },
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow("Bad Request: Bad parameters");
    });

    it("should handle 409 Conflict error", async () => {
      const mockError = {
        response: {
          status: 409,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow("Conflict: Resource already exists");
    });

    it("should handle 503 Service Unavailable error", async () => {
      const mockError = {
        response: {
          status: 503,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Service Unavailable: Server is temporarily unavailable",
      );
    });

    it("should handle 504 Gateway Timeout error", async () => {
      const mockError = {
        response: {
          status: 504,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow(
        "Gateway Timeout: Request timed out. Please try again.",
      );
    });

    it("should handle unknown HTTP status codes", async () => {
      const mockError = {
        response: {
          status: 418,
          data: {},
        },
        isAxiosError: true,
      } as unknown as AxiosError;
      vi.mocked(axios).mockRejectedValue(mockError);

      await expect(makeApiRequest("/test")).rejects.toThrow("API Request failed with status 418");
    });
  });

  describe("handleApiError", () => {
    it("should return error message from Error object", () => {
      const error = new Error("Test error");
      expect(handleApiError(error)).toBe("Test error");
    });

    it("should return string representation of unknown error", () => {
      const error = { custom: "error" };
      expect(handleApiError(error)).toBe("Unexpected error: [object Object]");
    });

    it("should return string error as is", () => {
      const error = "String error";
      expect(handleApiError(error)).toBe("Unexpected error: String error");
    });

    it("should handle null error", () => {
      expect(handleApiError(null)).toBe("Unexpected error: null");
    });

    it("should handle undefined error", () => {
      expect(handleApiError(undefined)).toBe("Unexpected error: undefined");
    });
  });
});
