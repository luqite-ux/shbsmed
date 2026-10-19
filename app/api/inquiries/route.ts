import { createClient } from "@supabase/supabase-js"
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from "@/lib/inquiry-captcha"
import {randomUUID} from 'node:crypto'
import {inspectAttachment,ATTACHMENT_LIMIT} from '@/lib/inquiry-attachment-validation.mjs'
import {after} from 'next/server'
import {notifyPersistedInquiry} from '@/lib/inquiry-notify.mjs'

export async function POST(request: Request) {
  let body: Record<string,string>,attachment:File|null=null
  if(Number(request.headers.get('content-length'))>ATTACHMENT_LIMIT+100000)return Response.json({error:'The attachment is too large.'},{status:413})
  try {
    if(request.headers.get('content-type')?.includes('multipart/form-data')){
      const data=await request.formData();body={};for(const [key,value] of data.entries())if(typeof value==='string')body[key]=value
      const file=data.get('attachment');if(file instanceof File&&file.size)attachment=file
    }else body=await request.json()
    if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Invalid request')
    body=Object.fromEntries(Object.entries(body).filter(([,v])=>typeof v==='string'))
  }catch{return Response.json({error:'Invalid request'},{status:400})}
  const secret=process.env.CAPTCHA_SECRET?.trim(); if(!secret)return Response.json({error:"Verification service is unavailable."},{status:503})
  const context=createSupabaseCaptchaContextFromEnv()
  const captcha=await verifyCaptchaSubmission({secret,scope:body.captchaScope,token:body.captchaToken,answer:body.captchaAnswer,...context})
  if(!captcha.ok)return Response.json({error:"The verification code is invalid or expired."},{status:400})
  if(['name','company','email','message'].some(k=>!body[k]?.trim())||!/^\S+@\S+\.\S+$/.test(body.email)||Object.entries({name:200,company:200,email:254,phone:80,subject:300,message:10000}).some(([key,max])=>(body[key]?.length||0)>max))return Response.json({error:'Please enter your name, company, valid email and message.'},{status:400})
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})
  const tenant=process.env.NEXT_PUBLIC_TENANT_ID!,bucket='inquiry-attachments';let path:string|null=null,message=body.message.trim()
  if(attachment){
    try{
      const bytes=Buffer.from(await attachment.arrayBuffer()),checked=inspectAttachment({name:attachment.name,size:attachment.size,bytes})
      const bucketInfo=await db.storage.getBucket(bucket);if(bucketInfo.error||bucketInfo.data.public)throw Error('Private attachment storage is unavailable.')
      path=`${tenant}/${randomUUID()}/${checked.fileName}`
      const upload=await db.storage.from(bucket).upload(path,bytes,{contentType:checked.contentType,upsert:false});if(upload.error)throw Error('The attachment could not be uploaded.')
      message+='\nAttachment Metadata: '+JSON.stringify({version:1,tenantId:tenant,bucket,path,originalName:checked.fileName,contentType:checked.contentType,size:attachment.size,inspection:'signature-validated'})
    }catch(error){return Response.json({error:error instanceof Error?error.message:'The attachment could not be uploaded.'},{status:400})}
  }
  const {data:saved,error}=await db.from("inquiries").insert({tenant_id:tenant,name:body.name.trim(),email:body.email.trim(),phone:body.phone?.trim()||null,company:body.company?.trim()||null,subject:body.subject?.trim()||"Website RFQ",message}).select('id').single()
  if(error){if(path)await db.storage.from(bucket).remove([path]);return Response.json({error:"Your inquiry could not be sent. Please contact us by email."},{status:500})}
  after(async()=>{const delivered=await notifyPersistedInquiry({tenantId:tenant,inquiryId:saved.id,adminUrl:process.env.NEXT_PUBLIC_ADMIN_URL,secret:process.env.INQUIRY_NOTIFY_SECRET});if(!delivered)console.warn('Inquiry saved; notification was not confirmed.')})
  return Response.json({ok:true})
}
