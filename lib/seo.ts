import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  OG_LOCALE_MAP,
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SUPPORTED_LANGS,
  absoluteUrl,
  getDefaultOgImage,
  getSiteUrl,
  pagePath,
  resolveOgImageUrl,
  type SiteLang,
} from "@/lib/site"

type OpenGraphType = NonNullable<Metadata["openGraph"]>["type"]

export interface PageSeoOptions {
  lang: string
  path?: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  type?: OpenGraphType
  noIndex?: boolean
}

export function buildAlternates(lang: string, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {}

  for (const locale of SUPPORTED_LANGS) {
    languages[locale] = absoluteUrl(pagePath(locale, path))
  }

  languages["x-default"] = absoluteUrl(pagePath("en", path))

  return {
    canonical: absoluteUrl(pagePath(lang, path)),
    languages,
  }
}

export function buildPageMetadata({
  lang,
  path = "",
  title,
  description,
  image,
  imageAlt,
  type = "website",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const siteLang = (SUPPORTED_LANGS.includes(lang as SiteLang) ? lang : "en") as SiteLang
  const locale = OG_LOCALE_MAP[siteLang]
  const alternateLocales = SUPPORTED_LANGS.filter((code) => code !== siteLang).map(
    (code) => OG_LOCALE_MAP[code],
  )
  const url = absoluteUrl(pagePath(lang, path))
  const imageUrl = resolveOgImageUrl(image)

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: buildAlternates(lang, path),
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      locale,
      alternateLocale: alternateLocales,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export async function buildRootMetadata(lang: string): Promise<Metadata> {
  const t = await getTranslations({ locale: lang })

  return {
    ...buildPageMetadata({
      lang,
      title: t("name"),
      description: t("footer_description"),
    }),
    title: {
      default: t("name"),
      template: `%s | ${t("name")}`,
    },
    icons: {
      icon: "/icon.svg",
    },
  }
}

export async function organizationJsonLd(lang: string) {
  const t = await getTranslations({ locale: lang })

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: t("name"),
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.svg"),
    description: t("footer_description"),
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    address: {
      "@type": "PostalAddress",
      ...SITE_ADDRESS,
    },
    areaServed: {
      "@type": "City",
      name: "Bridgeport",
      containedInPlace: {
        "@type": "State",
        name: "Connecticut",
      },
    },
  }
}

export async function webSiteJsonLd(lang: string) {
  const t = await getTranslations({ locale: lang })

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: t("name"),
    description: t("slogan"),
    url: absoluteUrl(pagePath(lang)),
    inLanguage: lang,
    publisher: {
      "@id": `${getSiteUrl()}/#organization`,
    },
  }
}

export function webPageJsonLd(
  lang: string,
  {
    path = "",
    name,
    description,
    type = "WebPage",
  }: {
    path?: string
    name: string
    description: string
    type?: string
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(pagePath(lang, path)),
    inLanguage: lang,
    isPartOf: {
      "@id": `${getSiteUrl()}/#website`,
    },
    about: {
      "@id": `${getSiteUrl()}/#organization`,
    },
  }
}

export function breadcrumbJsonLd(
  lang: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(pagePath(lang, item.path)),
    })),
  }
}

export function itemListJsonLd(
  lang: string,
  {
    name,
    description,
    items,
  }: {
    name: string
    description: string
    items: { name: string; url: string }[]
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

export function articleJsonLd(
  lang: string,
  {
    path,
    headline,
    description,
    image,
  }: {
    path: string
    headline: string
    description?: string
    image?: string
  },
) {
  const imageUrl = resolveOgImageUrl(image ?? getDefaultOgImage())

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(pagePath(lang, path)),
    inLanguage: lang,
    image: imageUrl,
    author: {
      "@id": `${getSiteUrl()}/#organization`,
    },
    publisher: {
      "@id": `${getSiteUrl()}/#organization`,
    },
    mainEntityOfPage: absoluteUrl(pagePath(lang, path)),
  }
}

export async function contactPageJsonLd(lang: string, name: string, description: string) {
  const t = await getTranslations({ locale: lang })

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url: absoluteUrl(pagePath(lang, "contact")),
    inLanguage: lang,
    mainEntity: {
      "@type": "Organization",
      "@id": `${getSiteUrl()}/#organization`,
      name: t("name"),
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      address: {
        "@type": "PostalAddress",
        ...SITE_ADDRESS,
      },
    },
  }
}
