import {permanentRedirect} from 'next/navigation'
import {localizedPath} from '@/lib/locale'
// October 21: supplied OEM photos are shown together; details are deferred.
export default async function OemDetail(){return permanentRedirect(await localizedPath('/odm-oem'))}
