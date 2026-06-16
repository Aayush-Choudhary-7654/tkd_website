export function getMapEmbedUrl(address: string, mapUrl: string) {
  if (mapUrl.includes("output=embed") || mapUrl.includes("/embed")) {
    return mapUrl;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
