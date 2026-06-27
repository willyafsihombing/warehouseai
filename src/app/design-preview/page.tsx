// ⚠️ DEV-ONLY PAGE — hapus folder ini sebelum deploy ke production.
// Halaman ini cuma untuk preview visual design system (warna, tipografi,
// komponen) selama development, tidak ada logic bisnis di sini.

import { Package } from "lucide-react"

import { typography } from "@/src/lib/typography"
import { PageContainer } from "@/src/components/layout/PageContainer"
import { PageHeader } from "@/src/components/layout/PageHeader"
import { StatCard } from "@/src/components/dashboard/StatCard"
import { PriorityBadge } from "@/src/components/dashboard/PriorityBadge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Komponen lokal kecil cuma untuk halaman ini — bungkus tiap section
// dengan heading + border, biar konsisten tanpa diulang-ulang.
function PreviewSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 border-b pb-8 last:border-b-0">
      <h2 className={typography.heading.h2}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-16 w-full rounded-md ${className}`} />
      <p className="text-sm font-medium text-foreground">{name}</p>
    </div>
  )
}

// Server Component — tidak ada state/interaksi yang dipasang di halaman
// ini sendiri. Select dari Shadcn sudah punya "use client" di file
// internalnya, jadi aman dipakai di sini tanpa menjadikan page ini client.
export default function DesignPreviewPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Design Preview"
        description="Halaman internal untuk preview design system — colors, typography, components"
      />

      <div className="space-y-10">
        <PreviewSection title="Colors">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <ColorSwatch name="Primary" className="bg-primary" />
            <ColorSwatch name="Priority Critical" className="bg-priority-critical" />
            <ColorSwatch name="Priority High" className="bg-priority-high" />
            <ColorSwatch name="Priority Medium" className="bg-priority-medium" />
            <ColorSwatch name="Priority Low" className="bg-priority-low" />
          </div>
        </PreviewSection>

        <PreviewSection title="Typography">
          <div className="space-y-3">
            <p className={typography.heading.h1}>Heading H1 — Page Title</p>
            <p className={typography.heading.h2}>Heading H2 — Section Title</p>
            <p className={typography.heading.h3}>Heading H3 — Card Title</p>
            <p className={typography.body.default}>
              Body Default — teks konten normal untuk paragraf.
            </p>
            <p className={typography.body.sm}>
              Body Small — teks konten yang lebih kecil.
            </p>
            <p className={typography.body.muted}>
              Body Muted — teks sekunder/redup, misal timestamp.
            </p>
            <p className={typography.label.default}>Label Default — Nama Field</p>
            <p className={typography.label.sm}>Label Small — Tag Kecil</p>
          </div>
        </PreviewSection>

        <PreviewSection title="Buttons">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default" size="sm">Default</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Produk"
              value="248"
              description="di 3 gudang"
              icon={<Package className="h-4 w-4" />}
              trend={{ value: 12, isPositive: true }}
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Badges">
          <div className="flex flex-wrap items-center gap-3">
            <PriorityBadge priority="critical" />
            <PriorityBadge priority="high" />
            <PriorityBadge priority="medium" />
            <PriorityBadge priority="low" />
          </div>
        </PreviewSection>

        <PreviewSection title="Shadcn Components">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-input">Input</Label>
              <Input id="preview-input" placeholder="Contoh input..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-select">Select</Label>
              <Select>
                <SelectTrigger id="preview-select">
                  <SelectValue placeholder="Pilih gudang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gudang-a">Gudang A</SelectItem>
                  <SelectItem value="gudang-b">Gudang B</SelectItem>
                  <SelectItem value="gudang-c">Gudang C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PreviewSection>
      </div>
    </PageContainer>
  )
}