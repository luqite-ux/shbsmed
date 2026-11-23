"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"
import {inquiryTypes} from '@/lib/inquiry-business.mjs'
import {useSiteLanguage} from '@/components/site-copy'

type EnquiryProduct = {
  slug: string
  name: string
}

export function EnquiryForm({
  defaultProduct,
  defaultType,
  products,
}: {
  defaultProduct?: string
  defaultType?: string
  products: EnquiryProduct[]
}) {
  const {locale}=useSiteLanguage(); const zh=locale.startsWith('zh'); const t=(en:string,cn:string)=>zh?cn:en
  const [notice, setNotice] = useState("")
  const [noticeKind,setNoticeKind]=useState<'success'|'error'>('success')
  const [pending, setPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=event.currentTarget
    setPending(true);setNotice("")
    const data=new FormData(form)
    data.set('subject',String(data.get('product')||'').trim()||'Website RFQ')
    try{const response=await fetch('/api/inquiries',{method:'POST',body:data});const result=await response.json();if(!response.ok)throw new Error(result.error||t('Unable to send inquiry.','询盘发送失败，请稍后重试。'));form.reset();setNoticeKind('success');setNotice(t('Thank you. Your inquiry has been received.','感谢咨询，我们已收到您的询盘。'))}catch(error){setNoticeKind('error');setNotice(error instanceof Error?error.message:t('Unable to send inquiry.','询盘发送失败，请稍后重试。'))}finally{setRefreshKey(v=>v+1);setPending(false)}
  }

  return (
    <form action="/api/inquiries" method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="inquiry-form rounded-xl border border-border bg-card p-6 sm:p-8">
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">{t('Full name','姓名')}</FieldLabel>
            <Input id="name" name="name" required maxLength={200} autoComplete="name" placeholder={t('Your full name','请输入姓名')} />
          </Field>
          <Field>
            <FieldLabel htmlFor="company">{t('Company','公司')}</FieldLabel>
            <Input id="company" name="company" required maxLength={200} autoComplete="organization" placeholder={t('Your company','请输入公司名称')} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">{t('Phone (optional)','电话（选填）')}</FieldLabel>
            <Input id="phone" name="phone" type="tel" maxLength={80} autoComplete="tel" placeholder={t('Country code and phone number','国家区号及电话号码')} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="inquiryType">{t('Inquiry type','询盘类型')}</FieldLabel>
          <select id="inquiryType" name="inquiryType" required defaultValue={defaultType==='ODM'?'OEM':inquiryTypes.includes(defaultType || '') ? defaultType : ''}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
            <option value="" disabled>{t('Select an inquiry type','请选择询盘类型')}</option>
            {inquiryTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="product">{t('Product name or model','产品名称或型号')}</FieldLabel>
          <Input id="product" name="product" maxLength={300} defaultValue={products.find(p=>p.slug===defaultProduct)?.name||defaultProduct||''} placeholder={t('Enter a product name or model','请输入产品名称或型号')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">{t('Tell us about your application','请说明应用需求')}</FieldLabel>
          <Textarea
            id="message"
            name="message"
            required
            maxLength={10000}
            rows={5}
            placeholder={t('Target industry, quantity, dimensions, delivery destination and timeline.','请说明应用领域、数量、尺寸、交付地点和时间要求。')}
          />
          <FieldDescription>{t('The more application detail you share, the more useful our reply can be.','请尽量提供具体应用信息，以便我们准确回复。')}</FieldDescription>
        </Field>

        <InquiryCaptchaField refreshKey={refreshKey} />

        <Button disabled={pending} type="submit" size="lg" className="bg-brand-blue text-white hover:bg-brand-blue-deep">
          {pending ? t('Sending…','发送中…') : t('Send Inquiry','发送询盘')}
        </Button>
        {notice && <p role={noticeKind==='error'?'alert':'status'} className={`rounded-md p-3 text-sm ${noticeKind==='error'?'bg-red-50 text-red-900':'bg-green-50 text-green-900'}`}>{notice}</p>}
      </FieldGroup>
    </form>
  )
}
