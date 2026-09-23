import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { company } from "@/lib/data/company"

const footerLinks = [
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/manufacturing", label: "Manufacturing" },
      { href: "/quality", label: "Quality" },
      { href: "/news", label: "News" },
    ],
  },
  {
    heading: "Products",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products?family=rf-electrodes", label: "RF Electrodes" },
      { href: "/products?family=rf-cannula-standard", label: "RF Cannulas" },
    ],
  },
  {
    heading: "Get in Touch",
    links: [
      { href: "/contact", label: "Request a Quote" },
      { href: "/contact", label: "Contact Sales" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-brand-blue-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo className="[&_span:first-child]:text-white [&_span:last-child]:text-white/60" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {company.legalNameEn} manufactures disposable RF electrodes and multi-configuration RF cannulas from a
              dedicated {company.facilityArea} facility in Shanghai, China.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-white">{group.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link, index) => (
                  <li key={`${link.href}-${link.label}-${index}`}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {company.legalNameEn}. All rights reserved.
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <a href={`mailto:${company.email}`} className="hover:text-white">
              {company.email}
            </a>
            <span className="hidden sm:inline">·</span>
            <span>{company.address}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
