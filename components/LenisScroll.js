'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

function LenisScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Scroll to top immediately on any route or search param change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose lenis instance globally for smooth scrollTo operations
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return null;
}

export default function LenisScroll() {
  return (
    <Suspense fallback={null}>
      <LenisScrollHandler />
    </Suspense>
  );
}
