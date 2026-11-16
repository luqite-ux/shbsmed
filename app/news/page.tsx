import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {getPublishedArticles} from '@/lib/articles-db'
import {NewsList,newsCategories} from '@/components/news-list'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/news',{title:'Information',description:'Industry information, product information and company information from Brightstone Medical.'})}
export default async function News({searchParams}:{searchParams?:Promise<{category?:string}>}){const [articles,query]=await Promise.all([getPublishedArticles(),searchParams||Promise.resolve({category:undefined})]);const selected=newsCategories.find(category=>category.slug===query.category);return <PageFrame eyebrow="Information" title={selected?.name||"Information"} description={selected?'':"Industry, product and company information."}><section className="medical-shell medical-section"><NewsList articles={articles} category={query.category}/></section></PageFrame>}
