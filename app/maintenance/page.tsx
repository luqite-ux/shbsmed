import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Website Update",
  description: "Brightstone Medical's website is being updated. For business inquiries, contact info@shbsmed.com.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#071d35] px-6 py-12 text-white sm:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 left-0 h-[34rem] w-[34rem] rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="flex items-center gap-4 border-b border-white/15 pb-8">
          <Image src="/images/brand/logo.png" alt="Brightstone Medical logo" width={56} height={56} className="h-12 w-12 object-contain sm:h-14 sm:w-14" priority />
          <div>
            <p className="text-lg font-semibold tracking-tight sm:text-xl">Brightstone Medical</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Medical Technology</p>
          </div>
        </header>

        <section className="max-w-3xl py-20 sm:py-28" aria-labelledby="maintenance-title">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Website notice</p>
          <h1 id="maintenance-title" className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Our website is being updated
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            We expect to be back online on October 15, 2026.
          </p>
          <div className="mt-12 border-l-2 border-cyan-300 pl-5">
            <p className="text-base text-slate-200">For business inquiries, please contact us at</p>
            <a href="mailto:info@shbsmed.com" className="mt-2 inline-block break-all text-xl font-semibold text-cyan-200 underline decoration-cyan-200/60 underline-offset-4 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:text-2xl">
              info@shbsmed.com
            </a>
          </div>
        </section>

        <footer className="border-t border-white/15 pt-6 text-sm text-slate-300">
          Shanghai Brightstone Medical Technology Limited
        </footer>
      </div>
    </main>
  )
}
