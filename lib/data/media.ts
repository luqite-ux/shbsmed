// Central manifest for the customer-supplied media used across the site.
// Video sources are left as documented slots: the integration team will
// replace `videoSrc` with the transcoded, web-ready MP4/WebM files once the
// two source videos (automated cutting machine, wire cutting) are processed.

export interface HeroSlide {
  id: string
  image: string
  focalPosition: string
  eyebrow: string
  heading: string
  subheading: string
  textSide: "left" | "right"
}

export const heroSlides: HeroSlide[] = [
  {
    id: "precision-array",
    image: "/images/banners/customer-rf-electrode-cannula-202610.jpg",
    focalPosition: "100% 50%",
    eyebrow: "Single-use RF Electrode and RF Cannula",
    heading: "Minimally invasive RF thermocoagulation for precise pain relief",
    subheading:
      "Safe and efficient care focused on tailored treatment for chronic pain.",
    textSide: "left",
  },
  {
    id: "manufacturing-standards",
    image: "/images/banners/customer-cleanroom-202610.jpg",
    focalPosition: "0% 50%",
    eyebrow: "Medical Device Manufacturing",
    heading: "Independent R&D and continuous refinement",
    subheading:
      "Rigorous medical device production standards and manufacturing expertise support minimally invasive clinical instruments.",
    textSide: "right",
  },
  {
    id: "needle-detail",
    image: "/images/banners/customer-curved-tip-cannula-202610.jpg",
    focalPosition: "100% 50%",
    eyebrow: "OEM / ODM Customization",
    heading: "One-stop OEM/ODM customization",
    subheading:
      "From design and development through volume production, supporting global partners as they expand into new markets.",
    textSide: "left",
  },
]

export interface ProcessVideo {
  id: string
  title: string
  description: string
  poster: string
  videoSrc: string | null
  captionsSrc: string | null
}

export const processVideos: ProcessVideo[] = [
  {
    id: "automated-cutting",
    title: "Automated cutting line",
    description:
      "Fully automated cutting equipment processes raw shaft material to length under controlled, repeatable conditions.",
    poster: "/images/manufacturing/automated-cutting-poster.jpg",
    videoSrc: null,
    captionsSrc: null,
  },
  {
    id: "wire-cutting",
    title: "Wire-cut precision forming",
    description:
      "Wire-cut processing shapes precision components to specification ahead of assembly and inspection.",
    poster: "/images/manufacturing/wire-cutting-poster.jpg",
    videoSrc: null,
    captionsSrc: null,
  },
]

export const facilityGallery = [
  {
    id: "electrode-cable",
    image: "/images/products/rf-electrode-cable.jpg",
    caption: "Disposable RF electrode with extended lead cable and connector",
  },
  {
    id: "cannula-family-a",
    image: "/images/products/rf-cannula-family-a.jpg",
    caption: "RF cannulas with color-coded hubs across multiple gauge options",
  },
  {
    id: "cannula-family-b",
    image: "/images/products/rf-cannula-family-b.jpg",
    caption: "Cluster and multi-tip cannula configurations",
  },
  {
    id: "cannula-long",
    image: "/images/products/rf-cannula-single-long.jpg",
    caption: "Standard-tip cannula, extended shaft length",
  },
  {
    id: "cannula-short",
    image: "/images/products/rf-cannula-single-short.jpg",
    caption: "Curved-tip cannula, short shaft length",
  },
]
