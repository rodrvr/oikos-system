"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useStaggerEntrance(selector: string, delay = 0.08) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const items = ref.current.querySelectorAll(selector);
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: delay,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [selector, delay]);

  return ref;
}

export function usePageEntrance() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const heading = ref.current.querySelector("h1");
    const subtitle = ref.current.querySelector("[data-subtitle]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heading) {
        tl.fromTo(heading, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5 });
      }

      if (subtitle) {
        tl.fromTo(subtitle, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4 }, "-=0.25");
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function celebrate(el: HTMLElement | null) {
  if (!el) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  gsap.fromTo(
    el,
    { scale: 0.94, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
  );
}

export function shake(el: HTMLElement | null) {
  if (!el) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  gsap.fromTo(el, { x: -6 }, { x: 6, duration: 0.08, repeat: 3, yoyo: true, ease: "power2.inOut", onComplete: () => gsap.set(el, { x: 0 }) });
}
