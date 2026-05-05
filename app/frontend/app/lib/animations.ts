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
      gsap.fromTo(items, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger, ease: "power3.out", clearProps: "transform" });
    }, ref);
    return () => ctx.revert();
  }, [stagger]);
  return ref;
}

export function useEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

export function useHeroReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo("[data-hero-title]", { opacity: 0, y: 48, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 });
      tl.fromTo("[data-hero-sub]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.35");
      tl.fromTo("[data-hero-cta]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.2");
      tl.fromTo("[data-hero-icon]", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.4");
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

export function celebrate(el: HTMLElement | null) {
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(el, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
}

export function useHoverLift() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = ref.current.querySelectorAll("[data-card]");
    cards.forEach((c) => {
      const el = c as HTMLElement;
      el.addEventListener("mouseenter", () => gsap.to(el, { y: -3, scale: 1.01, duration: 0.2, ease: "power2.out" }));
      el.addEventListener("mouseleave", () => gsap.to(el, { y: 0, scale: 1, duration: 0.2, ease: "power2.out" }));
    });
  }, []);
  return ref;
}
