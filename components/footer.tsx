"use client"

import { useTranslations } from "next-intl"
import Logo from "@/components/logo"
import { Link } from "@/i18n/navigation"

const navLinks = [
  { href: "/plans", key: "topbar_ourPlans" as const },
  { href: "/about", key: "topbar_about" as const },
  { href: "/contact", key: "topbar_contact" as const },
  { href: "/volunteer", key: "topbar_volunteer" as const },
]

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-8 md:px-6">
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" aria-label={t("name")}>
            <Logo className="size-16" />
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-background/70 text-sm transition-colors hover:text-background"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-background/60 text-sm">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
