import {permanentRedirect} from 'next/navigation'
import {localizedPath} from '@/lib/locale'
export default async function Manufacturing(){return permanentRedirect(await localizedPath('/about'))}
