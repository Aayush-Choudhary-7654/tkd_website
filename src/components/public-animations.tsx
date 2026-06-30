"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getHashTarget(hash: string) {
  if (!hash) return null;
  return document.getElementById(decodeURIComponent(hash.replace("#", "")));
}

export function PublicAnimations({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const root = container;
    const reducedMotion = prefersReducedMotion();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let animationContext: gsap.Context | undefined;
    let killed = false;
    const cleanupFns: Array<() => void> = [];
    let rafId = 0;

    if (!reducedMotion && finePointer) {
      const lenis = new Lenis({
        duration: 1.08,
        easing: (value) => 1 - Math.pow(1 - value, 4),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.05
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    }

    async function setup() {
      if (killed) return;

      if (reducedMotion) {
        gsap.set(root.querySelectorAll("[data-animate]"), {
          autoAlpha: 1,
          clearProps: "transform"
        });
      } else {
        animationContext = gsap.context(() => {
          const heroItems = gsap.utils.toArray<HTMLElement>(
            ".hero .eyebrow, .hero h1, .hero p, .hero .hero-actions, .page-hero .eyebrow, .page-hero h1, .page-hero p"
          );

          gsap.from(heroItems, {
            y: 34,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.08
          });

          const revealItems = gsap.utils.toArray<HTMLElement>(
            ".stat, .section-heading, .feature-card, .program-card, .achievement-card, .gallery-tile, .schedule-row, .form-panel, .page-card, .contact-item, .map-frame"
          );

          for (const item of revealItems) {
            gsap.from(item, {
              autoAlpha: 0,
              y: 36,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 86%",
                once: true
              }
            });
          }

          const mediaItems = gsap.utils.toArray<HTMLElement>(
            ".program-card .media, .achievement-card .media, .gallery-tile img, .gallery-tile video"
          );

          for (const media of mediaItems) {
            gsap.from(media, {
              autoAlpha: 0,
              scale: 1.12,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: media,
                start: "top 88%",
                once: true
              }
            });
          }

          if (finePointer) {
            const premiumCards = gsap.utils.toArray<HTMLElement>(
              ".program-card, .achievement-card, .gallery-tile"
            );

            for (const card of premiumCards) {
              const media = card.querySelector<HTMLElement>(".media, img, video");

              const rotateX = gsap.quickTo(card, "rotationX", {
                duration: 0.35,
                ease: "power3.out"
              });
              const rotateY = gsap.quickTo(card, "rotationY", {
                duration: 0.35,
                ease: "power3.out"
              });
              const cardY = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
              const mediaX = media
                ? gsap.quickTo(media, "x", { duration: 0.45, ease: "power3.out" })
                : null;
              const mediaY = media
                ? gsap.quickTo(media, "y", { duration: 0.45, ease: "power3.out" })
                : null;

              function onMove(event: MouseEvent) {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                rotateX(y * -7);
                rotateY(x * 7);
                cardY(-6);
                mediaX?.(x * -10);
                mediaY?.(y * -10);
              }

              function onLeave() {
                rotateX(0);
                rotateY(0);
                cardY(0);
                mediaX?.(0);
                mediaY?.(0);
              }

              card.addEventListener("mousemove", onMove);
              card.addEventListener("mouseleave", onLeave);
              cleanupFns.push(() => {
                card.removeEventListener("mousemove", onMove);
                card.removeEventListener("mouseleave", onLeave);
              });
            }
          }
        }, root);
      }

      ScrollTrigger.refresh();

      const updateTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 350);

      const hashTimer = window.setTimeout(() => {
        const target = getHashTarget(window.location.hash);
        if (!target) return;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: -82, duration: 1.08 });
        } else {
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        }
      }, 450);

      return () => {
        window.clearTimeout(updateTimer);
        window.clearTimeout(hashTimer);
      };
    }

    let cleanupTimers: (() => void) | undefined;
    void setup().then((cleanup) => {
      cleanupTimers = cleanup;
    });

    function onAnchorClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href*='#']");
      if (!link) return;

      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const element = getHashTarget(url.hash);
      if (!element) return;

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: -82, duration: 1.08 });
      } else {
        element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    }

    document.addEventListener("click", onAnchorClick);

    return () => {
      killed = true;
      document.removeEventListener("click", onAnchorClick);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      cleanupFns.forEach((cleanup) => cleanup());
      cleanupTimers?.();
      animationContext?.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearScrollMemory();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  return (
    <div className="public-scroll" ref={containerRef}>
      {children}
    </div>
  );
}
