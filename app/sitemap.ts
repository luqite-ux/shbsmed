import type { MetadataRoute } from "next"
import { fetchProductsData } from "@/lib/products-db"
import { getPublishedArticles } from "@/lib/articles-db"
export const revalidate=60
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base="https://shbsmed.com",now=new Date(),[{products},articles]=await Promise.all([fetchProductsData(),getPublishedArticles()]);const staticRoutes=["","/products","/manufacturing","/capabilities","/quality","/about","/news","/contact"].map(path=>({url:`${base}${path}`,lastModified:now}));return[...staticRoutes,...products.map(p=>({url:`${base}/products/${p.slug}`,lastModified:now})),...articles.map(a=>({url:`${base}/news/${a.slug}`,lastModified:new Date(a.updatedAt||a.publishedAt||now)}))]}
