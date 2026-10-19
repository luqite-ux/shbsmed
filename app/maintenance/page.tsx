import type { Metadata } from "next"
import {permanentRedirect} from 'next/navigation'

export const metadata: Metadata = {
  title: "Website Update",
  description: "Brightstone Medical's website is being updated. For business inquiries, contact info@shbsmed.com.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  permanentRedirect('/')
}
