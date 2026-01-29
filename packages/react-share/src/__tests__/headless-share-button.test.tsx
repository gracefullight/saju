import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { HeadlessShareButton } from "@/components/headless-share-button";

// Mock the hook
vi.mock("@/hooks/use-headless-share", () => ({
  useHeadlessShare: vi.fn(() => ({
    isSdkReady: true,
    share: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe("HeadlessShareButton", () => {
  const defaultData = {
    title: "Test Recipe",
    url: "https://example.com/recipe/1",
  };

  it("should render and handle click with function children", async () => {
    const { useHeadlessShare } = await import("@/hooks/use-headless-share");
    const mockShare = vi.fn();
    (useHeadlessShare as unknown as Mock).mockReturnValue({
      isSdkReady: true,
      share: mockShare,
    });

    render(
      <HeadlessShareButton data={defaultData} type="twitter">
        {({ onClick, isLoading }) => (
          <button disabled={isLoading} onClick={onClick} type="button">
            Share Now
          </button>
        )}
      </HeadlessShareButton>,
    );

    const button = screen.getByText("Share Now");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });
  });

  it("should work without id field (removed requirement)", async () => {
    const { useHeadlessShare } = await import("@/hooks/use-headless-share");
    const mockShare = vi.fn();
    (useHeadlessShare as unknown as Mock).mockReturnValue({
      isSdkReady: true,
      share: mockShare,
    });

    const dataWithoutId = {
      title: "Test",
      url: "https://example.com",
    };

    render(
      <HeadlessShareButton data={dataWithoutId} type="twitter">
        <button type="button">Share</button>
      </HeadlessShareButton>,
    );

    fireEvent.click(screen.getByText("Share"));

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });
  });

  it("should resolve dynamic URL function before sharing", async () => {
    const { useHeadlessShare } = await import("@/hooks/use-headless-share");
    const mockShare = vi.fn();
    (useHeadlessShare as unknown as Mock).mockReturnValue({
      isSdkReady: true,
      share: mockShare,
    });

    const dynamicUrl = vi.fn().mockResolvedValue("https://dynamic.url");
    const data = { ...defaultData, url: dynamicUrl };

    render(
      <HeadlessShareButton data={data} type="twitter">
        <button type="button">Share</button>
      </HeadlessShareButton>,
    );

    fireEvent.click(screen.getByText("Share"));

    await waitFor(() => {
      expect(dynamicUrl).toHaveBeenCalled();
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://dynamic.url",
        }),
      );
    });
  });

  it("should handle share error if URL resolution fails", async () => {
    const onShareError = vi.fn();
    const data = { ...defaultData, url: () => Promise.resolve(null) };

    render(
      <HeadlessShareButton data={data} listeners={{ onShareError }} type="twitter">
        <button type="button">Share</button>
      </HeadlessShareButton>,
    );

    fireEvent.click(screen.getByText("Share"));

    await waitFor(() => {
      expect(onShareError).toHaveBeenCalled();
    });
  });
});
