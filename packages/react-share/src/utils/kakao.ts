export function ensureKakaoInitialized(kakaoJsKey?: string): typeof window.Kakao | null {
  if (globalThis.window === undefined) {
    return null;
  }

  if (!globalThis.window.Kakao) {
    return null;
  }

  if (!globalThis.window.Kakao.isInitialized?.()) {
    if (!kakaoJsKey) {
      console.error("Kakao JavaScript key is not configured");
      return null;
    }
    globalThis.window.Kakao?.init?.(kakaoJsKey);
  }

  return globalThis.window.Kakao ?? null;
}
