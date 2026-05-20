import { getTranslations } from "next-intl/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { PlanThumbnail } from "@/components/plan-thumbnail"
import { Link } from "@/i18n/navigation"

interface Plan {
  slug: string
  title: string
  description?: string
  excerpt?: string
  thumbnail?: string
}

export default async function PlanCard({ plan }: { plan: Plan }) {
  const t = await getTranslations()

  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <PlanThumbnail
        src={plan.thumbnail ?? "/placeholder.svg"}
        alt={plan.title}
        variant="card"
        className="rounded-t-xl rounded-b-none"
      />
      <CardHeader>
        <CardTitle className="line-clamp-3 text-xl">{plan.title}</CardTitle>
        {plan.description ? (
          <CardDescription className="text-base">{plan.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {plan.excerpt ? (
          <p className="line-clamp-3 text-muted-foreground text-sm">{plan.excerpt}</p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button className="w-full" render={<Link href={`/plans/${plan.slug}`} />}>
          {t("readMore")}
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}
