import {
  Building2,
  Eye,
  GraduationCap,
  Heart,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react"

export const PLAN_CATEGORY_FILTERS = [
  "education",
  "commercial",
  "power",
  "transparency",
  "crime",
  "pride",
] as const

export type PlanCategoryFilter = (typeof PLAN_CATEGORY_FILTERS)[number]

export function isPlanCategoryFilter(value: string): value is PlanCategoryFilter {
  return (PLAN_CATEGORY_FILTERS as readonly string[]).includes(value)
}

export const PLAN_CATEGORIES: {
  filter: PlanCategoryFilter
  titleKey: string
  icon: LucideIcon
}[] = [
  { filter: "education", titleKey: "plan_category_education", icon: GraduationCap },
  { filter: "commercial", titleKey: "plan_category_commercial", icon: Building2 },
  { filter: "power", titleKey: "plan_category_power", icon: Users },
  { filter: "transparency", titleKey: "plan_category_transparency", icon: Eye },
  { filter: "crime", titleKey: "plan_category_crime", icon: Shield },
  { filter: "pride", titleKey: "plan_category_pride", icon: Heart },
]
