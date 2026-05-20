import { defineRouting } from "next-intl/routing"
import { SUPPORTED_LANGS } from "@/lib/site"

export const routing = defineRouting({
  locales: SUPPORTED_LANGS,
  defaultLocale: "en",
  localePrefix: "always",
})
