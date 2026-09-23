import Image from "next/image"

import { PageFrame } from "@/components/page-frame"
import { customerMedia } from "@/lib/customer-media"

const groups = [
  { title: "Facilities and workspaces", match: /公司入户区|办公室|仓库|净化车间/ },
  { title: "Production and quality control", match: /检验室|打印机|成品\d|生产过程|半成品/ },
  { title: "Trade shows and customer engagement", match: /展会/ },
]

function mediaLabel(source: string) {
  if (/公司入户区/.test(source)) return "Company reception area"
  if (/办公室/.test(source)) return "Office workspace"
  if (/不锈钢管仓库/.test(source)) return "Stainless steel tube storage"
  if (/配件仓库/.test(source)) return "Component storage"
  if (/净化车间/.test(source)) return "Cleanroom production area"
  if (/检验室/.test(source)) return "Quality inspection room"
  if (/全自动打印机/.test(source)) return "Automated product marking"
  if (/成品\d/.test(source)) return "Finished goods storage"
  if (/生产过程中的针管/.test(source)) return "Needle tube production"
  if (/半成品针管/.test(source)) return "Semi-finished needle tubes"
  if (/半成品针/.test(source)) return "Semi-finished needle components"
  if (/展会/.test(source)) return "International medical trade show"
  return "Brightstone Medical capability"
}

export const metadata = {
  title: "Manufacturing Capabilities",
  description: "Explore Brightstone Medical facilities, production controls and customer engagement.",
  alternates: { canonical: "https://shbsmed.com/capabilities" },
}

export default function CapabilitiesPage() {
  const images = customerMedia.filter((item) => item.type !== "video")

  return (
    <PageFrame
      eyebrow="Capabilities"
      title="Facilities, production controls and customer engagement"
      description="Explore the manufacturing environment, quality-control resources and industry engagement behind Brightstone Medical."
    >
      <section className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {groups.map((group) => {
          const items = images.filter((item) => group.match.test(item.source))
          return items.length ? (
            <div key={group.title}>
              <h2 className="text-2xl font-semibold">{group.title}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const label = mediaLabel(item.source)
                  return (
                    <figure className="overflow-hidden rounded-xl border bg-white" key={item.url}>
                      <div className="relative aspect-[4/3] bg-white">
                        <Image src={item.url} alt={label} fill className="object-cover" />
                      </div>
                      <figcaption className="border-t px-4 py-3 text-sm text-muted-foreground">{label}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </div>
          ) : null
        })}
      </section>
    </PageFrame>
  )
}
