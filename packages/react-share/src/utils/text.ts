export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

export function formatShareText(
  title: string | undefined,
  description: string | undefined | null,
  url: string,
  options?: {
    descriptionMaxLength?: number;
    separator?: string;
  },
): string {
  const { descriptionMaxLength = 100, separator = "\n" } = options ?? {};

  const truncatedDescription = description
    ? truncateText(description, descriptionMaxLength)
    : undefined;

  if (truncatedDescription && title) {
    return `${title}${separator}${truncatedDescription}${separator}${url}`;
  }

  return `${title || ""}${separator}${url}`.trim();
}

export function formatTweetText(
  title: string | undefined,
  description: string | undefined | null,
  options?: {
    descriptionMaxLength?: number;
  },
): string {
  const { descriptionMaxLength = 60 } = options ?? {};

  const truncatedDescription = description
    ? truncateText(description, descriptionMaxLength)
    : undefined;

  if (truncatedDescription && title) {
    return `${title} - ${truncatedDescription}`;
  }

  return title || "";
}
