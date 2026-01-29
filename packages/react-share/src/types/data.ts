export interface ShareData {
  url: string;
  title?: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface HeadlessShareData {
  title: string | undefined;
  description?: string | null;
  imageUrl?: string | null;
  url: string | (() => string | Promise<string | null | undefined>);
}
