import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { PlanListItem } from "@/components/plan-list-item"
import { PlanShareButton } from "@/components/plan-share-button"
import { Badge } from "@/components/ui/badge"
import { PlansFilterBar } from "@/components/plans-filter-bar"
import { isPlanCategoryFilter } from "@/lib/plan-categories"
import { getPlans } from "@/lib/plans"
import { absoluteUrl, pagePath } from "@/lib/site"
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo"
import { getTranslations, setRequestLocale } from "next-intl/server"

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
    path: "plans",
    title: t("plans_title"),
    description: t("plans_subtitle"),
  })
}

export default async function PlansPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ filter?: string }>
}) {
  const { lang } = await params
  const { filter: filterParam } = await searchParams
  setRequestLocale(lang)
  const t = await getTranslations()
  const allPlans = await getPlans(lang)
  const activeFilter =
    filterParam && isPlanCategoryFilter(filterParam) ? filterParam : undefined
  const plans = activeFilter
    ? allPlans.filter((plan) => plan.category === activeFilter)
    : allPlans

  const planItems = plans.map((plan) => ({
    name: plan.title,
    url: absoluteUrl(pagePath(lang, `plans/${plan.slug}`)),
  }))

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(lang, {
            path: "plans",
            name: t("plans_title"),
            description: t("plans_subtitle"),
            type: "CollectionPage",
          }),
          itemListJsonLd(lang, {
            name: t("plans_title"),
            description: t("plans_subtitle"),
            items: planItems,
          }),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("plans_title"), path: "plans" },
          ]),
        ]}
      />
      <div className="flex min-h-screen flex-col bg-background">
      <section className="flex-1 py-12">
        <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Badge variant="info">Plans</Badge>
            <h1 className="mt-6 mb-0 font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
              {t("plans_title")}
            </h1>
            <p className="mt-2 max-w-3xl text-lg text-muted-foreground">{t("plans_subtitle")}</p>
            <div className="mt-4">
              <PlanShareButton title={t("plans_title")} />
            </div>
          </div>

          <PlansFilterBar activeFilter={activeFilter} />

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            {plans.length > 0 ? (
              plans.map((plan) => <PlanListItem key={plan.slug} plan={plan} />)
            ) : (
              <p className="text-center text-muted-foreground">{t("plans_filter_empty")}</p>
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
