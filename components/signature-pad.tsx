"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EraserIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface SignaturePadProps {
  value: string
  onChange: (value: string) => void
  clearLabel: string
  requiredMessage: string
  className?: string
}

export function SignaturePad({
  value,
  onChange,
  clearLabel,
  requiredMessage,
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * ratio)
      canvas.height = Math.floor(rect.height * ratio)

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.strokeStyle = "#111827"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (value) {
        const image = new Image()
        image.onload = () => {
          ctx.clearRect(0, 0, rect.width, rect.height)
          ctx.drawImage(image, 0, 0, rect.width, rect.height)
          setIsEmpty(false)
        }
        image.src = value
      }
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [value])

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    drawingRef.current = true
    canvas.setPointerCapture(event.pointerId)
    const { x, y } = getPoint(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const { x, y } = getPoint(event)
    ctx.lineTo(x, y)
    ctx.stroke()
    setIsEmpty(false)
  }

  function endDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    drawingRef.current = false
    canvas.releasePointerCapture(event.pointerId)
    onChange(canvas.toDataURL("image/png"))
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    setIsEmpty(true)
    onChange("")
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative overflow-hidden rounded-lg border border-input bg-background">
        <canvas
          ref={canvasRef}
          className="h-40 w-full touch-none cursor-crosshair"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
          aria-label="Signature"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={clear}
        >
          <EraserIcon aria-hidden="true" className="size-4" />
          {clearLabel}
        </Button>
      </div>
      {isEmpty && !value && (
        <p className="text-muted-foreground text-xs" role="status">
          {requiredMessage}
        </p>
      )}
    </div>
  )
}
