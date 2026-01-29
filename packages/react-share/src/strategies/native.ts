import type { HeadlessShareListeners, HeadlessShareOptions, ShareStrategy } from "@/types";

import { copyToClipboard } from "@/utils/clipboard";

export const createNativeStrategy = (
  onCopySuccess?: HeadlessShareListeners["onCopySuccess"],
): ShareStrategy => ({
  share: async (data, options) => {
    const { url } = data;
    const files = (options as HeadlessShareOptions | undefined)?.native?.files;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        const shareData: ShareData = {
          text: data.description || undefined,
          title: data.title,
          url: url,
        };

        if (files && files.length > 0) {
          if (navigator.canShare && navigator.canShare({ files })) {
            Object.assign(shareData, { files });
          }
        }

        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Navigator share failed", err);
        }
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }
    await copyToClipboard(url);
    onCopySuccess?.();
  },
});

interface ShareData {
  text?: string;
  title?: string;
  url: string;
  files?: File[];
}
