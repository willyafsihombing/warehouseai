import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InsightItem } from "@/src/types"

// Reuse priority type langsung dari InsightItem (types/index.ts),
// supaya tidak ada union literal yang terduplikasi dan bisa drift.
type Priority = InsightItem["priority"]

interface PriorityBadgeProps {
  priority: Priority
}

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  critical: {
    label: "Kritis",
    className: "bg-priority-critical text-priority-critical-foreground",
  },
  high: {
    label: "Tinggi",
    className: "bg-priority-high text-priority-high-foreground",
  },
  medium: {
    label: "Sedang",
    className: "bg-priority-medium text-priority-medium-foreground",
  },
  low: {
    label: "Rendah",
    className: "bg-priority-low text-priority-low-foreground",
  },
}

// Server Component — murni tampilan, tidak ada interaktivitas.
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]

  return (
    <Badge
      className={cn(
        "pointer-events-none gap-1.5 border-transparent px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {priority === "critical" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {config.label}
    </Badge>
  )
}