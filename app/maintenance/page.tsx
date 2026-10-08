import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Website Update",
  description: "Brightstone Medical's website is being updated. For business inquiries, contact info@shbsmed.com.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#071d35] px-6 py-8 text-white sm:px-10 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 left-0 h-[34rem] w-[34rem] rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="flex flex-col items-center gap-2 border-b border-white/15 pb-8 text-center sm:flex-row sm:gap-8 sm:text-left">
          <Image src="/images/brand/maintenance-logo-20261008.jpg" alt="Brightstone Medical registered trademark logo" width={680} height={657} className="h-auto w-64 shrink-0 object-contain sm:w-72" priority />
          <div className="min-w-0">
            <p className="text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-[3.25rem]">Brightstone Medical</p>
            <p className="mt-3 text-sm uppercase tracking-[0.17em] text-cyan-100/80 sm:text-base">Medical Technology</p>
          </div>
        </header>

        <section className="max-w-3xl py-10 sm:py-12" aria-labelledby="maintenance-title">
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
