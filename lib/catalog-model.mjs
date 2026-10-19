export function localized(value,locale='en',defaultLocale='en'){
 if(typeof value==='string')return value;
 return value?.[locale]||value?.[defaultLocale]||Object.values(value||{}).find(v=>typeof v==='string'&&v.trim())||'';
}
export function groupSeries(rows){
 const result=new Map();
 for(const row of rows){
  const key=row.category_slug||row.familySlug;
  if(!result.has(key))result.set(key,{slug:key,variants:[]});
  result.get(key).variants.push(row);
 }
 return [...result.values()];
}
export function inCategoryBranch(category,categories,rootSlug){
 const seen=new Set();let current=category
 while(current&&!seen.has(current.id)){if(current.slug===rootSlug)return true;seen.add(current.id);current=categories.find(c=>c.id===current.parent_id)}
 return false
}
export function rfCategories(categories){return categories.filter(c=>!inCategoryBranch(c,categories,'odm-products')&&!inCategoryBranch(c,categories,'contract-components'))}
