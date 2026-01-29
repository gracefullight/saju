export interface FacebookOptions {
  appId: string;
}

export interface KakaoOptions {
  jsKey?: string;
  buttonTitle?: string;
  defaultDescription?: string;
}

export interface TwitterOptions {
  hashtags?: string[];
  via?: string;
  related?: string[];
}

export interface PinterestOptions {
  isVideo?: boolean;
}

export interface WhatsAppOptions {
  phone?: string;
}

export interface NativeOptions {
  files?: File[];
}
