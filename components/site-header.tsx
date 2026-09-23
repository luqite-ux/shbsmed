"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/quality", label: "Quality" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-secondary text-brand-blue-deep"
                    : "text-foreground/80 hover:bg-secondary hover:text-brand-blue-deep",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" className="bg-brand-blue text-primary-foreground hover:bg-brand-blue-deep">
            <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden border-t border-border bg-background transition-[grid-template-rows] duration-200 ease-out lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                    isActive ? "bg-secondary text-brand-blue-deep" : "text-foreground/85 hover:bg-secondary",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Button asChild className="mt-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue-deep">
              <Link href="/contact">Request a Quote</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
