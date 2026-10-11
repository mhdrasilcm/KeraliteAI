"use client";

import { useEffect } from "react";

// Two floating "product UI" cards rendered as liquid-glass panes over the
// hero gradient (DESIGN.md: translucent cards floating over the background,
// 16px radius, no drop shadow — depth comes from refraction, not elevation).
//
// liquid-gl is loaded lazily, only on the landing page, and only on devices
// where it's a safe bet. Everywhere else the cards simply stay as the CSS
// frosted-glass fallback defined in globals.css (.glass-card).
export function HeroGlass() {
  useEffect(() => {
    let cancelled = false;
    let lenses: Array<{ destroy?: () => void }> = [];

    const ua = navigator.userAgent;
    // liquid-gl's own docs warn Safari can be unstable with large panes, and our
    // cards are wide on phones — so iPhone/iPad keep the CSS fallback.
    const isIOS = /iP(hone|ad|od)/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    if (isIOS) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      try {
        await document.fonts?.ready;
        const mod = await import("liquid-gl");
        if (cancelled) return;
        const liquidGL = mod.default;

        const result = liquidGL({
          target: ".glass-card",
          snapshot: "#hero-scene",
          zIndex: 10, // all lenses on a shared canvas must use the same z-index
          resolution: 1.5,
          refraction: 0.02,
          bevelDepth: 0.1,
          bevelWidth: 0.2,
          frost: 3,
          shadow: false, // DESIGN.md: no drop shadows on cards
          specular: !reduceMotion,
          reveal: reduceMotion ? "none" : "fade",
          on: {
            init() {
              // Lens is live: drop the CSS fallback surface so it isn't doubled up.
              document
                .querySelectorAll<HTMLElement>(".glass-card")
                .forEach((el) => el.setAttribute("data-glass", "on"));
            },
          },
        });

        lenses = Array.isArray(result) ? result : [result];
      } catch {
        // Any failure leaves the CSS fallback cards in place.
      }
    })();

    return () => {
      cancelled = true;
      lenses.forEach((l) => {
        try {
          l?.destroy?.();
        } catch {}
      });
    };
  }, []);

  return (
    <div className="mx-auto mt-48 grid max-w-[880px] gap-16 md:grid-cols-[1.35fr_1fr] md:items-start">
      <div className="glass-card">
        <div className="glass-content flex flex-col gap-12 p-16">
          <p className="text-caption text-stone-gray">Class 7 · English medium · Example</p>
          <div className="self-end rounded-cards bg-lilac-mist/80 px-12 py-8 text-body-sm">
            What is photosynthesis?
          </div>
          <div className="rounded-cards bg-paper-white/70 px-12 py-8 text-body-sm leading-[1.5]">
            Photosynthesis is how green plants make their own food, using sunlight, water and
            carbon dioxide.
          </div>
        </div>
      </div>

      <div className="glass-card md:mt-48">
        <div className="glass-content flex flex-col gap-12 p-16">
          <p className="text-label-bold font-w540 leading-[1.2]">Who&apos;s studying today?</p>
          <div className="rounded-cards bg-paper-white/70 px-12 py-8">
            <p className="text-body-sm font-w540">Aisha</p>
            <p className="text-caption text-stone-gray">Class 8 · Malayalam medium</p>
          </div>
          <div className="rounded-cards bg-paper-white/70 px-12 py-8">
            <p className="text-body-sm font-w540">Arjun</p>
            <p className="text-caption text-stone-gray">Class 5 · English medium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
