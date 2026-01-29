import type { ShareStrategy } from "@/types";

import { ensureFacebookInitialized } from "@/utils/facebook";

export const facebookStrategy: ShareStrategy = {
  share: (data, options) => {
    return new Promise((resolve, reject) => {
      const fb = ensureFacebookInitialized(options?.facebook?.appId);
      if (!fb) {
        reject(new Error("Facebook SDK not initialized"));
        return;
      }

      fb.ui(
        {
          href: data.url,
          method: "share",
        },
        (response: unknown) => {
          if (response && typeof response === "object" && "error_code" in response) {
            reject(new Error(`Facebook share error: ${JSON.stringify(response)}`));
          } else {
            resolve();
          }
        },
      );
    });
  },
};
