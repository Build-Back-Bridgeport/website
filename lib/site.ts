export const SUPPORTED_LANGS = ["en", "es", "pt", "ht"] as const

export type SiteLang = (typeof SUPPORTED_LANGS)[number]

export const SITE_NAME = "Build Back Bridgeport"

export const SITE_EMAIL = "info@buildbackbridgeport.com"

export const SITE_PHONE = "+1-203-555-0123"

export const SITE_ADDRESS = {
  streetAddress: "123 Main Street",
  addressLocality: "Bridgeport",
  addressRegion: "CT",
  postalCode: "06604",
  addressCountry: "US",
} as const

export const OG_LOCALE_MAP: Record<SiteLang, string> = {
  en: "en_US",
  es: "es_US",
  pt: "pt_BR",
  ht: "ht_HT",
}

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67e0d46b5bae?auto=format&fit=crop&w=1200&h=630&q=80"

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://buildbackbridgeport.com"

  return url.replace(/\/$/, "")
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

export function pagePath(lang: string, subpath = ""): string {
  const suffix = subpath ? `/${subpath.replace(/^\//, "")}` : ""
  return `/${lang}${suffix}`
}

export function getDefaultOgImage(): string {
  return DEFAULT_OG_IMAGE
}

export function resolveOgImageUrl(image?: string): string {
  if (!image) {
    return getDefaultOgImage()
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image
  }

  return absoluteUrl(image)
}
