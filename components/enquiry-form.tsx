"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"
import {inquiryTypes} from '@/lib/inquiry-business.mjs'

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
  const [notice, setNotice] = useState("")
  const [noticeKind,setNoticeKind]=useState<'success'|'error'>('success')
  const [pending, setPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=event.currentTarget
    setPending(true);setNotice("")
    const data=new FormData(form)
    data.set('subject',products.find(p=>p.slug===data.get('product'))?.name||'Website RFQ')
    try{const response=await fetch('/api/inquiries',{method:'POST',body:data});const result=await response.json();if(!response.ok)throw new Error(result.error||'Unable to send inquiry.');form.reset();setNoticeKind('success');setNotice('Thank you. Your inquiry has been received.')}catch(error){setNoticeKind('error');setNotice(error instanceof Error?error.message:'Unable to send inquiry.')}finally{setRefreshKey(v=>v+1);setPending(false)}
  }

  return (
    <form action="/api/inquiries" method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="inquiry-form rounded-xl border border-border bg-card p-6 sm:p-8">
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" name="name" required maxLength={200} autoComplete="name" placeholder="Your full name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input id="company" name="company" required maxLength={200} autoComplete="organization" placeholder="Your company" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
            <Input id="phone" name="phone" type="tel" maxLength={80} autoComplete="tel" placeholder="Country code and phone number" />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="inquiryType">Inquiry type</FieldLabel>
          <select id="inquiryType" name="inquiryType" required defaultValue={inquiryTypes.includes(defaultType || '') ? defaultType : ''}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue">
            <option value="" disabled>Select an inquiry type</option>
            {inquiryTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="product">Product of interest</FieldLabel>
          <Select name="product" defaultValue={defaultProduct}>
            <SelectTrigger id="product" className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
              ))}
              <SelectItem value="other">Other / not listed</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Tell us about your application</FieldLabel>
          <Textarea
            id="message"
            name="message"
            required
            maxLength={10000}
            rows={5}
            placeholder="Target industry, quantity, dimensions, delivery destination and timeline."
          />
          <FieldDescription>The more application detail you share, the more useful our reply can be.</FieldDescription>
        </Field>

        <InquiryCaptchaField refreshKey={refreshKey} />

        <Button disabled={pending} type="submit" size="lg" className="bg-brand-blue text-white hover:bg-brand-blue-deep">
          {pending ? "Sending…" : "Send Inquiry"}
        </Button>
        {notice && <p role={noticeKind==='error'?'alert':'status'} className={`rounded-md p-3 text-sm ${noticeKind==='error'?'bg-red-50 text-red-900':'bg-green-50 text-green-900'}`}>{notice}</p>}
      </FieldGroup>
    </form>
  )
}
