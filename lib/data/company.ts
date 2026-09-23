import type { CapacityFact, FaqItem } from "@/lib/types"

export const company = {
  legalNameEn: "Shanghai Brightstone Medical Technology Limited",
  legalNameZh: "上海明石医疗科技有限公司",
  brandName: "Brightstone Medical",
  founded: "December 2015",
  address: "Building 1, Floor 3, No. 78 Kangtai Road, Zhujiajiao Town, Qingpu District, Shanghai, China",
  domain: "shbsmed.com",
  email: "info@shbsmed.com",
  facilityArea: "2,000 sqm",
  productionLines: "4 dedicated product lines plus 2 custom medical needle-component lines",
  monthlyCapacity: "approximately 150,000 units per month",
  standardLeadTime: "45 days for standard orders",
  exportHistory: "Continuous exports to the United States for 10 years",
  registrations: "FDA 510(k) clearance, EU CE marking, and China medical device registration",
}

export const capacityFacts: CapacityFact[] = [
  {
    label: { en: "Facility" },
    value: { en: "2,000 sqm" },
    helper: { en: "Dedicated manufacturing floor in Shanghai, established 2015." },
  },
  {
    label: { en: "Production lines" },
    value: { en: "4 + 2" },
    helper: { en: "Four standard product lines plus two custom needle-component lines." },
  },
  {
    label: { en: "Monthly capacity" },
    value: { en: "~150,000 units" },
    helper: { en: "Across the disposable electrode and cannula product range." },
  },
  {
    label: { en: "Standard lead time" },
    value: { en: "45 days" },
    helper: { en: "Typical production lead time for standard orders." },
  },
]

export const faqItems: FaqItem[] = [
  {
    question: { en: "What is your minimum order quantity (MOQ)?" },
    answer: {
      en: "MOQ varies by SKU, gauge, and packaging configuration. Share your target product and order volume through the RFQ form and our team will confirm MOQ for your specific requirement.",
    },
  },
  {
    question: { en: "Can we request product samples before placing an order?" },
    answer: {
      en: "Yes. Sample requests are handled case by case depending on the product and destination. Submit a sample request through the Contact page and our team will follow up with availability and next steps.",
    },
  },
  {
    question: { en: "Do you support OEM/ODM programs?" },
    answer: {
      en: "Yes. We support OEM/ODM configurations across our disposable RF electrode and cannula lines, including partner branding and packaging arrangements. Contact our team to discuss your program.",
    },
  },
  {
    question: { en: "What is your standard production lead time?" },
    answer: {
      en: "Our standard lead time for regular orders is 45 days. Lead times for custom configurations or large volumes are confirmed at the time of quotation.",
    },
  },
  {
    question: { en: "Which markets do you currently export to?" },
    answer: {
      en: "We have exported continuously to the United States for 10 years and work with distribution and OEM partners across multiple international markets.",
    },
  },
  {
    question: { en: "What certifications and registrations do you hold?" },
    answer: {
      en: "Our products are manufactured under FDA 510(k) clearance, EU CE marking, and China medical device registration. Specific documentation is shared with qualified partners under the appropriate agreements.",
    },
  },
  {
    question: { en: "Can you manufacture custom gauge, length, or tip configurations?" },
    answer: {
      en: "Yes. Our dedicated cannula and electrode lines support multiple gauge, length, and tip-style configurations. Share your specification through the RFQ form for a feasibility review.",
    },
  },
  {
    question: { en: "How do you manage quality control during production?" },
    answer: {
      en: "Production runs through in-process inspection and a dedicated inspection area alongside our cleanroom assembly lines. See the Quality page for an overview of our process controls.",
    },
  },
  {
    question: { en: "How can I request a formal quotation?" },
    answer: {
      en: "Use the RFQ form on the Contact page or any Request a Quote button across the site. Include product family, target specification, and estimated volume for the fastest response.",
    },
  },
]
