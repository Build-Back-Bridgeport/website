import { redirect } from "@/i18n/navigation"

export default async function PetitionRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { lang } = await params
  const { email } = await searchParams
  const query = email ? `?email=${encodeURIComponent(email)}` : ""
  redirect({ href: `/pledge${query}`, locale: lang })
}
