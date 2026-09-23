"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "li"
}

// MOT-SHBS-04: one-time viewport reveal. No fixed/global timeout marks
// content as visible -- visibility is driven entirely by IntersectionObserver,
// and if that observer is unavailable the content simply renders visible.
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Comp = as as any

  return (
    <Comp
      ref={ref}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={delay ? { transitionDelay: `${Math.min(delay, 210)}ms` } : undefined}
    >
      {children}
    </Comp>
  )
}
