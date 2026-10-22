"use client"


import {SiteText,useSiteLanguage} from '@/components/site-copy'
import Link from '@/components/localized-link'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Branded Products" },
  { href: "/odm-oem", label: "OEM" },
  { href: "/contract-manufacturing", label: "Component Manufacturing" },
  { href: "/news", label: "Updates" },
  { href: "/contact", label: "Contact Us" },
]

export function SiteHeader() {
  const rawPath = usePathname()
  const {locale,defaultLocale}=useSiteLanguage()
  const pathname = locale!==defaultLocale ? rawPath.replace(new RegExp('^/'+locale+'(?=/|$)'),'')||'/' : rawPath
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
      <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav aria-label="Primary" className="order-3 hidden w-full items-center justify-between border-t pt-2 xl:order-none xl:w-auto xl:gap-1 xl:border-0 xl:pt-0 xl:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              link.href==='/products'?<details className="meeting-product-menu" key={link.href}><summary><SiteText value="Branded Products"/></summary><nav aria-label="Branded product series">{[{slug:'pain',name:'Pain Management Series'},{slug:'spinal',name:'Spinal Anesthesia Series'},{slug:'epidural',name:'Epidural Anesthesia Series'}].map(s=><Link key={s.slug} href={`/products?series=${s.slug}`}><SiteText value={s.name}/></Link>)}</nav></details>:<Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-2 py-3 text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-secondary text-brand-blue-deep"
                    : "text-foreground/80 hover:bg-secondary hover:text-brand-blue-deep",
                )}
              >
                <SiteText value={link.label}/>
              </Link>
            )
          })}
        </nav>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-secondary xl:hidden"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "grid overflow-hidden border-t border-border bg-background transition-[grid-template-rows] duration-200 ease-out xl:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                link.href==='/products'?<details key={link.href} className="meeting-mobile-products"><summary className="px-3 py-3 font-medium"><SiteText value="Branded Products"/></summary><nav aria-label="Mobile branded product series">{[{slug:'pain',name:'Pain Management Series'},{slug:'spinal',name:'Spinal Anesthesia Series'},{slug:'epidural',name:'Epidural Anesthesia Series'}].map(s=><Link key={s.slug} href={`/products?series=${s.slug}`} className="block px-6 py-3" onClick={()=>setOpen(false)}><SiteText value={s.name}/></Link>)}</nav></details>:<Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                    isActive ? "bg-secondary text-brand-blue-deep" : "text-foreground/85 hover:bg-secondary",
                  )}
                >
                  <SiteText value={link.label}/>
                  
                </Link>
              )
            })}
            <Button asChild className="mt-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue-deep">
              <Link href="/contact"><SiteText value={"Request a Quote"}/></Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
