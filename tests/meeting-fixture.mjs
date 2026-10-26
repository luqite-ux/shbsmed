import {readFileSync,existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import {copyKey} from '../lib/site-copy-key.mjs'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
const parts=JSON.parse(readFileSync(new URL('../lib/contract-seed.json',import.meta.url)))
export function load(file){
 const mod={exports:{}},code=ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
 const aliases={
 '@/lib/site-copy-key.mjs':{copyKey},
 '@/components/localized-link':{__esModule:true,default:({children,...p})=>React.createElement('a',p,children)},
 '@/components/site-copy':{SiteText:({value,paragraphs})=>paragraphs?value.split(/(?<=\.)\s+/).map((v,i)=>React.createElement('p',{key:i},v)):value,SiteImage:p=>React.createElement('img',p),SiteContentVersion:({children})=>children,useSiteLanguage:()=>({locale:'en',defaultLocale:'en'}),useSiteBrand:()=>({description:'Medical needles',legalNameEn:'Shanghai Brightstone Medical Technology Limited',address:'Shanghai'})},
 '@/components/brand-logo':{BrandLogo:()=>React.createElement('a',{href:'/'},'Brightstone')},
 '@/components/reveal':{Reveal:({as='section',children,delay,...p})=>React.createElement(as,p,children)},
 '@/components/medical-media':{ZoomImage:p=>React.createElement('img',p),ProcessVideo:p=>React.createElement('video',{src:p.src,controls:true})},
 '@/components/hero-carousel':{HeroCarousel:()=>React.createElement('section',{'data-business':'banner'},'Banner')},
 '@/lib/site-content/metadata':{pageMetadata:(_path,value)=>value},
 '@/lib/locale':{localizedPath:async path=>path},
 '@/lib/articles-db':{getPublishedArticles:async()=>[]},
 '@/lib/medical-products':{getMedicalProducts:async()=>seed.products,getOdmProducts:async()=>seed.odm,getContractComponents:async()=>parts},
 'next/navigation':{usePathname:()=>'/products',notFound(){throw Error('not found')},permanentRedirect(path){throw Error('redirect:'+path)}},
 }
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>{if(n in aliases)return aliases[n];if(n.startsWith('@/')){const path=n.replace('@/','');if(path.endsWith('.json'))return JSON.parse(readFileSync(new URL('../'+path,import.meta.url)));for(const ext of ['.tsx','.ts','.mjs'])if(existsSync(new URL('../'+path+ext,import.meta.url)))return load(path+ext)}return require(n)}})
 return mod.exports
}
export const render=async(file,props={})=>renderToStaticMarkup(await load(file).default(props)).replaceAll('&amp;','&')
