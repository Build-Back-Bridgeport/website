"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { formatSignatureCount } from "@/lib/format-signature-count"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

const heroGroupControlClass =
  "!h-14 !text-lg [&_[data-slot=input]]:!h-14 [&_[data-slot=input]]:!px-4 [&_[data-slot=input]]:!text-lg"

const SIGNATURE_COUNT_THRESHOLD = 500
const SIGNATURES_NEEDED_TO_RUN = 600

interface PetitionHeroProps {
  initialCount: number
  locale: string
}

export function PetitionHero({ initialCount, locale }: PetitionHeroProps) {
  const t = useTranslations()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [showError, setShowError] = useState(false)

  const formattedCount = formatSignatureCount(initialCount, locale)
  const showProgress = initialCount < SIGNATURE_COUNT_THRESHOLD
  const progressPercent = Math.ceil(
    (initialCount / SIGNATURES_NEEDED_TO_RUN) * 100,
  )
  const formattedPercent = progressPercent.toLocaleString(locale)

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    setShowError(false)

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setShowError(true)
      return
    }

    router.push(`/pledge?email=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
      <h1 className="max-w-4xl text-balance font-semibold text-4xl text-foreground tracking-tight md:text-6xl">
        {showProgress
          ? t.rich("hero_signatures_progress", {
              percent: () => (
                <span className="text-primary tabular-nums">{formattedPercent}%</span>
              ),
            })
          : t.rich("hero_signatures", {
              count: () => (
                <span className="text-primary tabular-nums">{formattedCount}</span>
              ),
            })}
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
        {t("hero_description")}
      </p>

      <form onSubmit={handleContinue} className="w-full max-w-xl md:max-w-2xl">
        <Group className="w-full">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setShowError(false)
            }}
            placeholder={t("hero_email_placeholder")}
            required
            autoComplete="email"
            className={cn(
              "min-w-0 flex-1",
              heroGroupControlClass,
              "has-[[data-slot=input]:not(:placeholder-shown)]:!bg-white has-autofill:!bg-white [&_[data-slot=input]]:-webkit-autofill:shadow-[inset_0_0_0_1000px_white] [&_[data-slot=input]]:-webkit-autofill:[-webkit-text-fill-color:var(--foreground)]",
            )}
          />
          <Button
            type="submit"
            className={cn("shrink-0 px-6", heroGroupControlClass)}
          >
            {t("hero_sign_button")}
          </Button>
        </Group>
        {showError && (
          <p className="mt-3 text-destructive text-sm" role="alert">
            {t("hero_sign_error")}
          </p>
        )}
      </form>
    </div>
  )
}
