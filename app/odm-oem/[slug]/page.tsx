import {notFound,permanentRedirect} from 'next/navigation'
import {localizedPath} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {Reveal} from '@/components/reveal'
import {ZoomImage} from '@/components/medical-media'
import {SupplementText} from '@/components/customer-supplement-copy'
import Link from '@/components/localized-link'
import products from '@/lib/oem-preview-20261104.json'
import {oemCopy} from '@/lib/oem-preview-copy'
import {jsonLd} from '@/lib/json-ld'
type Props={params:Promise<{slug:string}>}
export const dynamicParams=true
export const revalidate=60
export async function generateMetadata({params}:Props){const {slug}=await params;const p=products.find(p=>p.slug===slug);return p? pageMetadata('/odm-oem/'+slug,{title:p.name,description:oemCopy[slug][0]}):{}}
export default async function OemDetail({params}:Props){
 if(process.env.VERCEL_ENV!=='preview')permanentRedirect(await localizedPath('/odm-oem'))
 const {slug}=await params,p=products.find(p=>p.slug===slug);if(!p)notFound()
 return <PageFrame eyebrow="OEM · Anesthesia" title={p.name} description="">
  <Reveal as="section" className="medical-shell product-detail-grid">
   <div className="oem-detail-photo"><ZoomImage src={p.detail} alt={p.name}/></div>
   <div><h2><SupplementText en="Product overview" zh="产品介绍"/></h2>{p.description.map((line,i)=><p className="medical-intro" key={i}><SupplementText en={oemCopy[slug][i]} zh={line}/></p>)}<Link className="medical-button" href={`/contact?product=${slug}`}><SupplementText en="Inquire About This Product →" zh="咨询此产品 →"/></Link></div>
  </Reveal>
  <section className="medical-light"><Reveal as="section" className="medical-shell medical-section"><h2><SupplementText en="Product specifications" zh="附表"/></h2><div className="spec-scroll" tabIndex={0} aria-label="OEM product specifications"><table className="medical-specs"><thead><tr>{p.headers.map((h,i)=><th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{p.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>{p.note&&<p className="medical-intro whitespace-pre-line">{p.note}</p>}<p className="mt-8"><Link href="/odm-oem?series=anesthesia"><SupplementText en="Back to anesthesia series →" zh="返回椎管内麻醉系列 →"/></Link></p></Reveal></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'Product',name:p.name,description:oemCopy[slug].join(' '),image:'https://preview.shbsmed.com'+p.image})}}/>
 </PageFrame>
}
