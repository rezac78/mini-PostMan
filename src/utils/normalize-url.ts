export const normalizeUrl = (url: string) => {
  try {
    const u = new URL(url);

    const cleaned = u.pathname
      .split("/")
      .filter(Boolean)
      .map((p) => (p.match(/^[0-9a-fA-F-]{20,}$/) ? "{id}" : p))
      .join("/");

    return "/" + cleaned;
  } catch {
    const parts = url.split("/").filter(Boolean);
    return (
      "/" +
      parts.map((p) => (p.match(/^[0-9a-fA-F-]{20,}$/) ? "{id}" : p)).join("/")
    );
  }
};
