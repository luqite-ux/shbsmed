import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {OemContent} from '@/components/meeting-sections'
import {getOdmProducts} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata('/odm-oem',{title:'OEM Needle Products',description:'Finished medical needle products for private-label manufacturing.'})}
export default async function Oem(){const products=await getOdmProducts();return <PageFrame eyebrow="OEM" title="OEM Needle Products" description="Product examples for private-label manufacturing."><section className="medical-shell medical-section"><OemContent items={products}/></section></PageFrame>}
