import {jsonLd} from '@/lib/json-ld'
import {currentLocale,localizedPath} from '@/lib/locale'
export async function ProductSchema({name,image,path,description}:{name:string;image:string;path:string;description?:string}){
 const url=`https://shbsmed.com${await localizedPath(path,await currentLocale())}`
 const product={'@context':'https://schema.org','@type':'Product','@id':`https://shbsmed.com${path}#product`,name,image,url,...(description?{description}:{}),manufacturer:{'@id':'https://shbsmed.com/#organization'}}
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(product)}}/>
}
