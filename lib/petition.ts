import { getPrisma, isDatabaseConfigured } from "@/lib/db"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "signatures.json")

export interface PetitionSignInput {
  email: string
  name?: string
  address?: string
  signatureData?: string
  registeredToVote?: boolean
  willingToVolunteer?: boolean
}

export interface SignatureRecord {
  email: string
  signedAt: string
}

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, "[]", "utf-8")
  }
}

async function readFileSignatures(): Promise<SignatureRecord[]> {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, "utf-8")
  return JSON.parse(raw) as SignatureRecord[]
}

async function writeFileSignatures(signatures: SignatureRecord[]): Promise<void> {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(signatures, null, 2), "utf-8")
}

function getBaseCount(): number {
  const base = Number(process.env.PETITION_SIGNATURE_BASE ?? 0)
  return Number.isFinite(base) && base >= 0 ? base : 0
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function getFileSignatureCount(): Promise<number> {
  const signatures = await readFileSignatures()
  return getBaseCount() + signatures.length
}

async function addFileSignature(email: string): Promise<{ count: number; alreadySigned: boolean }> {
  const normalized = normalizeEmail(email)
  const signatures = await readFileSignatures()
  const existing = signatures.some((s) => s.email === normalized)

  if (!existing) {
    signatures.push({ email: normalized, signedAt: new Date().toISOString() })
    await writeFileSignatures(signatures)
  }

  return {
    count: getBaseCount() + signatures.length,
    alreadySigned: existing,
  }
}

export async function getSignatureCount(): Promise<number> {
  if (isDatabaseConfigured()) {
    const prisma = getPrisma()
    const count = await prisma.petitionSignature.count()
    return getBaseCount() + count
  }

  return getFileSignatureCount()
}

export async function addSignature(
  input: PetitionSignInput,
): Promise<{ count: number; alreadySigned: boolean }> {
  const normalized = normalizeEmail(input.email)
  const isFullSignature = Boolean(
    input.name?.trim() &&
      input.address?.trim() &&
      typeof input.registeredToVote === "boolean" &&
      typeof input.willingToVolunteer === "boolean",
  )

  if (isDatabaseConfigured()) {
    const prisma = getPrisma()
    const existing = await prisma.petitionSignature.findUnique({
      where: { email: normalized },
    })

    if (existing) {
      if (isFullSignature) {
        await prisma.petitionSignature.update({
          where: { email: normalized },
          data: {
            name: input.name!.trim(),
            address: input.address!.trim(),
            signatureData: input.signatureData!.trim(),
            registeredToVote: input.registeredToVote,
            willingToVolunteer: input.willingToVolunteer,
          },
        })
      }

      const count = await getSignatureCount()
      return { count, alreadySigned: true }
    }

    await prisma.petitionSignature.create({
      data: {
        email: normalized,
        name: input.name?.trim() || null,
        address: input.address?.trim() || null,
        signatureData: input.signatureData?.trim() || null,
        registeredToVote: input.registeredToVote ?? null,
        willingToVolunteer: input.willingToVolunteer ?? null,
      },
    })

    const count = await getSignatureCount()
    return { count, alreadySigned: false }
  }

  return addFileSignature(normalized)
}
