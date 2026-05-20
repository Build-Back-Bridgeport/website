"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { importLibrary, setOptions } from "@googlemaps/js-api-loader"
import { useEffect, useRef, useState } from "react"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  id?: string
  className?: string
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  disabled,
  id = "petition-address",
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  onChangeRef.current = onChange

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setLoadError(true)
      return
    }

    setOptions({ key: apiKey, v: "weekly" })

    let listener: google.maps.MapsEventListener | undefined
    let autocomplete: google.maps.places.Autocomplete | null = null

    importLibrary("places")
      .then((placesLibrary) => {
        if (!inputRef.current) return

        autocomplete = new placesLibrary.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address"],
        })

        setReady(true)

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace()
          const formatted = place?.formatted_address ?? inputRef.current?.value ?? ""
          onChangeRef.current(formatted)
        })
      })
      .catch(() => setLoadError(true))

    return () => {
      listener?.remove()
      autocomplete = null
    }
  }, [])

  return (
    <Input
      ref={loadError ? undefined : inputRef}
      id={id}
      name="address"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      autoComplete={loadError ? "street-address" : "off"}
      disabled={disabled || (!loadError && !ready)}
      aria-autocomplete="list"
      className={cn(className)}
    />
  )
}
