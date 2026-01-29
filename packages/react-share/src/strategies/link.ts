import type { HeadlessShareListeners, ShareStrategy } from "@/types";

import { copyToClipboard } from "@/utils/clipboard";

export const createLinkStrategy = (
  onCopySuccess?: HeadlessShareListeners["onCopySuccess"],
): ShareStrategy => ({
  share: async (data) => {
    const { url } = data;
    await copyToClipboard(url);
    onCopySuccess?.();
  },
});
