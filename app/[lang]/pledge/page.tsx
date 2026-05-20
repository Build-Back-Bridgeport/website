import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/json-ld"
import { PetitionFlow } from "@/components/petition-flow"
import { getSignatureCount } from "@/lib/petition"
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
    path: "pledge",
    title: t("pledge_step_name_title"),
    description: t("pledge_subtitle"),
  })
}

export default async function PledgePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { lang } = await params
  const { email } = await searchParams
  setRequestLocale(lang)
  const t = await getTranslations()
  const signatureCount = await getSignatureCount()

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(lang, {
            name: t("pledge_step_name_title"),
            description: t("pledge_subtitle"),
          }),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("pledge_step_name_title"), path: "pledge" },
          ]),
        ]}
      />
      <PetitionFlow initialCount={signatureCount} initialEmail={email} />
    </>
  )
}
