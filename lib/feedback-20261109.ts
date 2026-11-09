import type {Article} from '@/lib/articles-db'
const image=(name:string)=>`/images/feedback-20261109/${name}.webp`
export const additionalComponents=[
 {slug:'bone-marrow-type-ii',name:'Bone Marrow Biopsy Components (Type II)',image:image('bone-marrow-type-ii'),description:'',group:'Bone Marrow Biopsy Series',application:'bone-marrow'},
 {slug:'bone-marrow-type-iii',name:'Bone Marrow Biopsy Components (Type III)',image:image('bone-marrow-type-iii'),description:'',group:'Bone Marrow Biopsy Series',application:'bone-marrow'},
 {slug:'rotating-cut-biopsy',name:'Rotating Cut Biopsy Components',image:image('rotating-cut-biopsy'),description:'',group:'Visceral Biopsy Series',application:'visceral'},
]
const gallery=(group:string,count:number)=>Array.from({length:count},(_,i)=>`<figure><img src="${image(`cmef-${group}-${i+1}`)}" alt="94th CMEF — ${group==='company'?'Brightstone Medical exhibition booth and visitors':'exhibition venue and opening ceremony'}" loading="lazy" /></figure>`).join('')
export const feedbackArticles:Article[]=[
 {slug:'94th-cmef-beijing-opening',category:'industry',title:'Congratulations on the Opening of the 94th CMEF in Beijing',excerpt:'Warm congratulations on the opening of the 94th China International Medical Equipment Fair at the Capital International Exhibition Center of China in Beijing.',content:'<p>Warm congratulations on the opening of the 94th China International Medical Equipment Fair at the Capital International Exhibition Center of China in Beijing.</p>'+gallery('industry',3),image:image('cmef-industry-3'),publishedAt:'2026-10-21T00:00:00Z',updatedAt:'2026-11-09T00:00:00+08:00'},
 {slug:'brightstone-medical-at-94th-cmef',category:'company',title:'Brightstone Medical at the 94th CMEF',excerpt:'Photos from Brightstone Medical’s participation in the 94th China International Medical Equipment Fair.',content:'<p>Brightstone Medical participated in the 94th China International Medical Equipment Fair. The following photos show our exhibition booth and exchanges with visitors.</p>'+gallery('company',4),image:image('cmef-company-1'),publishedAt:'2026-10-24T00:00:00Z',updatedAt:'2026-11-09T00:00:00+08:00'},
]
