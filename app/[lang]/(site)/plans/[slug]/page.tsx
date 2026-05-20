import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { PlanShareButton } from "@/components/plan-share-button"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { PlanThumbnail } from "@/components/plan-thumbnail"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import ReactMarkdown from "react-markdown"
import { getPlanBySlug, stripPlanFrontmatter } from "@/lib/plans"
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo"

interface PlanPageProps {
  params: Promise<{
    lang: string
    slug: string
  }>
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  setRequestLocale(lang)
  const t = await getTranslations()
  const planData = await getPlanBySlug(slug, lang)

  if (!planData) {
    return buildPageMetadata({
      lang,
      path: `plans/${slug}`,
      title: t("planNotFound"),
      description: t("plans_subtitle"),
      noIndex: true,
    })
  }

  return buildPageMetadata({
    lang,
    path: `plans/${slug}`,
    title: planData.title,
    description: planData.description ?? planData.excerpt ?? t("plans_subtitle"),
    image: planData.thumbnail,
    imageAlt: planData.title,
    type: "article",
  })
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { lang, slug } = await params
  setRequestLocale(lang)
  const t = await getTranslations()
  const planData = await getPlanBySlug(slug, lang)

  if (!planData) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <section className="flex-1 py-12">
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-12 text-center md:px-6">
            <p className="text-destructive-foreground">{t("planNotFound")}</p>
            <Button variant="ghost" render={<Link href="/plans" />}>
              <ChevronLeftIcon aria-hidden="true" />
              {t("button_backToPlans")}
            </Button>
          </div>
        </section>
      </div>
    )
  }

  const planPath = `plans/${slug}`

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(lang, {
            path: planPath,
            headline: planData.title,
            description: planData.description ?? planData.excerpt,
            image: planData.thumbnail,
          }),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("plans_title"), path: "plans" },
            { name: planData.title, path: planPath },
          ]),
        ]}
      />
      <div className="flex min-h-screen flex-col bg-background">
      <section className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/plans" />}
            >
              <ChevronLeftIcon aria-hidden="true" />
              {t("button_backToPlans")}
            </Button>
            <PlanShareButton title={planData.title} />
          </div>

          <header className="mb-10 flex flex-col">
            <PlanThumbnail
              src={planData.thumbnail ?? "/placeholder.svg"}
              alt={planData.title}
              variant="banner"
              priority
            />
            <div className="mt-4 flex flex-col gap-2">
              <h1 className="mb-0 font-semibold text-3xl text-foreground tracking-tight md:text-4xl">
                {planData.title}
              </h1>
              {planData.description ? (
                <p className="text-lg text-muted-foreground">{planData.description}</p>
              ) : null}
            </div>
          </header>

          <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
            <ReactMarkdown>
              {planData.content ? stripPlanFrontmatter(planData.content) : ""}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </div>
    </>
  )
}
