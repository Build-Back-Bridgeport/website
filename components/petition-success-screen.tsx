"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { useMemo } from "react"

const CONFETTI_COLORS = [
  "#ffffff",
  "#fde047",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#fb923c",
  "#c084fc",
  "#facc15",
]

interface PetitionSuccessScreenProps {
  title: string
  message: string
  signatureCount: number
  seePlansLabel: string
  signaturesLabel: string
}

export function PetitionSuccessScreen({
  title,
  message,
  signatureCount,
  seePlansLabel,
  signaturesLabel,
}: PetitionSuccessScreenProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        delay: `${(index % 12) * 0.15}s`,
        duration: `${2.2 + (index % 5) * 0.35}s`,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        rotation: `${(index * 47) % 360}deg`,
        width: 6 + (index % 4) * 3,
        height: 10 + (index % 3) * 4,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-primary px-6 py-12 text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="animate-petition-confetti absolute top-0 block rounded-sm opacity-90"
            style={{
              left: piece.left,
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              transform: `rotate(${piece.rotation})`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8 text-center md:max-w-xl">
        <div
          className={cn(
            "flex size-36 items-center justify-center rounded-full bg-primary-foreground shadow-2xl",
            "ring-8 ring-primary-foreground/25 md:size-44",
          )}
          role="img"
          aria-label="Success"
        >
          <CheckIcon
            className="size-20 stroke-[3] text-primary md:size-24"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-4xl tracking-tight md:text-5xl">{title}</h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed md:text-xl" role="status">
            {message}
          </p>
          <p className="text-primary-foreground/75 text-sm md:text-base">
            {signaturesLabel.replace("$$$", signatureCount.toLocaleString())}
          </p>
        </div>

        <Button
          size="lg"
          variant="secondary"
          className="h-14 min-w-[min(100%,16rem)] border-0 bg-primary-foreground px-8 text-lg font-semibold text-primary shadow-lg hover:bg-primary-foreground/90"
          render={<Link href="/plans" />}
        >
          {seePlansLabel}
        </Button>
      </div>
    </div>
  )
}
