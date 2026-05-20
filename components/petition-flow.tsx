"use client"

import { AddressAutocomplete } from "@/components/address-autocomplete"
import { PetitionSuccessScreen } from "@/components/petition-success-screen"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface PetitionFlowProps {
  initialCount: number
  initialEmail?: string
}

type Step = "email" | "name" | "address" | "voter" | "volunteer" | "success" | "already"

const shellClassName =
  "mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-5 py-8 pb-10 md:max-w-xl md:gap-10 md:px-8 md:py-12 lg:max-w-2xl"

const inputClassName =
  "!h-16 !min-h-16 w-full !text-xl sm:!text-xl [&_[data-slot=input]]:!h-16 [&_[data-slot=input]]:!min-h-16 [&_[data-slot=input]]:!px-5 [&_[data-slot=input]]:!text-xl [&_[data-slot=input]]:!leading-normal md:[&_[data-slot=input]]:!text-xl"

const labelClassName = "text-lg font-medium md:text-xl"

const primaryButtonClassName = "h-16 w-full text-xl font-semibold md:text-xl"

const ghostButtonClassName = "h-12 w-full text-lg md:text-xl"

const pageTitleClassName =
  "text-balance font-semibold text-3xl text-foreground leading-tight tracking-tight md:text-4xl"

const pageDescriptionClassName =
  "text-base text-muted-foreground leading-relaxed md:text-lg"

function isValidEmail(value: string): boolean {
  const trimmed = value.trim()
  return Boolean(trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
}

export function PetitionFlow({ initialCount, initialEmail = "" }: PetitionFlowProps) {
  const t = useTranslations()
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [step, setStep] = useState<Step>(isValidEmail(initialEmail) ? "name" : "email")
  const [email, setEmail] = useState(isValidEmail(initialEmail) ? initialEmail.trim() : "")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [registeredToVote, setRegisteredToVote] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  const continueLabel = t("hero_continue_button")
  const backLabel = t("pledge_back_button")

  function handleEmailContinue(e: React.FormEvent) {
    e.preventDefault()
    setShowError(false)

    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setShowError(true)
      return
    }

    router.push(`/pledge?email=${encodeURIComponent(trimmed)}`)
    setStep("name")
  }

  function handleNameContinue(e: React.FormEvent) {
    e.preventDefault()
    setShowError(false)

    if (!firstName.trim() || !lastName.trim()) {
      setShowError(true)
      return
    }

    setStep("address")
  }

  function handleAddressContinue(e: React.FormEvent) {
    e.preventDefault()
    setShowError(false)

    if (!address.trim() || address.trim().length < 5) {
      setShowError(true)
      return
    }

    setStep("voter")
  }

  function handleVoterChoice(value: boolean) {
    setShowError(false)
    setRegisteredToVote(value)
    setStep("volunteer")
  }

  async function submitPledge(willingToVolunteer: boolean) {
    if (registeredToVote === null) return

    setShowError(false)
    setSubmitting(true)

    try {
      const res = await fetch("/api/petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          address: address.trim(),
          registeredToVote,
          willingToVolunteer,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setShowError(true)
        return
      }

      setCount(data.count)
      setStep(data.alreadySigned ? "already" : "success")
    } catch {
      setShowError(true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleBack() {
    setShowError(false)
    if (step === "email") {
      router.back()
      return
    }
    if (step === "name") {
      if (isValidEmail(initialEmail)) {
        router.back()
      } else {
        setStep("email")
      }
      return
    }
    if (step === "address") setStep("name")
    if (step === "voter") setStep("address")
    if (step === "volunteer") setStep("voter")
  }

  const pageTitle =
    step === "email"
      ? t("pledge_step_email_title")
      : step === "name"
        ? t("pledge_step_name_title")
        : step === "address"
          ? t("pledge_step_address_title")
          : step === "voter"
            ? t("pledge_step_voter_title")
            : step === "volunteer"
              ? t("pledge_step_volunteer_title")
              : t("pledge_step_success_title")

  const pageDescription =
    step === "email"
      ? t("pledge_step_email_desc")
      : step === "name"
        ? t("pledge_step_name_desc")
        : step === "address"
          ? t("pledge_step_address_desc")
          : step === "voter"
            ? t("pledge_step_voter_desc")
            : step === "volunteer"
              ? t("pledge_step_volunteer_desc")
              : null

  if (step === "success" || step === "already") {
    return (
      <PetitionSuccessScreen
        title={t("pledge_step_success_title")}
        message={
          step === "success" ? t("pledge_form_success") : t("pledge_form_already")
        }
        signatureCount={count}
        seePlansLabel={t("pledge_success_see_plans")}
        signaturesLabel={t("pledge_success_pledges")}
      />
    )
  }

  return (
    <div className={shellClassName}>
      <header className="flex flex-col gap-3 text-left md:gap-4">
        <h1 className={pageTitleClassName}>{pageTitle}</h1>
        {pageDescription && <p className={pageDescriptionClassName}>{pageDescription}</p>}
      </header>

      {step === "email" && (
        <form onSubmit={handleEmailContinue} className="flex flex-1 flex-col gap-6">
          <Field className="gap-3">
            <FieldLabel htmlFor="petition-email" className={labelClassName}>
              {t("pledge_form_email")}
            </FieldLabel>
            <Input
              id="petition-email"
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
              className={inputClassName}
            />
          </Field>
          {showError && (
            <p className="text-destructive text-base" role="alert">
              {t("hero_sign_error")}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-3 pt-4">
            <Button type="submit" className={primaryButtonClassName}>
              {continueLabel}
            </Button>
            <Button type="button" variant="ghost" className={ghostButtonClassName} onClick={handleBack}>
              {backLabel}
            </Button>
          </div>
        </form>
      )}

      {step === "name" && (
        <form onSubmit={handleNameContinue} className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-6">
            <Field className="gap-3">
              <FieldLabel htmlFor="petition-first-name" className={labelClassName}>
                {t("pledge_form_first_name")}
              </FieldLabel>
              <Input
                id="petition-first-name"
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  setShowError(false)
                }}
                required
                autoComplete="given-name"
                className={inputClassName}
              />
            </Field>
            <Field className="gap-3">
              <FieldLabel htmlFor="petition-last-name" className={labelClassName}>
                {t("pledge_form_last_name")}
              </FieldLabel>
              <Input
                id="petition-last-name"
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  setShowError(false)
                }}
                required
                autoComplete="family-name"
                className={inputClassName}
              />
            </Field>
          </div>
          {showError && (
            <p className="text-destructive text-base" role="alert">
              {t("pledge_form_error")}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-3 pt-4">
            <Button type="submit" className={primaryButtonClassName}>
              {continueLabel}
            </Button>
            <Button type="button" variant="ghost" className={ghostButtonClassName} onClick={handleBack}>
              {backLabel}
            </Button>
          </div>
        </form>
      )}

      {step === "address" && (
        <form onSubmit={handleAddressContinue} className="flex flex-1 flex-col gap-6">
          <Field className="gap-3">
            <FieldLabel htmlFor="petition-address" className={labelClassName}>
              {t("pledge_form_address")}
            </FieldLabel>
            <AddressAutocomplete
              value={address}
              onChange={(value) => {
                setAddress(value)
                setShowError(false)
              }}
              placeholder={t("pledge_address_placeholder")}
              className={inputClassName}
            />
          </Field>
          {showError && (
            <p className="text-destructive text-base" role="alert">
              {t("pledge_form_error")}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-3 pt-4">
            <Button type="submit" className={primaryButtonClassName}>
              {continueLabel}
            </Button>
            <Button type="button" variant="ghost" className={ghostButtonClassName} onClick={handleBack}>
              {backLabel}
            </Button>
          </div>
        </form>
      )}

      {step === "voter" && (
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              className={cn(
                primaryButtonClassName,
                "h-auto min-h-[4.5rem] py-5 text-left text-xl whitespace-normal md:min-h-20 md:py-6",
              )}
              onClick={() => handleVoterChoice(true)}
            >
              {t("pledge_form_voter_yes")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(
                primaryButtonClassName,
                "h-auto min-h-[4.5rem] py-5 text-left text-xl whitespace-normal md:min-h-20 md:py-6",
              )}
              onClick={() => handleVoterChoice(false)}
            >
              {t("pledge_form_voter_no")}
            </Button>
          </div>
          <div className="mt-auto pt-4">
            <Button
              type="button"
              variant="ghost"
              className={ghostButtonClassName}
              onClick={handleBack}
            >
              {backLabel}
            </Button>
          </div>
        </div>
      )}

      {step === "volunteer" && (
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              disabled={submitting}
              className={cn(
                primaryButtonClassName,
                "h-auto min-h-[4.5rem] py-5 text-left text-xl whitespace-normal md:min-h-20 md:py-6",
              )}
              onClick={() => submitPledge(true)}
            >
              {submitting ? t("hero_sign_button_submitting") : t("pledge_form_volunteer_yes")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              className={cn(
                primaryButtonClassName,
                "h-auto min-h-[4.5rem] py-5 text-left text-xl whitespace-normal md:min-h-20 md:py-6",
                submitting && "opacity-70",
              )}
              onClick={() => submitPledge(false)}
            >
              {submitting ? t("hero_sign_button_submitting") : t("pledge_form_volunteer_no")}
            </Button>
          </div>
          {showError && (
            <p className="text-destructive text-base" role="alert">
              {t("pledge_form_error")}
            </p>
          )}
          <div className="mt-auto pt-4">
            <Button
              type="button"
              variant="ghost"
              className={ghostButtonClassName}
              onClick={handleBack}
            >
              {backLabel}
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
