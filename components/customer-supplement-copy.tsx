'use client'
import {useSiteLanguage} from '@/components/site-copy'
export function SupplementText({en,zh}:{en:string;zh:string}){const {locale}=useSiteLanguage();return <>{locale.startsWith('zh')?zh:en}</>}
