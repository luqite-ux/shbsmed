import { createClient } from "@supabase/supabase-js"
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from "@/lib/inquiry-captcha"

export async function POST(request: Request) {
  let body: Record<string,string>
  try { body = await request.json() } catch { return Response.json({error:"Invalid request"},{status:400}) }
  const required=["name","email","message","captchaScope","captchaToken","captchaAnswer"]
  if(required.some(k=>!body[k]?.trim())) return Response.json({error:"Please complete all required fields."},{status:400})
  const secret=process.env.CAPTCHA_SECRET?.trim(); if(!secret)return Response.json({error:"Verification service is unavailable."},{status:503})
  const context=createSupabaseCaptchaContextFromEnv()
  const captcha=await verifyCaptchaSubmission({secret,scope:body.captchaScope,token:body.captchaToken,answer:body.captchaAnswer,...context})
  if(!captcha.ok)return Response.json({error:"The verification code is invalid or expired."},{status:400})
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})
  const {error}=await db.from("inquiries").insert({tenant_id:process.env.NEXT_PUBLIC_TENANT_ID,name:body.name.trim(),email:body.email.trim(),phone:body.phone?.trim()||null,company:body.company?.trim()||null,subject:body.subject?.trim()||"Website RFQ",message:body.message.trim()})
  if(error)return Response.json({error:"Your inquiry could not be sent. Please contact us by email."},{status:500})
  return Response.json({ok:true})
}
