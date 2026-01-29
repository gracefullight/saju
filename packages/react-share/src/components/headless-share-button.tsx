import type { ReactElement, SyntheticEvent } from "react";
import { cloneElement, isValidElement, useState } from "react";
import { useHeadlessShare } from "@/hooks/use-headless-share";
import type { HeadlessShareButtonProps } from "@/types/components";

export function HeadlessShareButton({
  data,
  type,
  options,
  listeners,
  state,
  children,
}: HeadlessShareButtonProps) {
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);

  const { share, isSdkReady } = useHeadlessShare({
    onCopySuccess: listeners?.onCopySuccess,
    onShareError: listeners?.onShareError,
    options,
    type,
  });

  const isLoading = state?.isLoading || isResolvingUrl || !isSdkReady;

  const handleShareClick = async () => {
    if (isLoading) {
      return;
    }

    setIsResolvingUrl(true);
    try {
      let resolvedUrl: string | null | undefined;
      const urlOrResolver = data.url;
      if (typeof urlOrResolver === "function") {
        resolvedUrl = await urlOrResolver();
      } else {
        resolvedUrl = urlOrResolver;
      }

      if (!resolvedUrl) {
        listeners?.onShareError?.(new Error("Failed to resolve share URL"));
        return;
      }

      await share({
        description: data.description,
        imageUrl: data.imageUrl,
        title: data.title,
        url: resolvedUrl,
      });
    } catch (e) {
      listeners?.onShareError?.(e);
    } finally {
      setIsResolvingUrl(false);
    }
  };

  if (typeof children === "function") {
    return <>{children({ isLoading, onClick: handleShareClick })}</>;
  }

  if (isValidElement(children)) {
    const child = children as ReactElement<{
      disabled?: boolean;
      onClick?: (e: SyntheticEvent) => void;
    }>;

    return cloneElement(child, {
      disabled: child.props.disabled || isLoading,
      onClick: (e: SyntheticEvent) => {
        child.props.onClick?.(e);
        void handleShareClick();
      },
    });
  }

  return <>{children}</>;
}
