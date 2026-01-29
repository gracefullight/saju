import { useCallback, useEffect, useState } from "react";
import { facebookStrategy } from "@/strategies/facebook";
import { kakaoStrategy } from "@/strategies/kakao";
import { lineStrategy } from "@/strategies/line";
import { createLinkStrategy } from "@/strategies/link";
import { createNativeStrategy } from "@/strategies/native";
import { pinterestStrategy } from "@/strategies/pinterest";
import { threadsStrategy } from "@/strategies/threads";
import { twitterStrategy } from "@/strategies/twitter";
import { whatsappStrategy } from "@/strategies/whatsapp";
import type { HeadlessShareOptions, ShareData, SharePlatform, ShareStrategy } from "@/types";
import { setupFacebookSDK } from "@/utils/facebook";

const KAKAO_SDK_URL = "https://developers.kakao.com/sdk/js/kakao.js";
const FB_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";

const strategyRegistry = new Map<SharePlatform, ShareStrategy>([
  ["facebook", facebookStrategy],
  ["kakao", kakaoStrategy],
  ["line", lineStrategy],
  ["pinterest", pinterestStrategy],
  ["threads", threadsStrategy],
  ["twitter", twitterStrategy],
  ["whatsapp", whatsappStrategy],
]);

function useExternalScript(src: string | undefined) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!src || typeof document === "undefined") {
      setStatus(src ? "error" : "idle");
      return;
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setStatus("ready");
      return;
    }

    setStatus("loading");

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    const handleLoad = () => setStatus("ready");
    const handleError = () => setStatus("error");

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [src]);

  return status;
}

export interface UseHeadlessShareProps {
  type: SharePlatform;
  options?: HeadlessShareOptions;
  onShareError?: (error: unknown) => void;
  onCopySuccess?: () => void;
}

export function useHeadlessShare({
  type,
  options,
  onShareError,
  onCopySuccess,
}: UseHeadlessShareProps) {
  const isKakao = type === "kakao";
  const isFacebook = type === "facebook";

  const sdkUrl = (() => {
    if (isKakao) {
      return KAKAO_SDK_URL;
    }
    if (isFacebook) {
      return FB_SDK_URL;
    }
    return undefined;
  })();

  const scriptStatus = useExternalScript(sdkUrl);
  const isSdkReady = sdkUrl ? scriptStatus === "ready" : true;
  const hasScriptError = scriptStatus === "error";

  useEffect(() => {
    if (isFacebook && scriptStatus === "ready") {
      setupFacebookSDK(options?.facebook?.appId);
    }
  }, [isFacebook, scriptStatus, options?.facebook?.appId]);

  useEffect(() => {
    if (hasScriptError) {
      onShareError?.(new Error(`Failed to load SDK script for ${type}`));
    }
  }, [hasScriptError, type, onShareError]);

  const share = useCallback(
    async (data: ShareData) => {
      const { url } = data;
      if (!url) {
        onShareError?.(new Error("URL is required for sharing"));
        return;
      }

      try {
        if (type === "link") {
          await createLinkStrategy(onCopySuccess).share(data, options);
          return;
        }

        if (type === "native") {
          await createNativeStrategy(onCopySuccess).share(data, options);
          return;
        }

        const strategy = strategyRegistry.get(type);

        if (strategy) {
          await strategy.share(data, options);
        } else {
          console.warn(`No share strategy found for type: ${type}`);
        }
      } catch (e) {
        onShareError?.(e);
      }
    },
    [type, onShareError, onCopySuccess, options],
  );

  return {
    isSdkReady,
    share,
  };
}

export function registerShareStrategy(type: SharePlatform, strategy: ShareStrategy) {
  strategyRegistry.set(type, strategy);
}

export function unregisterShareStrategy(type: SharePlatform) {
  strategyRegistry.delete(type);
}
