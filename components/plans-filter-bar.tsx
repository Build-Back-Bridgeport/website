import { Link } from "@/i18n/navigation"
import { PLAN_CATEGORIES } from "@/lib/plan-categories"
import type { PlanCategoryFilter } from "@/lib/plan-categories"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

type PlansFilterBarProps = {
  activeFilter?: PlanCategoryFilter
}

export async function PlansFilterBar({ activeFilter }: PlansFilterBarProps) {
  const t = await getTranslations()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link
        href="/plans"
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !activeFilter
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-foreground hover:border-primary/30",
        )}
      >
        {t("plans_filter_all")}
      </Link>
      {PLAN_CATEGORIES.map(({ filter, titleKey }) => (
        <Link
          key={filter}
          href="/plans"
          query={{ filter }}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeFilter === filter
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary/30",
          )}
        >
          {t(titleKey)}
        </Link>
      ))}
    </div>
  )
}
