import { addSignature, getSignatureCount } from "@/lib/petition"
import { NextResponse } from "next/server"
import { z } from "zod"

const quickSignSchema = z.object({
  email: z.string().email(),
})

const fullSignSchema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  email: z.string().email(),
  address: z.string().min(5).max(300),
  registeredToVote: z.boolean(),
  willingToVolunteer: z.boolean(),
})

export async function GET() {
  try {
    const count = await getSignatureCount()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: "Unable to load signature count" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const fullParsed = fullSignSchema.safeParse(body)
  if (fullParsed.success) {
    try {
      const { firstName, lastName, ...rest } = fullParsed.data
      const { count, alreadySigned } = await addSignature({
        ...rest,
        name: `${firstName} ${lastName}`.trim(),
      })
      return NextResponse.json({ count, alreadySigned })
    } catch {
      return NextResponse.json(
        { error: "Unable to save your signature. Please try again." },
        { status: 500 },
      )
    }
  }

  const quickParsed = quickSignSchema.safeParse(body)
  if (!quickParsed.success) {
    return NextResponse.json({ error: "Please check your information and try again." }, { status: 400 })
  }

  try {
    const { count, alreadySigned } = await addSignature({ email: quickParsed.data.email })
    return NextResponse.json({ count, alreadySigned })
  } catch {
    return NextResponse.json(
      { error: "Unable to save your signature. Please try again." },
      { status: 500 },
    )
  }
}
