export function isVideoSource(value: string) {
  const lower = value.toLowerCase();
  return (
    lower.includes("kind=video") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm")
  );
}
