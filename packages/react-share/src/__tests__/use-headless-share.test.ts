import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useHeadlessShare } from "@/hooks/use-headless-share";
import { facebookStrategy } from "@/strategies/facebook";

// Mocking ahooks
vi.mock("ahooks", () => ({
  useExternal: vi.fn(() => "ready"),
}));

// Mocking strategies
vi.mock("@/strategies/facebook", () => ({
  facebookStrategy: { share: vi.fn() },
}));
vi.mock("@/strategies/kakao", () => ({
  kakaoStrategy: { share: vi.fn() },
}));
vi.mock("@/strategies/link", () => ({
  createLinkStrategy: vi.fn(() => ({ share: vi.fn() })),
}));
vi.mock("@/strategies/native", () => ({
  createNativeStrategy: vi.fn(() => ({ share: vi.fn() })),
}));

describe("useHeadlessShare", () => {
  it("should initialize with ready state correctly for non-SDK platforms", () => {
    const { result } = renderHook(() => useHeadlessShare({ type: "twitter" }));
    expect(result.current.isSdkReady).toBe(true);
  });

  it("should call direct strategies correctly", async () => {
    const { result } = renderHook(() => useHeadlessShare({ type: "facebook" }));
    const shareData = { title: "Test", url: "https://example.com" };

    await act(async () => {
      await result.current.share(shareData);
    });

    expect(facebookStrategy.share).toHaveBeenCalledWith(shareData, undefined);
  });

  it("should handle link copy strategy", async () => {
    const onCopySuccess = vi.fn();
    const { result } = renderHook(() =>
      useHeadlessShare({
        onCopySuccess,
        type: "link",
      }),
    );

    const shareData = { url: "https://example.com" };
    await act(async () => {
      await result.current.share(shareData);
    });

    // Strategy creation itself is mocked, so we just check if it was called
    const { createLinkStrategy } = await import("@/strategies/link");
    expect(createLinkStrategy).toHaveBeenCalledWith(onCopySuccess);
  });

  it("should return error if URL is missing", async () => {
    const onShareError = vi.fn();
    const { result } = renderHook(() =>
      useHeadlessShare({
        onShareError,
        type: "twitter",
      }),
    );

    await act(async () => {
      await result.current.share({ url: "" });
    });

    expect(onShareError).toHaveBeenCalled();
  });
});
