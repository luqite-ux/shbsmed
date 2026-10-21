import {permanentRedirect} from 'next/navigation'
import {localizedPath} from '@/lib/locale'
// Preserve old incoming links without presenting unconfirmed component detail pages.
export default async function ComponentDetail(){return permanentRedirect(await localizedPath('/contract-manufacturing'))}
