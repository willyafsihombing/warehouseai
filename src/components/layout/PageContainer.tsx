import { cn } from "@/lib/utils"

interface PageContainerProps {
  /** Konten halaman yang dibungkus */
  children: React.ReactNode
  /** Class tambahan untuk override/extend style default */
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10",
        className
      )}
    >
      {children}
    </div>
  )
}