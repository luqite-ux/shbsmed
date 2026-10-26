export type NavigationEntry={label:string;href:string;children?:NavigationEntry[]}
export const brandedSeries=[{slug:'electrode-sets',name:'RF Electrode Sets'},{slug:'probes',name:'RF Probes'},{slug:'cannulas',name:'RF Cannulas'}]
export const oemSeries=[{slug:'anesthesia',name:'Anesthesia Needle Series'},{slug:'interventional',name:'Interventional Therapy Series'}]
export const componentSeries=[
 {slug:'bone-marrow',name:'Bone Marrow Biopsy Series'},
 {slug:'visceral',name:'Visceral Biopsy Series'},
 {slug:'anesthesia',name:'Anesthesia Series'},
 {slug:'interventional',name:'Interventional Therapy Series'},
 {slug:'infusion-drainage',name:'Infusion & Drainage Series'},
 {slug:'aesthetic',name:'Aesthetic Series'},
 {slug:'ultrasound',name:'Ultrasound Guidance Solutions'},
 {slug:'tip',name:'Tip Structure Solutions'},
 {slug:'end',name:'End Structure Solutions'},
]
export const navigation:NavigationEntry[]=[
 {label:'Home',href:'/'},
 {label:'About Us',href:'/about',children:[{label:'Company Introduction',href:'/about/company-introduction'},{label:'Qualifications',href:'/about/qualifications'},{label:'Manufacturing Equipment & Inspection Instruments',href:'/about/manufacturing-inspection'}]},
 {label:'Branded Products',href:'/products',children:brandedSeries.map(s=>({label:s.name,href:`/products?series=${s.slug}`}))},
 {label:'OEM',href:'/odm-oem',children:oemSeries.map(s=>({label:s.name,href:`/odm-oem?series=${s.slug}`}))},
 {label:'Component Manufacturing',href:'/contract-manufacturing',children:componentSeries.map(s=>({label:s.name,href:`/contract-manufacturing?series=${s.slug}`}))},
 {label:'Information',href:'/news',children:[{label:'Industry Information',href:'/news?category=industry'},{label:'Corporate Information',href:'/news?category=company'},{label:'Product Information',href:'/news?category=product'}]},
 {label:'Contact Us',href:'/contact'},
]
