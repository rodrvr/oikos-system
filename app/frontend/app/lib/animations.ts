"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useReveal(stagger = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = ref.current.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(items, {
        opacity: 0,
        y: 32,
        scale: 0.97,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, ref);
    return () => ctx.revert();
  }, [stagger]);
  return ref;
}

export function useHeroReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo("[data-hero-title]", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 });
      tl.fromTo("[data-hero-sub]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");
      tl.fromTo("[data-hero-cta]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
      tl.fromTo("[data-hero-visual]", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, "-=0.5");
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

export function celebrate(el: HTMLElement | null) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.timeline()
    .fromTo(el, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" })
    .fromTo(el.querySelectorAll("span"), { opacity: 0, x: 4 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.04 }, "-=0.2");
}

export function useCardHover() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = ref.current.querySelectorAll("[data-card]");
    cards.forEach((card) => {
      const el = card as HTMLElement;
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { y: -4, scale: 1.01, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);
  return ref;
}
