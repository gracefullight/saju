import type { ShareStrategy } from "@/types";

import { formatShareText } from "@/utils/text";
import { openShareWindow } from "@/utils/window";

export const lineStrategy: ShareStrategy = {
  share: (data, options) => {
    const { url, title, description } = data;
    const maxLength = options?.textMaxLength ?? 100;

    const shareText = formatShareText(title, description, url, {
      descriptionMaxLength: maxLength,
    });

    const shareUrl = `https://line.me/R/share?text=${encodeURIComponent(shareText)}`;
    openShareWindow(shareUrl);
  },
};
