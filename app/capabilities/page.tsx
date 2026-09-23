import Image from "next/image"
import { PageFrame } from "@/components/page-frame"
import { customerMedia } from "@/lib/customer-media"

const groups = [
  { title: "Facility and production", match: /公司入户区|办公室|仓库|净化车间|检验室|打印机|成品\d|生产过程|半成品|展会/ },
  { title: "RF cannula configurations", match: /射频套管|image3|image4|image5|image6/ },
  { title: "RF electrodes and product portfolio", match: /射频电极|轮播图|image1|image8|image9|image10|image11/ },
]

const label=(source:string)=>source.split(/[\\/]/).pop()?.replace(/\.(?:jpe?g|png|webp|tiff?|mp4)$/i,"")||"Customer-supplied evidence"

export const metadata={title:"Manufacturing Capabilities",description:"Customer-supplied production, facility and product evidence from Brightstone Medical.",alternates:{canonical:"https://shbsmed.com/capabilities"}}

export default function CapabilitiesPage(){const images=customerMedia.filter(x=>x.type!=="video");return <PageFrame eyebrow="Capabilities" title="Documented facilities, processes and product configurations" description="This visual record uses the production, facility and product materials supplied by Brightstone Medical."><section className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">{groups.map(group=>{const items=images.filter(item=>group.match.test(item.source));return items.length?<div key={group.title}><h2 className="text-2xl font-semibold">{group.title}</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><figure className="overflow-hidden rounded-xl border bg-white" key={item.url}><div className="relative aspect-[4/3] bg-slate-50"><Image src={item.url} alt={label(item.source)} fill className="object-contain p-2"/></div><figcaption className="border-t px-4 py-3 text-sm text-muted-foreground">{label(item.source)}</figcaption></figure>)}</div></div>:null})}</section></PageFrame>}
