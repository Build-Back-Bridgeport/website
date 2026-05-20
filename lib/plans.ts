import fs from "fs/promises"
import path from "path"
import { getPrisma, isDatabaseConfigured } from "@/lib/db"
import {
  isPlanCategoryFilter,
  type PlanCategoryFilter,
} from "@/lib/plan-categories"

export interface Plan {
  slug: string
  title: string
  description?: string
  excerpt?: string
  thumbnail?: string
  content?: string
  category?: PlanCategoryFilter
}

const DEFAULT_PLAN_CATEGORIES: Record<string, PlanCategoryFilter> = {
  regions: "commercial",
  "stratford-merger": "commercial",
}

function parsePlanCategory(content: string, slug: string): PlanCategoryFilter | undefined {
  const categoryLine = content
    .split("\n")
    .find((line) => line.trim().toLowerCase().startsWith("category:"))

  if (categoryLine) {
    const value = categoryLine.split(":")[1]?.trim().toLowerCase()
    if (value && isPlanCategoryFilter(value)) {
      return value
    }
  }

  return DEFAULT_PLAN_CATEGORIES[slug]
}

function parsePlanFromMarkdown(slug: string, markdown: string, thumbnail: string): Plan {
  const planData = markdown.split("\n")
  const dbCategory = parsePlanCategory(markdown, slug)

  return {
    slug,
    title: planData[0]?.replace("# ", "") ?? "",
    description: planData[1]?.replace("## ", ""),
    excerpt: planData[2]?.replace("## ", ""),
    thumbnail,
    content: markdown,
    category: dbCategory,
  }
}

const THUMBNAIL_EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const

const DEFAULT_PLAN_THUMBNAILS: Record<string, string> = {
  regions: unsplashPhoto("1560518883-ce09059eeffa"),
  "stratford-merger": unsplashPhoto("1449824913935-59a10b8d2000"),
}

const DEFAULT_THUMBNAIL = unsplashPhoto("1480714378408-67e0d46b5bae")

function unsplashPhoto(
  id: string,
  { width = 1200, height = 630 }: { width?: number; height?: number } = {},
) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

async function getPlanThumbnail(slug: string): Promise<string> {
  for (const extension of THUMBNAIL_EXTENSIONS) {
    const filePath = path.join(process.cwd(), "public", "plans", `${slug}.${extension}`)

    try {
      await fs.access(filePath)
      return `/plans/${slug}.${extension}`
    } catch {
      continue
    }
  }

  return DEFAULT_PLAN_THUMBNAILS[slug] ?? DEFAULT_THUMBNAIL
}

function resolveCategory(
  slug: string,
  markdown: string,
  storedCategory: string | null | undefined,
): PlanCategoryFilter | undefined {
  if (storedCategory && isPlanCategoryFilter(storedCategory)) {
    return storedCategory
  }

  return parsePlanCategory(markdown, slug)
}

async function getPlansFromDatabase(lang: string): Promise<Plan[]> {
  const prisma = getPrisma()
  const rows = await prisma.plan.findMany({
    where: {
      translations: {
        some: { lang },
      },
    },
    include: {
      translations: {
        where: { lang },
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  })

  return Promise.all(
    rows.map(async (row) => {
      const translation = row.translations[0]
      const markdown = translation?.markdown ?? ""
      const thumbnail = await getPlanThumbnail(row.slug)
      const plan = parsePlanFromMarkdown(row.slug, markdown, thumbnail)

      return {
        ...plan,
        category: resolveCategory(row.slug, markdown, row.category),
      }
    }),
  )
}

async function getPlansFromFiles(lang: string): Promise<Plan[]> {
  let planFiles = await fs.readdir(path.join(process.cwd(), "data", "plans", lang))

  planFiles = planFiles.filter((file: string) => file.endsWith(".md"))

  const plans: Plan[] = await Promise.all(
    planFiles.map(async (file: string) => {
      const slug = file.replace(".md", "")
      const markdown = await fs.readFile(
        path.join(process.cwd(), "data", "plans", lang, file),
        "utf8",
      )
      const thumbnail = await getPlanThumbnail(slug)

      return parsePlanFromMarkdown(slug, markdown, thumbnail)
    }),
  )

  return plans
}

export async function getPlanBySlug(slug: string, lang = "en"): Promise<Plan | null> {
  if (isDatabaseConfigured()) {
    const prisma = getPrisma()
    const row = await prisma.plan.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { lang },
          take: 1,
        },
      },
    })

    if (!row?.translations[0]) {
      return null
    }

    const markdown = row.translations[0].markdown
    const thumbnail = await getPlanThumbnail(slug)
    const plan = parsePlanFromMarkdown(slug, markdown, thumbnail)

    return {
      ...plan,
      category: resolveCategory(slug, markdown, row.category),
    }
  }

  const plans = await getPlansFromFiles(lang)
  return plans.find((plan) => plan.slug === slug) ?? null
}

export async function getPlans(lang = "en"): Promise<Plan[]> {
  if (isDatabaseConfigured()) {
    return getPlansFromDatabase(lang)
  }

  return getPlansFromFiles(lang)
}

/** Removes title, description, and excerpt headings from plan markdown body. */
export function stripPlanFrontmatter(content: string): string {
  const lines = content.split("\n")
  let headersSkipped = 0
  let index = 0

  while (index < lines.length && headersSkipped < 3) {
    const line = lines[index]

    if (line.startsWith("#")) {
      headersSkipped += 1
      index += 1
      continue
    }

    if (line.trim() === "" && headersSkipped > 0) {
      index += 1
      continue
    }

    break
  }

  return lines.slice(index).join("\n").trimStart()
}
