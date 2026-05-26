"use client";

import { ReactNode, useEffect } from "react";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    let lenis: any;
    
    // Safely load lenis strictly on the client side
    import("lenis").then((module) => {
      const Lenis = module.default || module;
      lenis = new (Lenis as any)({
        lerp: 0.08, // Apple-like smooth scroll
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }).catch(e => console.error("Lenis failed to load", e));

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
