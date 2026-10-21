import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ProductSeries} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {getMedicalProducts} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/products',{title:'Branded Medical Needle Products',description:'Pain management, spinal anesthesia and epidural anesthesia product series.'})}
export default async function Products({searchParams}:{searchParams?:Promise<{series?:string}>}){const [products,query]=await Promise.all([getMedicalProducts(),searchParams||Promise.resolve({series:undefined})]);return <PageFrame eyebrow="Branded Products" title="Branded Medical Needle Products" description="Choose a series, then open a product image or name to view the details and specifications."><Reveal as="section" className="medical-shell medical-section"><ProductSeries items={products} selected={query.series}/></Reveal></PageFrame>}
