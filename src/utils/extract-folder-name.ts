export function extractFolderName(url: string): string {
  try {
    const cleanUrl = url
      .replace(/^https?:\/\/[^/]+/, "")
      .split("?")[0]
      .replace(/\/+$/, "");

    const parts = cleanUrl.split("/").filter(Boolean);
    if (parts[0] === "api") parts.shift();

    return parts[0] || "other";
  } catch {
    return "other";
  }
}
