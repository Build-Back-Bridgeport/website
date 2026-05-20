"use client"

import { CheckIcon, Share2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getPathname } from "@/i18n/navigation"

export function VolunteerShareButton() {
  const t = useTranslations()
  const locale = useLocale()
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    const homePath = getPathname({ href: "/", locale })
    setShareUrl(`${window.location.origin}${homePath}`)
    setCanNativeShare(typeof navigator.share === "function")
  }, [locale])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may be unavailable in some contexts.
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: document.title,
        url: shareUrl,
      })
    } catch {
      // User dismissed the share sheet.
    }
  }

  if (canNativeShare) {
    return (
      <Button type="button" className="w-full" onClick={handleNativeShare}>
        <Share2Icon aria-hidden="true" />
        {t("volunteer_option_share_cta")}
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger
        render={<Button type="button" className="w-full" />}
      >
        <Share2Icon aria-hidden="true" />
        {t("volunteer_option_share_cta")}
      </PopoverTrigger>
      <PopoverPopup align="center" sideOffset={8} className="w-80 p-4">
        <PopoverTitle>{t("share_title")}</PopoverTitle>
        <PopoverDescription className="mb-3">
          {t("share_description")}
        </PopoverDescription>
        <InputGroup>
          <InputGroupInput readOnly value={shareUrl} aria-label={t("share_link_label")} />
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              aria-label={copied ? t("share_copied") : t("share_copy")}
            >
              {copied ? <CheckIcon aria-hidden /> : t("share_copy")}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </PopoverPopup>
    </Popover>
  )
}
