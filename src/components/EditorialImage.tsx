import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import fallback from "../assets/image-unavailable.svg";
import { imageMetadata } from "../lib/images";
import { requestMotionRefresh } from "../lib/motion";
import { cn } from "../utils/cn";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

export default function EditorialImage(props: Props) {
  return <ImageWithFallback key={props.src} {...props} />;
}

function ImageWithFallback({ src, alt, className, style, sizes = "100vw", loading = "lazy", onLoad, onError, ...props }: Props) {
  const meta = imageMetadata(src);
  const sources = [...new Set([src, ...(meta?.remoteSrc && meta.remoteSrc !== src ? [meta.remoteSrc] : []), fallback])];
  const [index, setIndex] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  const isFallback = index === sources.length - 1;
  const advance = () => {
    if (index < sources.length - 1) setIndex(index + 1);
    else setUnavailable(true);
  };

  useEffect(() => {
    const el = image.current;
    if (!el || unavailable) return;
    let timeout = 0;
    let observer: IntersectionObserver | undefined;
    const armTimeout = () => {
      observer?.disconnect();
      clearTimeout(timeout);
      if (el.complete && el.naturalWidth > 0) return;
      timeout = window.setTimeout(() => {
        if (!el.complete || !el.naturalWidth) {
          if (isFallback) setUnavailable(true);
          else setIndex(index + 1);
        }
      }, isFallback ? 2000 : 8000);
    };

    // Lazy images do not time out until they are actually near the viewport.
    if (loading !== "lazy" || typeof IntersectionObserver === "undefined") armTimeout();
    else {
      try {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) armTimeout();
        }, { rootMargin: "320px" });
        observer.observe(el);
      } catch { armTimeout(); }
    }
    return () => { clearTimeout(timeout); observer?.disconnect(); };
  }, [index, isFallback, loading, unavailable]);

  if (unavailable) {
    return <span
      role={alt ? "img" : undefined}
      aria-label={alt ? `Imagem indisponível: ${alt}` : undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("image-terminal", className)}
      style={style}
      data-image-status="unavailable"
    ><span aria-hidden="true">MV</span></span>;
  }

  return <img
    {...props}
    ref={image}
    src={sources[index]}
    srcSet={isFallback ? undefined : index === 0 ? (props.srcSet ?? meta?.srcSet) : meta?.remoteSrcSet}
    sizes={isFallback ? undefined : sizes}
    width={props.width ?? meta?.width}
    height={props.height ?? meta?.height}
    alt={isFallback && alt ? `Imagem indisponível. ${alt}` : alt}
    loading={loading}
    decoding="async"
    className={cn("editorial-image", className)}
    style={{ backgroundColor: "#171715", ...style }}
    data-image-status={isFallback ? "fallback" : "original"}
    onError={(event) => { advance(); onError?.(event); }}
    onLoad={(event) => {
      if (!event.currentTarget.naturalWidth) { advance(); return; }
      requestMotionRefresh();
      onLoad?.(event);
    }}
  />;
}