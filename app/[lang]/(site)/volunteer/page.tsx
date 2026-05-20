import type { Metadata } from "next"
import Image from "next/image"
import {
  DoorOpenIcon,
  Share2Icon,
  UsersIcon,
} from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/json-ld"
import { VolunteerShareButton } from "@/components/volunteer-share-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buildPageMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo"
import { SITE_EMAIL } from "@/lib/site"

const CANVASS_MAIL_SUBJECT = "Volunteer — Flyers and Door Knocking"
const LEADER_MAIL_SUBJECT = "Volunteer — Neighborhood Leader"

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
    path: "volunteer",
    title: t("volunteer_title"),
    description: t("volunteer_subtitle"),
    image: "/images/yard-sign.png",
    imageAlt: t("volunteer_image_alt"),
  })
}

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations()

  const options = [
    {
      icon: Share2Icon,
      titleKey: "volunteer_option_share_title" as const,
      descKey: "volunteer_option_share_desc" as const,
      action: "share" as const,
    },
    {
      icon: DoorOpenIcon,
      titleKey: "volunteer_option_canvass_title" as const,
      descKey: "volunteer_option_canvass_desc" as const,
      action: "canvass" as const,
      ctaKey: "volunteer_option_canvass_cta" as const,
      mailSubject: CANVASS_MAIL_SUBJECT,
    },
    {
      icon: UsersIcon,
      titleKey: "volunteer_option_leader_title" as const,
      descKey: "volunteer_option_leader_desc" as const,
      action: "leader" as const,
      ctaKey: "volunteer_option_leader_cta" as const,
      mailSubject: LEADER_MAIL_SUBJECT,
    },
  ]

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(lang, {
            path: "volunteer",
            name: t("volunteer_title"),
            description: t("volunteer_subtitle"),
          }),
          breadcrumbJsonLd(lang, [
            { name: t("name"), path: "" },
            { name: t("volunteer_title"), path: "volunteer" },
          ]),
        ]}
      />
      <div className="flex min-h-screen flex-col bg-background">
        <section className="py-12 md:py-16">
          <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <Badge variant="info">{t("volunteer_badge")}</Badge>
              <h1 className="max-w-3xl font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
                {t("volunteer_title")}
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {t("volunteer_subtitle")}
              </p>
            </div>

            <figure className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
                <Image
                  src="/images/yard-sign.png"
                  alt={t("volunteer_image_alt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            </figure>

            <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-3">
              {options.map((option) => {
                const Icon = option.icon

                return (
                  <Card key={option.titleKey} className="flex flex-col">
                    <CardHeader className="flex-1">
                      <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <CardTitle>{t(option.titleKey)}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t(option.descKey)}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                      {option.action === "share" ? (
                        <VolunteerShareButton />
                      ) : (
                        <Button
                          className="w-full"
                          render={
                            <a
                              href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(option.mailSubject)}`}
                            />
                          }
                        >
                          {t(option.ctaKey)}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            <p className="mx-auto max-w-2xl text-center text-muted-foreground text-sm leading-relaxed">
              {t("contact_response_note")}
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
