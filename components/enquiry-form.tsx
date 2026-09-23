"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"

type EnquiryProduct = {
  slug: string
  name: string
}

export function EnquiryForm({
  defaultProduct,
  products,
}: {
  defaultProduct?: string
  products: EnquiryProduct[]
}) {
  const [notice, setNotice] = useState("")
  const [pending, setPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=event.currentTarget
    setPending(true);setNotice("")
    const data=Object.fromEntries(new FormData(form).entries())
    data.subject=String(data.product||"Website RFQ")
    try{const response=await fetch('/api/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.error||'Unable to send inquiry.');form.reset();setRefreshKey(v=>v+1);setNotice('Thank you. Your inquiry has been received.')}catch(error){setNotice(error instanceof Error?error.message:'Unable to send inquiry.')}finally{setPending(false)}
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 sm:p-8" noValidate>
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" name="name" required autoComplete="name" placeholder="Jane Buyer" />
          </Field>
          <Field>
            <FieldLabel htmlFor="company">Company</FieldLabel>
            <Input id="company" name="company" required autoComplete="organization" placeholder="Your company" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" />
          </Field>
        </div>

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
            rows={5}
            placeholder="Target industry, quantity, dimensions, delivery destination and timeline."
          />
          <FieldDescription>The more application detail you share, the more useful our reply can be.</FieldDescription>
        </Field>

        <InquiryCaptchaField refreshKey={refreshKey} />

        <Button disabled={pending} type="submit" size="lg" className="bg-brand-blue text-white hover:bg-brand-blue-deep">
          {pending ? "Sending…" : "Send Enquiry"}
        </Button>
        {notice && <p role="status" className="rounded-md bg-blue-50 p-3 text-sm text-blue-950">{notice}</p>}
      </FieldGroup>
    </form>
  )
}
