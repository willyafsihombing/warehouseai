import { typography } from "@/src/lib/typography"

/**
 * Props untuk PageHeader.
 * Dipakai di bagian paling atas setiap halaman dashboard
 * (Products, Warehouses, Stock, AI Insights, dll).
 */
interface PageHeaderProps {
  /** Judul halaman, wajib diisi (misal: "Products", "Warehouses") */
  title: string
  /** Subjudul/keterangan singkat di bawah title, opsional */
  description?: string
  /** Slot untuk action di kanan, misal tombol "Add Product" */
  action?: React.ReactNode
}

// Server Component — tidak ada interaktivitas, jadi tidak perlu "use client".
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="space-y-1">
        <h1 className={typography.heading.h1}>{title}</h1>
        {description && (
          <p className={typography.body.muted}>{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  )
}