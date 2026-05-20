import { cn } from "@/lib/utils"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icon.svg" alt="" className={cn(className)} />
  )
}
