import data from "@/lib/customer-media.json"
export type CustomerMediaItem=(typeof data.items)[number]
export const customerMedia=data.items as CustomerMediaItem[]
export const mediaBy=(...terms:string[])=>customerMedia.filter(item=>terms.some(term=>item.source.includes(term)))
export const productionVideos=customerMedia.filter(item=>item.type==='video')
