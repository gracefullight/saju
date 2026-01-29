import type { ShareStrategy } from "@/types";

import { openShareWindow } from "@/utils/window";

export const pinterestStrategy: ShareStrategy = {
  share: (data) => {
    const { url, title, imageUrl } = data;
    const pinterestUrl = new URL("https://pinterest.com/pin/create/button/");
    pinterestUrl.searchParams.set("url", url);
    if (imageUrl) {
      pinterestUrl.searchParams.set("media", imageUrl);
    }
    if (title) {
      pinterestUrl.searchParams.set("description", title);
    }
    openShareWindow(pinterestUrl.toString());
  },
};
