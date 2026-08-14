"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HomeSlide } from "@/lib/types/domain";

const SLIDE_INTERVAL_MS = 4000;

/** Shows the current slide full screen and moves to the next one on a timer. */
export function HomeSlideshow({ slides }: { slides: HomeSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides < 2) return;

    const timer = setInterval(() => {
      // "%" sends the index back to 0 after the last slide.
      setCurrentIndex((previousIndex) => (previousIndex + 1) % totalSlides);
    }, SLIDE_INTERVAL_MS);

    // Without this, the timer keeps running after the component is removed.
    return () => clearInterval(timer);
  }, [totalSlides]);

  // No slides yet: show the studio name instead of a blank page (spec §9.2).
  if (totalSlides === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-900 text-neutral-300">
        <p className="text-sm tracking-[0.3em] uppercase">180 Studio</p>
      </div>
    );
  }

  return (
    <section className="relative h-full bg-neutral-900">
      {/* All slides are stacked on top of each other. Only the current one is visible. */}
      {slides.map((slide, index) => {
        const isCurrentSlide = index === currentIndex;
        const isFirstSlide = index === 0;

        return (
          <Image
            key={slide.id}
            src={slide.image.url}
            alt={slide.image.alt ?? ""}
            fill
            sizes="100vw"
            // The first image is the first thing visitors see, so load it early.
            priority={isFirstSlide}
            className={`object-cover transition-opacity duration-2000 ${isCurrentSlide ? "opacity-100" : "opacity-0"
              }`}
          />
        );
      })}
    </section>
  );
}
