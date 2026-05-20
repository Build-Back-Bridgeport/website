import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const IMAGES = [
  { src: "/images/3.jpg", altKey: "about_image_past_alt" },
  { src: "/images/4.jpg", altKey: "about_image_decline_alt" },
  { src: "/images/8.jpg", altKey: "about_image_hope_alt" },
] as const

type AboutSectionProps = {
  variant?: "compact" | "full"
  showBadge?: boolean
  id?: string
}

export async function AboutSection({
  variant = "compact",
  showBadge = false,
  id = "about",
}: AboutSectionProps) {
  const t = await getTranslations()
  const isFull = variant === "full"

  const paragraphs = isFull
    ? [
        "about_past_p1",
        "about_past_p2",
        "about_decline_p1",
        "about_decline_p2",
        "about_corruption_p1",
        "about_corruption_p2",
        "about_hope_p1",
        "about_hope_p2",
      ]
    : ["about_compact_p1", "about_compact_p2", "about_compact_p3"]

  const imageAfterIndex = isFull ? [1, 3, 5] : [0, 1, 2]

  return (
    <section id={id} className={cn("py-20", isFull ? "bg-background" : "bg-muted/30")}>
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          {showBadge ? <Badge variant="info">{t("about_badge")}</Badge> : null}
          {isFull && showBadge ? (
            <h1 className="font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
              {t("about_title")}
            </h1>
          ) : (
            <h2 className="font-semibold text-3xl text-foreground tracking-tight md:text-4xl">
              {t("about_title")}
            </h2>
          )}
          <p className="text-lg text-muted-foreground leading-relaxed">{t("about_subtitle")}</p>
        </div>

        <blockquote className="mb-10 border-primary border-l-4 pl-6 font-medium text-foreground text-xl leading-snug md:text-2xl">
          {t("about_hope_quote")}
        </blockquote>

        <article className="flex flex-col gap-8">
          {paragraphs.map((key, index) => (
            <div key={key} className="flex flex-col gap-8">
              <p className="text-muted-foreground leading-relaxed md:text-lg">{t(key)}</p>
              {imageAfterIndex.includes(index) ? (
                <figure className="overflow-hidden rounded-xl">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={IMAGES[imageAfterIndex.indexOf(index)].src}
                      alt={t(IMAGES[imageAfterIndex.indexOf(index)].altKey)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                      priority={index === 0}
                    />
                  </div>
                </figure>
              ) : null}
            </div>
          ))}
        </article>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button render={<Link href="/plans" />}>
            {t("about_plans_cta")}
            <ArrowRightIcon aria-hidden="true" />
          </Button>
          {!isFull ? (
            <Button variant="outline" render={<Link href="/about" />}>
              {t("about_learn_more")}
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="outline" render={<Link href="/volunteer" />}>
              {t("topbar_getInvolved")}
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
