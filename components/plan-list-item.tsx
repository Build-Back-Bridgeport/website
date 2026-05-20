import { getTranslations } from "next-intl/server"
import { PlanThumbnail } from "@/components/plan-thumbnail"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { Plan } from "@/lib/plans"

export async function PlanListItem({ plan }: { plan: Plan }) {
  const t = await getTranslations()

  return (
    <article className="border-b pb-8 last:border-b-0 last:pb-0">
      <Link href={`/plans/${plan.slug}`} className="mb-16 block">
        <PlanThumbnail
          src={plan.thumbnail ?? "/placeholder.svg"}
          alt={plan.title}
          variant="card"
        />
      </Link>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="mb-0 font-semibold text-2xl text-foreground tracking-tight">
            <Link href={`/plans/${plan.slug}`} className="hover:text-primary">
              {plan.title}
            </Link>
          </h2>
          {plan.description ? (
            <p className="text-muted-foreground">{plan.description}</p>
          ) : null}
          {plan.excerpt ? (
            <p className="line-clamp-3 text-muted-foreground text-sm">{plan.excerpt}</p>
          ) : null}
        </div>
        <Button size="sm" className="w-fit" render={<Link href={`/plans/${plan.slug}`} />}>
          {t("readMore")}
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
