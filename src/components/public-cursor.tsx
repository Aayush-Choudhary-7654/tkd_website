"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "video",
  ".gallery-tile",
  ".program-card",
  ".achievement-card",
  ".contact-item"
].join(",");

function shouldUseCustomCursor() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PublicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || !shouldUseCustomCursor()) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    function onPointerMove(event: PointerEvent) {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      gsap.to([dot, ring], {
        autoAlpha: 1,
        duration: 0.18,
        overwrite: "auto"
      });
    }

    function onPointerOver(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const isInteractive = Boolean(target.closest(interactiveSelector));
      gsap.to(ring, {
        scale: isInteractive ? 1.85 : 1,
        borderColor: isInteractive ? "rgba(245, 185, 66, 0.78)" : "rgba(255, 45, 45, 0.7)",
        duration: 0.18,
        overwrite: "auto"
      });
      gsap.to(dot, {
        scale: isInteractive ? 0.55 : 1,
        backgroundColor: isInteractive ? "#f5b942" : "#ff2d2d",
        duration: 0.18,
        overwrite: "auto"
      });
    }

    function onPointerLeave() {
      gsap.to([dot, ring], {
        autoAlpha: 0,
        duration: 0.18,
        overwrite: "auto"
      });
    }

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.classList.remove("has-custom-cursor");
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div className="public-cursor" aria-hidden="true">
      <div className="public-cursor-ring" ref={ringRef} />
      <div className="public-cursor-dot" ref={dotRef} />
    </div>
  );
}
