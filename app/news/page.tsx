import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {getPublishedArticles} from '@/lib/articles-db'
import {NewsList} from '@/components/news-list'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/news',{title:'Updates',description:'Industry updates, product updates and company updates from Brightstone Medical.'})}
export default async function News({searchParams}:{searchParams?:Promise<{category?:string}>}){const [articles,query]=await Promise.all([getPublishedArticles(),searchParams||Promise.resolve({category:undefined})]);return <PageFrame eyebrow="Updates" title="Updates" description="Industry, product and company updates."><section className="medical-shell medical-section"><NewsList articles={articles} category={query.category}/></section></PageFrame>}
