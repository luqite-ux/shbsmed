const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export async function notifyPersistedInquiry({tenantId,inquiryId,adminUrl,secret,fetcher=fetch}){
 if(!UUID.test(tenantId||'')||!UUID.test(inquiryId||''))return false
 let origin;try{origin=new URL(adminUrl)}catch{return false}
 if(origin.origin!=='https://admin.globle-trade.com'||origin.username||origin.password)return false
 try{
  const response=await fetcher(`${origin.origin}/api/inquiries/notify`,{method:'POST',headers:{'Content-Type':'application/json',...(secret?{'x-inquiry-notify-secret':secret}:{})},body:JSON.stringify({tenantId,inquiryId}),redirect:'error',signal:AbortSignal.timeout(8000)})
  if(!response.ok)return false
  return (await response.json()).ok===true
 }catch{return false}
}
