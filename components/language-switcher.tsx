"use client"

import { GlobeIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { buttonVariants } from "@/components/ui/button"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "en", labelKey: "english" as const },
  { code: "es", labelKey: "spanish" as const },
  { code: "pt", labelKey: "portuguese" as const },
  { code: "ht", labelKey: "haitian" as const },
] as const

export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()

  return (
    <Menu className={className}>
      <MenuTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        aria-label={t("languageLabel")}
      >
        <GlobeIcon aria-hidden />
        <span className="uppercase">{locale}</span>
      </MenuTrigger>
      <MenuPopup align="end" sideOffset={8}>
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            className={locale === language.code ? "font-medium" : undefined}
            onClick={() =>
              router.replace(pathname, {
                locale: language.code as (typeof routing.locales)[number],
              })
            }
          >
            {t(language.labelKey)}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
