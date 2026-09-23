"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroSlides } from "@/lib/data/media"
import { cn } from "@/lib/utils"

const AUTOPLAY_MS = 6500

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (reducedMotion || paused) return
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length)
    }, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [reducedMotion, paused])

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length)
  }, [])

  const activeSlide = reducedMotion ? heroSlides[0] : heroSlides[index]

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured product and manufacturing highlights"
      className="relative isolate overflow-hidden bg-brand-blue-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="relative h-[560px] w-full sm:h-[600px] lg:h-[680px]">
        {heroSlides.map((slide, slideIndex) => {
          const isActive = slide.id === activeSlide.id
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-[650ms] ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt=""
                fill
                priority={slideIndex === 0}
                style={{ objectPosition: slide.focalPosition }}
                className={cn(
                  "object-cover transition-transform duration-[650ms] ease-out",
                  isActive && !reducedMotion ? "scale-100" : "scale-[1.015]",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-deep/85 via-brand-blue-deep/45 to-transparent" />
            </div>
          )
        })}

        <div className="relative z-10 flex h-full max-w-7xl flex-col justify-center px-4 sm:mx-auto sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">{activeSlide.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {activeSlide.heading}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{activeSlide.subheading}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-brand-blue-deep hover:bg-white/90">
                <Link href="/products">Explore Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        {!reducedMotion && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/25 sm:flex"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {heroSlides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(slideIndex)}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-current={slide.id === activeSlide.id}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    slide.id === activeSlide.id ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
