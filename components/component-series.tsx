"use client"
import {useState} from 'react'
import {MedicalCards} from '@/components/medical-catalog'
import Link from '@/components/localized-link'
import {SiteText} from '@/components/site-copy'
const applications=['Biopsy','Interventional','Anesthesia','Infusion','Other']
const biopsyOrder=['bone-marrow-biopsy-components','cutting-biopsy-components','aspiration-biopsy-components']
export function ComponentSeries({parts}:{parts:{slug:string;name:string;group:string;image:string;application?:string}[]}){
 const[selected,setSelected]=useState('Biopsy')
 // Process examples are not evidence of a product's clinical application.
 const shown=parts.filter(p=>(p.application || (biopsyOrder.includes(p.slug)?'Biopsy':''))===selected)
   .sort((a,b)=>biopsyOrder.indexOf(a.slug)-biopsyOrder.indexOf(b.slug))
 return <><div className="series-tabs" role="group" aria-label="Component series">{applications.map(g=><button type="button" aria-pressed={selected===g} key={g} onClick={()=>setSelected(g)}><SiteText value={g}/></button>)}</div>
 <div aria-live="polite">{shown.length?<MedicalCards items={shown} base="/contract-manufacturing"/>:<div className="medical-copy-panel"><h2><SiteText value={`${selected} component requirements`}/></h2><p><SiteText value="Share your drawings or samples, dimensions and quantity to discuss your component requirements."/></p><Link className="medical-button" href="/contact?type=Contract%20manufacturing"><SiteText value="Discuss Component Requirements →"/></Link></div>}</div></>
}
