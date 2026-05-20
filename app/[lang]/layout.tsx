import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import "@/app/globals.css"
import { JsonLd } from "@/components/json-ld"
import { routing } from "@/i18n/routing"
import { buildRootMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo"
import { SUPPORTED_LANGS } from "@/lib/site"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const interHeading = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return buildRootMetadata(lang)
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  if (!routing.locales.includes(lang as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(lang)
  const messages = await getMessages()

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${interHeading.variable} ${jetbrainsMono.variable} theme`}
    >
      <body className="isolate min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={[await organizationJsonLd(lang), await webSiteJsonLd(lang)]} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
