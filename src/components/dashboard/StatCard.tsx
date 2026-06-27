import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Props untuk StatCard.
 * Dipakai di dashboard untuk menampilkan metrik ringkas
 * (misal: "Total Products", "Low Stock Items", "Total Warehouses").
 */
interface StatCardProps {
  /** Label metrik, misal "Total Products" */
  title: string
  /** Nilai utama yang ditonjolkan, misal 248 atau "Rp 12.4M" */
  value: string | number
  /** Keterangan tambahan kecil di bawah value, opsional */
  description?: string
  /** Icon yang ditampilkan di lingkaran kecil pojok kanan atas */
  icon?: React.ReactNode
  /** Badge tren naik/turun, opsional. Contoh: { value: 12, isPositive: true } → "+12%" */
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Server Component — murni tampilan data, tidak ada interaktivitas.
export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}