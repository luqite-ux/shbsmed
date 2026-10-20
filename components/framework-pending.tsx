import {SiteText} from '@/components/site-copy'
export function PendingNote({children}:{children:string}){return <p className="framework-review-note"><SiteText value={children}/></p>}
export function PendingPanel({title,children}:{title:string;children:string}){return <aside className="framework-review-panel"><h3><SiteText value={title}/></h3><PendingNote>{children}</PendingNote></aside>}
