import Image from "next/image"
import { cn } from "@/lib/utils"

const THUMBNAIL_SIZES = {
  banner: { width: 1200, height: 514 },
  card: { width: 640, height: 360 },
} as const

interface PlanThumbnailProps {
  src: string
  alt: string
  variant?: keyof typeof THUMBNAIL_SIZES
  priority?: boolean
  className?: string
}

export function PlanThumbnail({
  src,
  alt,
  variant = "banner",
  priority,
  className,
}: PlanThumbnailProps) {
  const { width, height } = THUMBNAIL_SIZES[variant]

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={
        variant === "banner"
          ? "(max-width: 896px) 100vw, 896px"
          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      }
      className={cn("w-full rounded-xl object-cover", className)}
    />
  )
}
