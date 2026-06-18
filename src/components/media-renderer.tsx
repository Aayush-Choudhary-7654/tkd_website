import { isVideoSource } from "@/lib/media";

export function MediaRenderer({
  src,
  alt = "",
  className
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  if (isVideoSource(src)) {
    return (
      <video
        className={className}
        src={src}
        controls
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return <img className={className} src={src} alt={alt} />;
}
