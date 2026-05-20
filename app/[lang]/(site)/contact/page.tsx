import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { Badge } from "@/components/ui/badge"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { buildPageMetadata, breadcrumbJsonLd, contactPageJsonLd } from "@/lib/seo"
import { SITE_EMAIL, SITE_PHONE } from "@/lib/site"
import { MailIcon, PhoneIcon } from "lucide-react"

const SITE_PHONE_DISPLAY = "(203) 555-0123"

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
    path: "contact",
    title: t("contact_title"),
    description: t("contact_response_note"),
  })
}

export default async function ContactPage({
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
          await contactPageJsonLd(lang, t("contact_title"), t("contact_response_note")),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("contact_title"), path: "contact" },
          ]),
        ]}
      />
      <div className="flex min-h-screen flex-col bg-background">
        <section className="py-12 md:py-16">
          <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <Badge variant="info">{t("contact_badge")}</Badge>
              <h1 className="max-w-3xl font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
                {t("contact_title")}
              </h1>
            </div>

            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-12 md:items-start">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("contact_response_note")}
              </p>

              <div className="flex flex-col gap-6">
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
                  {SITE_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
