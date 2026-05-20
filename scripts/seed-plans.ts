import "dotenv/config"
import fs from "fs/promises"
import path from "path"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { PrismaClient } from "../lib/generated/prisma/client"
import { SUPPORTED_LANGS } from "../lib/site"
import {
  isPlanCategoryFilter,
  type PlanCategoryFilter,
} from "../lib/plan-categories"

const DEFAULT_PLAN_CATEGORIES: Record<string, PlanCategoryFilter> = {
  regions: "commercial",
  "stratford-merger": "commercial",
}

const PLAN_SORT_ORDER: Record<string, number> = {
  regions: 0,
  "stratford-merger": 1,
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

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const plansDir = path.join(process.cwd(), "data", "plans")
  const slugs = new Set<string>()

  for (const lang of SUPPORTED_LANGS) {
    const langDir = path.join(plansDir, lang)
    let files: string[]

    try {
      files = await fs.readdir(langDir)
    } catch {
      console.warn(`Skipping missing plans directory: ${langDir}`)
      continue
    }

    for (const file of files.filter((name) => name.endsWith(".md"))) {
      slugs.add(file.replace(/\.md$/, ""))
    }
  }

  for (const slug of [...slugs].sort()) {
    const category = DEFAULT_PLAN_CATEGORIES[slug]
    const plan = await prisma.plan.upsert({
      where: { slug },
      create: {
        slug,
        category,
        sortOrder: PLAN_SORT_ORDER[slug] ?? 0,
      },
      update: {
        category,
        sortOrder: PLAN_SORT_ORDER[slug] ?? 0,
      },
    })

    for (const lang of SUPPORTED_LANGS) {
      const filePath = path.join(plansDir, lang, `${slug}.md`)

      try {
        const markdown = await fs.readFile(filePath, "utf8")
        const parsedCategory = parsePlanCategory(markdown, slug)

        if (parsedCategory && parsedCategory !== plan.category) {
          await prisma.plan.update({
            where: { id: plan.id },
            data: { category: parsedCategory },
          })
        }

        await prisma.planTranslation.upsert({
          where: {
            planId_lang: {
              planId: plan.id,
              lang,
            },
          },
          create: {
            planId: plan.id,
            lang,
            markdown,
          },
          update: { markdown },
        })

        console.log(`Seeded ${slug} (${lang})`)
      } catch {
        console.warn(`Skipping missing file: ${filePath}`)
      }
    }
  }

  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
