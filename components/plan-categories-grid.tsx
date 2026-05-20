import { Link } from "@/i18n/navigation"
import { PLAN_CATEGORIES } from "@/lib/plan-categories"
import { getTranslations } from "next-intl/server"

export async function PlanCategoriesGrid() {
  const t = await getTranslations()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {PLAN_CATEGORIES.map(({ filter, titleKey, icon: Icon }) => (
        <Link
          key={filter}
          href="/plans"
          query={{ filter }}
          className="flex min-h-44 flex-col items-start justify-end gap-4 rounded-xl bg-primary p-6 text-primary-foreground transition-opacity hover:opacity-90 md:min-h-52 md:p-8"
        >
          <Icon className="size-8 shrink-0 md:size-9" aria-hidden="true" />
          <h3 className="font-semibold text-lg leading-snug md:text-xl">{t(titleKey)}</h3>
        </Link>
      ))}
    </div>
  )
}
