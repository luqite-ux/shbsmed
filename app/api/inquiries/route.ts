import { createClient } from "@supabase/supabase-js"
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from "@/lib/inquiry-captcha"
import {after} from 'next/server'
import {notifyPersistedInquiry} from '@/lib/inquiry-notify.mjs'

export async function POST(request: Request) {
  let body: Record<string,string>
  if(Number(request.headers.get('content-length'))>100000)return Response.json({error:'The request is too large.'},{status:413})
  try {
    if(request.headers.get('content-type')?.includes('multipart/form-data')){
      const data=await request.formData();body={};for(const [key,value] of data.entries())if(typeof value==='string')body[key]=value
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
  const tenant=process.env.NEXT_PUBLIC_TENANT_ID!,message=body.message.trim()
  const {data:saved,error}=await db.from("inquiries").insert({tenant_id:tenant,name:body.name.trim(),email:body.email.trim(),phone:body.phone?.trim()||null,company:body.company?.trim()||null,subject:body.subject?.trim()||"Website RFQ",message}).select('id').single()
  if(error)return Response.json({error:"Your inquiry could not be sent. Please contact us by email."},{status:500})
  after(async()=>{const delivered=await notifyPersistedInquiry({tenantId:tenant,inquiryId:saved.id,adminUrl:process.env.NEXT_PUBLIC_ADMIN_URL,secret:process.env.INQUIRY_NOTIFY_SECRET});if(!delivered)console.warn('Inquiry saved; notification was not confirmed.')})
  return Response.json({ok:true})
}
