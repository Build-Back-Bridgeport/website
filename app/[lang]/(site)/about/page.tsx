import type { Metadata } from "next"
import { AboutSection } from "@/components/about-section"
import { JsonLd } from "@/components/json-ld"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations()

  return buildPageMetadata({
    lang,
    path: "about",
    title: t("about_title"),
    description: t("about_subtitle"),
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations()

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(lang, {
            path: "about",
            name: t("about_title"),
            description: t("about_subtitle"),
            type: "AboutPage",
          }),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("about_title"), path: "about" },
          ]),
        ]}
      />
      <div className="flex min-h-screen flex-col bg-background">
        <AboutSection variant="full" showBadge />
      </div>
    </>
  )
}
