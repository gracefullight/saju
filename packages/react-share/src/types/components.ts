import type { ReactNode } from "react";
import type {
  HeadlessShareData,
  HeadlessShareListeners,
  HeadlessShareOptions,
  HeadlessShareState,
  SharePlatform,
} from "@/types";

export interface HeadlessShareButtonProps {
  data: HeadlessShareData;
  type: SharePlatform;
  options?: HeadlessShareOptions;
  listeners?: HeadlessShareListeners;
  state?: HeadlessShareState;
  children:
    | ReactNode
    | ((props: { onClick: () => Promise<void>; isLoading: boolean }) => ReactNode);
}

export interface HeadlessShareButtonRenderProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export type HeadlessShareButtonChildren =
  | ReactNode
  | ((props: HeadlessShareButtonRenderProps) => ReactNode);
