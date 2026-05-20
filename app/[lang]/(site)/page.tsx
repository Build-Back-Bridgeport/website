import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { AboutSection } from "@/components/about-section"
import { PetitionHero } from "@/components/petition-hero"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSignatureCount } from "@/lib/petition"
import { PlanCategoriesGrid } from "@/components/plan-categories-grid"
import { MailIcon, PhoneIcon } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { buildPageMetadata, webPageJsonLd } from "@/lib/seo"
import { SITE_EMAIL, SITE_PHONE } from "@/lib/site"

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
    title: t("hero_title"),
    description: t("hero_description"),
  })
}

const stats = [
  { label: "Community Meetings Held", value: "47" },
  { label: "Residents Engaged", value: "2,300+" },
  { label: "Neighborhoods Visited", value: "15" },
  { label: "Local Endorsements", value: "89" },
]

export default async function Component({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations()
  const signatureCount = await getSignatureCount()

  const localeMap: Record<string, string> = {
    en: "en-US",
    es: "es-US",
    pt: "pt-BR",
    ht: "ht-HT",
  }

  return (
    <>
      <JsonLd
        data={webPageJsonLd(lang, {
          name: t("hero_title"),
          description: t("hero_description"),
        })}
      />
      <div className="flex min-h-screen flex-col bg-background">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 bg-[url('/images/0.jpg')] bg-cover bg-center bg-no-repeat"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
        <div className="container relative z-10 mx-auto flex flex-col items-center gap-8 px-4 text-center md:px-6">
          <Badge variant="info">{t("hero_badge")}</Badge>
          <PetitionHero
            initialCount={signatureCount}
            locale={localeMap[lang] ?? "en-US"}
          />
        </div>
      </section>

      <section id="plans" className="py-20">
        <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-semibold text-3xl text-foreground tracking-tight md:text-4xl">
              {t("plans_title")}
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">{t("plans_subtitle")}</p>
          </div>

          <PlanCategoriesGrid />

          <div className="flex justify-center">
            <Button size="lg" variant="outline" render={<Link href="/plans" />}>
              {t("see_all_plans")}
            </Button>
          </div>
        </div>
      </section>

      <AboutSection variant="compact" />

      <section id="contact" className="py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <h2 className="font-semibold text-3xl text-foreground tracking-tight md:text-4xl">
              {t("contact_title")}
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
            >
              <MailIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {SITE_EMAIL}
            </a>
            <a
              href={`tel:${SITE_PHONE}`}
              className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
            >
              <PhoneIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              (203) 555-0123
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
