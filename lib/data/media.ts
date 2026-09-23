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
    image: "/images/banners/banner-precision-array.jpg",
    focalPosition: "35% 50%",
    eyebrow: "Disposable RF Electrodes & Cannulas",
    heading: "Precision-manufactured radiofrequency components, built for repeatable procedural use",
    subheading:
      "Shanghai Brightstone Medical Technology Limited manufactures disposable RF electrodes and multi-configuration RF cannulas across dedicated production lines in Shanghai.",
    textSide: "right",
  },
  {
    id: "automated-assembly",
    image: "/images/banners/banner-automated-assembly.jpg",
    focalPosition: "60% 45%",
    eyebrow: "Automated Assembly",
    heading: "Automated cutting and assembly lines behind every finished component",
    subheading:
      "Four dedicated product lines and two custom needle-component lines support consistent output at approximately 150,000 units per month.",
    textSide: "left",
  },
  {
    id: "needle-detail",
    image: "/images/banners/banner-needle-detail.jpg",
    focalPosition: "20% 50%",
    eyebrow: "OEM / ODM Ready",
    heading: "Configurable gauge, length, and tip geometry for your specification",
    subheading:
      "OEM/ODM programs, sample requests, and custom configurations are reviewed directly by our production and quality team.",
    textSide: "right",
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
