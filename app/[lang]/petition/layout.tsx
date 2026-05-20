export default function PetitionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background md:items-center md:justify-center md:py-12">
      {children}
    </div>
  )
}
