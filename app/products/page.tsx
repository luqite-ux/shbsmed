import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ProductSeries} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {getMedicalProducts} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/products',{title:'Branded Medical Needle Products',description:'RF electrode sets, RF probes and RF cannulas.'})}
export default async function Products({searchParams}:{searchParams?:Promise<{series?:string}>}){const [products,query]=await Promise.all([getMedicalProducts(),searchParams||Promise.resolve({series:undefined})]);return <PageFrame eyebrow="Branded Products" title="Branded Medical Needle Products" description=""><Reveal as="section" className="medical-shell medical-section"><ProductSeries items={products} selected={query.series}/></Reveal></PageFrame>}
