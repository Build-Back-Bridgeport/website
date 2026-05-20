"use client"

import { MenuIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import LanguageSwitcher from "@/components/language-switcher"
import Logo from "@/components/logo"
import { Link } from "@/i18n/navigation"

const navLinks = [
  { href: "/plans", key: "topbar_ourPlans" as const },
  { href: "/about", key: "topbar_about" as const },
  { href: "/contact", key: "topbar_contact" as const },
]

export default function Header() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:h-24 md:px-6">
        <div className="flex items-center gap-2 md:gap-0">
          <Link href="/" className="flex items-center gap-4">
            <Logo className="size-16 md:size-20" />
            <div className="hidden flex-col gap-0.5 md:flex">
              <p className="font-semibold text-foreground text-xl md:text-2xl">{t("name")}</p>
              <p className="text-muted-foreground text-sm">{t("slogan")}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              render={<Link href={link.href} />}
            >
              {t(link.key)}
            </Button>
          ))}
          <Button size="sm" render={<Link href="/volunteer" />}>
            {t("topbar_getInvolved")}
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Drawer position="left">
            <DrawerTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon aria-hidden="true" />
            </DrawerTrigger>
            <DrawerPopup>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <DrawerPanel className="flex flex-col gap-1 p-2">
                {navLinks.map((link) => (
                  <DrawerClose
                    key={link.href}
                    render={
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        render={<Link href={link.href} />}
                      />
                    }
                  >
                    {t(link.key)}
                  </DrawerClose>
                ))}
                <DrawerClose
                  render={
                    <Button
                      className="mt-2 w-full"
                      render={<Link href="/volunteer" />}
                    />
                  }
                >
                  {t("topbar_getInvolved")}
                </DrawerClose>
              </DrawerPanel>
            </DrawerPopup>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
