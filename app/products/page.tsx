import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ProductSeries} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {getMedicalProducts} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata("/products",{title:'RF Products for Pain Management',description:'Compare RF cannulas by tip structure and RF electrodes by configuration. View product images and complete specification tables.',alternates:{canonical:'https://shbsmed.com/products'}})}
export default async function Products(){const products=await getMedicalProducts();return <PageFrame eyebrow="Products" title="Medical needle products" description="Choose Pain Management or Anesthesia to view that series. Open a product for images and available specifications."><Reveal as="section" className="medical-shell medical-section"><ProductSeries items={products}/></Reveal></PageFrame>}
