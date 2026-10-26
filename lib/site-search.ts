export type SearchEntry={name:string;href:string;image?:string;keywords?:string}
export function searchEntries(entries:SearchEntry[],query:string){const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return[];return entries.filter(entry=>terms.every(term=>`${entry.name} ${entry.keywords||''}`.toLocaleLowerCase().includes(term))).slice(0,60)}
