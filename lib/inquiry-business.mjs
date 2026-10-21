export const inquiryTypes = ['Product purchase', 'OEM', 'Contract manufacturing']

export function buildInquirySubject({inquiryType, subject}) {
  if (!inquiryTypes.includes(inquiryType)) throw new Error('Please select an inquiry type.')
  return `${inquiryType} — ${subject?.trim() || 'Website RFQ'}`
}
